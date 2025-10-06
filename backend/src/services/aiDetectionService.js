const crypto = require('crypto');
const logger = require('../utils/logger');

/**
 * AI-powered code plagiarism detection service
 * Uses multiple techniques to detect code similarity and cheating
 */

/**
 * Calculate code fingerprint using AST-based hashing
 */
function calculateCodeFingerprint(code) {
  // Remove comments and whitespace
  const normalized = normalizeCode(code);
  
  // Create hash of normalized code
  return crypto
    .createHash('sha256')
    .update(normalized)
    .digest('hex');
}

/**
 * Normalize code for comparison
 */
function normalizeCode(code) {
  return code
    // Remove single-line comments
    .replace(/\/\/.*/g, '')
    // Remove multi-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    // Trim
    .trim()
    // Convert to lowercase for case-insensitive comparison
    .toLowerCase();
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,    // deletion
          dp[i][j - 1] + 1,    // insertion
          dp[i - 1][j - 1] + 1 // substitution
        );
      }
    }
  }

  return dp[m][n];
}

/**
 * Calculate similarity percentage between two code snippets
 */
function calculateSimilarity(code1, code2) {
  const normalized1 = normalizeCode(code1);
  const normalized2 = normalizeCode(code2);

  if (normalized1 === normalized2) return 100;

  const distance = levenshteinDistance(normalized1, normalized2);
  const maxLength = Math.max(normalized1.length, normalized2.length);
  
  const similarity = ((maxLength - distance) / maxLength) * 100;
  return Math.round(similarity * 100) / 100;
}

/**
 * Detect suspicious patterns in code
 */
function detectSuspiciousPatterns(code) {
  const patterns = [];

  // Check for obfuscation attempts
  if (code.includes('eval(') || code.includes('Function(')) {
    patterns.push({
      type: 'obfuscation',
      severity: 'high',
      message: 'Detected potential code obfuscation (eval/Function)'
    });
  }

  // Check for unusual character usage
  const unicodePattern = /[^\x00-\x7F]/g;
  const unicodeMatches = code.match(unicodePattern);
  if (unicodeMatches && unicodeMatches.length > 10) {
    patterns.push({
      type: 'unicode_obfuscation',
      severity: 'medium',
      message: 'Excessive use of non-ASCII characters detected'
    });
  }

  // Check for very long lines (possible minified code)
  const lines = code.split('\n');
  const longLines = lines.filter(line => line.length > 200);
  if (longLines.length > 3) {
    patterns.push({
      type: 'minification',
      severity: 'low',
      message: 'Detected possible minified or concatenated code'
    });
  }

  // Check for unusual variable naming patterns
  const varPattern = /\b[a-z]{1,2}\d+\b/g;
  const suspiciousVars = code.match(varPattern);
  if (suspiciousVars && suspiciousVars.length > 10) {
    patterns.push({
      type: 'variable_naming',
      severity: 'medium',
      message: 'Unusual variable naming pattern detected (e.g., a1, b2, c3)'
    });
  }

  return patterns;
}

/**
 * Analyze code complexity
 */
function analyzeComplexity(code) {
  const lines = code.split('\n').filter(line => line.trim().length > 0);
  
  // Count control structures
  const ifCount = (code.match(/\bif\b/g) || []).length;
  const forCount = (code.match(/\bfor\b/g) || []).length;
  const whileCount = (code.match(/\bwhile\b/g) || []).length;
  const functionCount = (code.match(/function\b/g) || []).length;
  
  // Calculate cyclomatic complexity (simplified)
  const cyclomaticComplexity = 1 + ifCount + forCount + whileCount;

  return {
    linesOfCode: lines.length,
    controlStructures: ifCount + forCount + whileCount,
    functions: functionCount,
    cyclomaticComplexity,
    complexity: cyclomaticComplexity < 10 ? 'low' : 
                cyclomaticComplexity < 20 ? 'medium' : 'high'
  };
}

/**
 * Compare submission with known solutions
 */
exports.detectPlagiarism = async (code, previousSubmissions = []) => {
  try {
    const fingerprint = calculateCodeFingerprint(code);
    const suspiciousPatterns = detectSuspiciousPatterns(code);
    const complexity = analyzeComplexity(code);

    const matches = [];
    let maxSimilarity = 0;

    // Compare with previous submissions
    for (const submission of previousSubmissions) {
      const similarity = calculateSimilarity(code, submission.code);
      
      if (similarity > 70) {
        matches.push({
          submissionId: submission.id,
          userId: submission.userId,
          similarity,
          timestamp: submission.timestamp
        });
        
        maxSimilarity = Math.max(maxSimilarity, similarity);
      }
    }

    // Calculate risk score
    let riskScore = 0;
    
    // High similarity increases risk
    if (maxSimilarity > 90) riskScore += 40;
    else if (maxSimilarity > 80) riskScore += 30;
    else if (maxSimilarity > 70) riskScore += 20;

    // Suspicious patterns increase risk
    suspiciousPatterns.forEach(pattern => {
      if (pattern.severity === 'high') riskScore += 20;
      else if (pattern.severity === 'medium') riskScore += 10;
      else riskScore += 5;
    });

    // Very low complexity for a programming task is suspicious
    if (complexity.cyclomaticComplexity < 3) riskScore += 10;

    const isPlagiarized = riskScore > 50;
    const confidence = Math.min(riskScore, 100);

    logger.info('Plagiarism detection completed', {
      fingerprint,
      matchesFound: matches.length,
      maxSimilarity,
      riskScore,
      isPlagiarized
    });

    return {
      isPlagiarized,
      confidence,
      riskScore,
      fingerprint,
      matches,
      suspiciousPatterns,
      complexity,
      recommendation: isPlagiarized 
        ? 'Manual review recommended - high similarity detected'
        : riskScore > 30 
          ? 'Minor concerns detected - consider review'
          : 'No significant issues detected'
    };

  } catch (error) {
    logger.error('Plagiarism detection error:', error);
    throw error;
  }
};

/**
 * Detect AI-generated code
 */
exports.detectAIGenerated = async (code) => {
  try {
    const indicators = [];
    let aiScore = 0;

    // Check for overly perfect formatting
    const lines = code.split('\n');
    const perfectlyIndented = lines.every(line => {
      const indent = line.match(/^\s*/)[0].length;
      return indent % 2 === 0 || indent % 4 === 0;
    });
    
    if (perfectlyIndented && lines.length > 10) {
      indicators.push({
        type: 'perfect_formatting',
        message: 'Code shows unusually perfect indentation'
      });
      aiScore += 15;
    }

    // Check for comprehensive comments
    const commentLines = lines.filter(line => 
      line.trim().startsWith('//') || 
      line.trim().startsWith('/*') ||
      line.trim().startsWith('*')
    );
    
    const commentRatio = commentLines.length / lines.length;
    if (commentRatio > 0.3) {
      indicators.push({
        type: 'excessive_comments',
        message: 'Unusually high ratio of comments to code'
      });
      aiScore += 10;
    }

    // Check for generic variable names
    const genericNames = ['result', 'temp', 'data', 'value', 'item', 'element'];
    const varNames = code.match(/\b(?:let|const|var)\s+(\w+)/g) || [];
    const genericCount = varNames.filter(v => 
      genericNames.some(g => v.includes(g))
    ).length;
    
    if (genericCount > 5) {
      indicators.push({
        type: 'generic_naming',
        message: 'High use of generic variable names'
      });
      aiScore += 10;
    }

    // Check for docstring patterns
    if (code.includes('/**') && code.includes('@param') && code.includes('@returns')) {
      indicators.push({
        type: 'docstrings',
        message: 'Professional-level documentation detected'
      });
      aiScore += 15;
    }

    // Check for error handling patterns
    const tryCatchCount = (code.match(/try\s*{/g) || []).length;
    if (tryCatchCount > 2) {
      indicators.push({
        type: 'error_handling',
        message: 'Comprehensive error handling detected'
      });
      aiScore += 10;
    }

    const isAIGenerated = aiScore > 40;
    const confidence = Math.min(aiScore, 100);

    logger.info('AI detection completed', {
      aiScore,
      indicatorsFound: indicators.length,
      isAIGenerated
    });

    return {
      isAIGenerated,
      confidence,
      aiScore,
      indicators,
      recommendation: isAIGenerated
        ? 'High probability of AI assistance - manual review recommended'
        : aiScore > 25
          ? 'Moderate indicators present - consider review'
          : 'Appears to be human-written code'
    };

  } catch (error) {
    logger.error('AI detection error:', error);
    throw error;
  }
};

/**
 * Comprehensive code analysis
 */
exports.analyzeCode = async (code, previousSubmissions = []) => {
  try {
    const [plagiarismResult, aiResult] = await Promise.all([
      this.detectPlagiarism(code, previousSubmissions),
      this.detectAIGenerated(code)
    ]);

    const overallRisk = Math.max(
      plagiarismResult.riskScore,
      aiResult.aiScore
    );

    const flagged = plagiarismResult.isPlagiarized || aiResult.isAIGenerated;

    return {
      flagged,
      overallRisk,
      plagiarism: plagiarismResult,
      aiDetection: aiResult,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    logger.error('Code analysis error:', error);
    throw error;
  }
};

module.exports = exports;
