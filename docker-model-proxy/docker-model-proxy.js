/**
 * Docker Model Runner Proxy Server
 * 
 * This lightweight proxy allows containerized applications to access
 * Docker Desktop's Model Runner by forwarding HTTP requests to the
 * Docker CLI's 'model run' command.
 * 
 * Usage: node docker-model-proxy.js
 * Then configure backend to use: http://host.docker.internal:11435
 */

const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
const PORT = 11435;

app.use(express.json({ limit: '10mb' }));

// Helper function to run docker model with file-based prompts (avoids Windows escaping issues)
async function runDockerModel(model, prompt) {
  return new Promise((resolve, reject) => {
    // Create temporary file for prompt
    const tmpFile = path.join(os.tmpdir(), `docker-model-prompt-${Date.now()}.txt`);
    
    try {
      fs.writeFileSync(tmpFile, prompt, 'utf8');
      
      // Read from file and pipe to docker model
      const command = `type "${tmpFile}" | docker model run ${model}`;
      
      exec(command, {
        timeout: 120000,
        maxBuffer: 10 * 1024 * 1024,
        shell: 'powershell.exe'
      }, (error, stdout, stderr) => {
        // Clean up temp file
        try {
          fs.unlinkSync(tmpFile);
        } catch (e) {
          // Ignore cleanup errors
        }
        
        if (error && !stderr.includes('pulling')) {
          reject(new Error(`Docker command failed: ${error.message}${stderr ? '\n' + stderr : ''}`));
        } else {
          resolve(stdout.trim());
        }
      });
    } catch (fileError) {
      reject(new Error(`Failed to create temp file: ${fileError.message}`));
    }
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Docker Model Runner Proxy' });
});

// Model completion endpoint (OpenAI-compatible format)
app.post('/v1/chat/completions', async (req, res) => {
  try {
    const { messages, model = 'gpt-oss', temperature = 0.7 } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    // Extract the last user message as the prompt
    const userMessages = messages.filter(m => m.role === 'user');
    if (userMessages.length === 0) {
      return res.status(400).json({ error: 'At least one user message is required' });
    }
    
    const prompt = userMessages[userMessages.length - 1].content;
    
    console.log(`[${new Date().toISOString()}] Generating completion for model: ${model}`);
    console.log(`  Prompt preview: ${prompt.substring(0, 100)}...`);
    
    const startTime = Date.now();
    const content = await runDockerModel(model, prompt);
    const duration = Date.now() - startTime;
    
    console.log(`  ✓ Generation completed in ${duration}ms`);
    console.log(`  Response preview: ${content.substring(0, 100)}...`);
    
    // Return OpenAI-compatible response
    res.json({
      id: `chatcmpl-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: model,
      choices: [{
        index: 0,
        message: {
          role: 'assistant',
          content: content
        },
        finish_reason: 'stop'
      }],
      usage: {
        prompt_tokens: prompt.length / 4, // rough estimate
        completion_tokens: content.length / 4,
        total_tokens: (prompt.length + content.length) / 4
      }
    });
    
  } catch (error) {
    console.error('Error generating completion:', error.message);
    res.status(500).json({
      error: {
        message: `Failed to generate completion: ${error.message}`,
        type: 'docker_model_error'
      }
    });
  }
});

// Simple completion endpoint (non-OpenAI format)
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, model = 'gpt-oss' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'prompt is required' });
    }
    
    console.log(`[${new Date().toISOString()}] Simple generation for model: ${model}`);
    console.log(`  Prompt preview: ${prompt.substring(0, 100)}...`);
    
    const startTime = Date.now();
    const response = await runDockerModel(model, prompt);
    const duration = Date.now() - startTime;
    
    console.log(`  ✓ Generation completed in ${duration}ms`);
    
    res.json({
      model: model,
      response: response,
      done: true
    });
    
  } catch (error) {
    console.error('Error generating:', error.message);
    res.status(500).json({
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║   Docker Model Runner Proxy Server                     ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Health check: http://localhost:${PORT}/health`);
  console.log('');
  console.log('Endpoints:');
  console.log(`  POST /v1/chat/completions  (OpenAI-compatible)`);
  console.log(`  POST /api/generate         (Simple format)`);
  console.log('');
  console.log('Container access: http://host.docker.internal:' + PORT);
  console.log('');
  console.log('Press Ctrl+C to stop');
  console.log('');
});
