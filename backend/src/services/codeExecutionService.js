const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const logger = require('../utils/logger');

// Execution limits
const EXECUTION_LIMITS = {
  timeout: 5000, // 5 seconds
  memory: 256 * 1024 * 1024, // 256MB
  maxOutputSize: 10 * 1024 // 10KB
};

// Language configurations
const LANGUAGE_CONFIG = {
  javascript: {
    extension: '.js',
    command: (file) => `node ${file}`,
    docker: 'node:18-alpine'
  },
  python: {
    extension: '.py',
    command: (file) => `python3 ${file}`,
    docker: 'python:3.11-alpine'
  },
  java: {
    extension: '.java',
    compile: (file) => `javac ${file}`,
    command: (file) => {
      const className = path.basename(file, '.java');
      return `java -cp ${path.dirname(file)} ${className}`;
    },
    docker: 'openjdk:17-alpine'
  },
  cpp: {
    extension: '.cpp',
    compile: (file, output) => `g++ -o ${output} ${file}`,
    command: (output) => output,
    docker: 'gcc:12-alpine'
  },
  c: {
    extension: '.c',
    compile: (file, output) => `gcc -o ${output} ${file}`,
    command: (output) => output,
    docker: 'gcc:12-alpine'
  },
  csharp: {
    extension: '.cs',
    compile: (file) => `csc ${file}`,
    command: (file) => {
      const exeFile = file.replace('.cs', '.exe');
      return `mono ${exeFile}`;
    },
    docker: 'mono:latest'
  },
  go: {
    extension: '.go',
    command: (file) => `go run ${file}`,
    docker: 'golang:1.21-alpine'
  },
  rust: {
    extension: '.rs',
    compile: (file, output) => `rustc -o ${output} ${file}`,
    command: (output) => output,
    docker: 'rust:1.75-alpine'
  },
  php: {
    extension: '.php',
    command: (file) => `php ${file}`,
    docker: 'php:8.2-alpine'
  },
  ruby: {
    extension: '.rb',
    command: (file) => `ruby ${file}`,
    docker: 'ruby:3.2-alpine'
  }
};

/**
 * Execute code in a sandboxed environment
 */
exports.executeCode = async (code, language, input = '') => {
  const startTime = Date.now();
  const sessionId = crypto.randomBytes(8).toString('hex');
  const tempDir = path.join('/tmp', `code-exec-${sessionId}`);
  
  try {
    // Validate language
    const langConfig = LANGUAGE_CONFIG[language];
    if (!langConfig) {
      return {
        success: false,
        error: `Unsupported language: ${language}`,
        executionTime: 0
      };
    }

    // Create temp directory
    await fs.mkdir(tempDir, { recursive: true });

    // Write code to file
    const fileName = `main${langConfig.extension}`;
    const filePath = path.join(tempDir, fileName);
    await fs.writeFile(filePath, code);

    let output = '';
    let error = '';

    // Compile if needed
    if (langConfig.compile) {
      const outputPath = path.join(tempDir, 'output');
      const compileCommand = langConfig.compile(filePath, outputPath);
      
      try {
        const compileResult = await executeCommand(compileCommand, tempDir, EXECUTION_LIMITS.timeout);
        if (compileResult.error) {
          return {
            success: false,
            error: `Compilation error:\n${compileResult.error}`,
            executionTime: Date.now() - startTime
          };
        }
      } catch (err) {
        return {
          success: false,
          error: `Compilation failed: ${err.message}`,
          executionTime: Date.now() - startTime
        };
      }
    }

    // Execute code
    const executeCommand = langConfig.compile
      ? langConfig.command(path.join(tempDir, 'output'))
      : langConfig.command(filePath);

    const result = await executeCommand(executeCommand, tempDir, EXECUTION_LIMITS.timeout, input);

    output = result.output;
    error = result.error;

    // Check output size
    if (output.length > EXECUTION_LIMITS.maxOutputSize) {
      output = output.substring(0, EXECUTION_LIMITS.maxOutputSize) + '\n... (output truncated)';
    }

    const executionTime = Date.now() - startTime;

    // Log execution
    logger.info('Code execution', {
      sessionId,
      language,
      executionTime,
      success: !error,
      outputSize: output.length
    });

    return {
      success: !error,
      output: output || 'No output',
      error: error || null,
      executionTime
    };

  } catch (err) {
    logger.error('Code execution error:', err);
    return {
      success: false,
      error: err.message,
      executionTime: Date.now() - startTime
    };
  } finally {
    // Cleanup temp directory
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (cleanupErr) {
      logger.error('Failed to cleanup temp directory:', cleanupErr);
    }
  }
};

/**
 * Execute code with Docker isolation
 */
exports.executeCodeDocker = async (code, language, input = '') => {
  const startTime = Date.now();
  const sessionId = crypto.randomBytes(8).toString('hex');
  
  try {
    const langConfig = LANGUAGE_CONFIG[language];
    if (!langConfig || !langConfig.docker) {
      return {
        success: false,
        error: `Docker execution not supported for language: ${language}`,
        executionTime: 0
      };
    }

    const fileName = `main${langConfig.extension}`;
    const containerName = `code-exec-${sessionId}`;

    // Prepare Docker command
    let dockerCommand = `docker run --name ${containerName} ` +
      `--rm ` +
      `--network none ` + // No network access
      `--memory=${EXECUTION_LIMITS.memory / (1024 * 1024)}m ` + // Memory limit
      `--cpus=0.5 ` + // CPU limit
      `--read-only ` + // Read-only filesystem
      `--tmpfs /tmp:rw,size=10m ` + // Writable /tmp with size limit
      `-i ${langConfig.docker} `;

    // For compiled languages, need multi-step process
    if (langConfig.compile) {
      // Save code to temp file for Docker
      const tempCodePath = path.join('/tmp', `${sessionId}${langConfig.extension}`);
      await fs.writeFile(tempCodePath, code);

      // Compile in Docker
      const compileCmd = `${dockerCommand} sh -c "cat > ${fileName} && ${langConfig.compile(fileName, 'output')}"`;
      const compileResult = await executeCommand(
        `cat ${tempCodePath} | ${compileCmd}`,
        '/tmp',
        EXECUTION_LIMITS.timeout
      );

      await fs.unlink(tempCodePath);

      if (compileResult.error) {
        return {
          success: false,
          error: `Compilation error:\n${compileResult.error}`,
          executionTime: Date.now() - startTime
        };
      }

      // Execute compiled program
      dockerCommand += `sh -c "${langConfig.command('output')}"`;
    } else {
      // Direct execution
      dockerCommand += `sh -c "cat > ${fileName} && ${langConfig.command(fileName)}"`;
    }

    // Execute code
    const result = await executeCommand(
      dockerCommand,
      '/tmp',
      EXECUTION_LIMITS.timeout,
      input || code
    );

    const executionTime = Date.now() - startTime;

    let output = result.output;
    if (output.length > EXECUTION_LIMITS.maxOutputSize) {
      output = output.substring(0, EXECUTION_LIMITS.maxOutputSize) + '\n... (output truncated)';
    }

    logger.info('Docker code execution', {
      sessionId,
      language,
      executionTime,
      success: !result.error
    });

    return {
      success: !result.error,
      output: output || 'No output',
      error: result.error || null,
      executionTime
    };

  } catch (err) {
    logger.error('Docker execution error:', err);
    return {
      success: false,
      error: err.message,
      executionTime: Date.now() - startTime
    };
  }
};

/**
 * Test code against test cases
 */
exports.testCode = async (code, language, testCases) => {
  const results = [];
  
  for (const testCase of testCases) {
    const result = await this.executeCode(code, language, testCase.input);
    
    const passed = result.success && 
                   result.output.trim() === testCase.expectedOutput.trim();
    
    results.push({
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      actualOutput: result.output,
      passed,
      error: result.error,
      executionTime: result.executionTime
    });
  }

  const allPassed = results.every(r => r.passed);
  const totalTime = results.reduce((sum, r) => sum + r.executionTime, 0);

  return {
    success: allPassed,
    results,
    totalTests: testCases.length,
    passedTests: results.filter(r => r.passed).length,
    totalExecutionTime: totalTime
  };
};

/**
 * Helper function to execute shell command
 */
function executeCommand(command, cwd, timeout, input = '') {
  return new Promise((resolve) => {
    const child = exec(
      command,
      {
        cwd,
        timeout,
        maxBuffer: EXECUTION_LIMITS.maxOutputSize,
        killSignal: 'SIGKILL'
      },
      (error, stdout, stderr) => {
        if (error) {
          if (error.killed) {
            resolve({
              output: stdout,
              error: 'Execution timeout exceeded (5 seconds)'
            });
          } else {
            resolve({
              output: stdout,
              error: stderr || error.message
            });
          }
        } else {
          resolve({
            output: stdout,
            error: stderr
          });
        }
      }
    );

    // Provide input if specified
    if (input) {
      child.stdin.write(input);
      child.stdin.end();
    }
  });
}

module.exports = exports;
