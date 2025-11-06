const crypto = require('crypto');

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

    console.log('Plagiarism detection completed', {
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
    console.error('Plagiarism detection error:', error);
    throw error;
  }
};

/**
 * Analyze comment-to-code ratio
 */
function analyzeCommentRatio(code) {
  const lines = code.split('\n');
  const codeLines = lines.filter(line => line.trim().length > 0);
  
  const commentLines = lines.filter(line => {
    const trimmed = line.trim();
    return trimmed.startsWith('//') || 
           trimmed.startsWith('/*') ||
           trimmed.startsWith('*') ||
           trimmed.startsWith('#');
  });
  
  const multiLineComments = (code.match(/\/\*[\s\S]*?\*\//g) || []);
  const multiLineCommentLines = multiLineComments.reduce((sum, comment) => {
    return sum + comment.split('\n').length;
  }, 0);
  
  const totalCommentLines = commentLines.length + multiLineCommentLines;
  const ratio = codeLines.length > 0 ? totalCommentLines / codeLines.length : 0;
  
  return {
    commentLines: totalCommentLines,
    codeLines: codeLines.length,
    ratio: Math.round(ratio * 100) / 100,
    percentage: Math.round(ratio * 10000) / 100
  };
}

/**
 * Analyze variable naming patterns for AI fingerprints
 */
function analyzeVariableNaming(code) {
  const patterns = {
    veryLongNames: [],
    descriptiveNames: [],
    camelCaseNames: [],
    underscoreNames: [],
    singleLetterNames: [],
    genericNames: []
  };
  
  // Extract variable declarations
  const varPatterns = [
    /(?:let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
    /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
    /([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g,
    /def\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g // Python
  ];
  
  const allVars = new Set();
  varPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(code)) !== null) {
      allVars.add(match[1]);
    }
  });
  
  const genericKeywords = ['result', 'temp', 'data', 'value', 'item', 'element', 
                           'response', 'output', 'input', 'obj', 'arr'];
  
  allVars.forEach(varName => {
    // Very long descriptive names (typical of AI)
    if (varName.length > 20) {
      patterns.veryLongNames.push(varName);
    }
    
    // Descriptive multi-word names
    if (varName.length > 10 && /[A-Z]/.test(varName.slice(1))) {
      patterns.descriptiveNames.push(varName);
    }
    
    // Perfect camelCase
    if (/^[a-z]+([A-Z][a-z]+)+$/.test(varName)) {
      patterns.camelCaseNames.push(varName);
    }
    
    // Underscore naming
    if (varName.includes('_')) {
      patterns.underscoreNames.push(varName);
    }
    
    // Single letter variables
    if (varName.length === 1) {
      patterns.singleLetterNames.push(varName);
    }
    
    // Generic names
    if (genericKeywords.some(keyword => varName.toLowerCase().includes(keyword))) {
      patterns.genericNames.push(varName);
    }
  });
  
  const totalVars = allVars.size;
  const longNameRatio = totalVars > 0 ? patterns.veryLongNames.length / totalVars : 0;
  const genericRatio = totalVars > 0 ? patterns.genericNames.length / totalVars : 0;
  
  return {
    patterns,
    totalVariables: totalVars,
    longNameRatio: Math.round(longNameRatio * 100) / 100,
    genericRatio: Math.round(genericRatio * 100) / 100,
    averageNameLength: totalVars > 0 
      ? Math.round([...allVars].reduce((sum, v) => sum + v.length, 0) / totalVars) 
      : 0
  };
}

/**
 * Detect boilerplate code patterns
 */
function detectBoilerplate(code) {
  const boilerplatePatterns = [];
  let boilerplateScore = 0;
  
  // Common boilerplate phrases
  const phrases = [
    'This function',
    'This method',
    'Initialize',
    'Constructor',
    'Helper function',
    'Utility function',
    '@param',
    '@returns',
    '@throws',
    'TODO:',
    'FIXME:',
    'eslint-disable',
    'prettier-ignore'
  ];
  
  phrases.forEach(phrase => {
    if (code.includes(phrase)) {
      boilerplatePatterns.push(phrase);
      boilerplateScore += 5;
    }
  });
  
  // Check for import/require statements ratio
  const lines = code.split('\n');
  const importLines = lines.filter(line => 
    line.trim().startsWith('import ') || 
    line.trim().startsWith('require(') ||
    line.trim().startsWith('from ')
  );
  
  if (importLines.length > 10) {
    boilerplatePatterns.push('excessive_imports');
    boilerplateScore += 10;
  }
  
  // Check for standard headers/templates
  const hasStandardHeader = code.includes('Copyright') || 
                           code.includes('Licensed under') ||
                           code.includes('Author:');
  
  if (hasStandardHeader) {
    boilerplatePatterns.push('standard_header');
    boilerplateScore += 15;
  }
  
  return {
    patterns: boilerplatePatterns,
    score: boilerplateScore,
    hasBoilerplate: boilerplateScore > 20
  };
}

/**
 * Detect GPT-style code fingerprints
 */
function detectGPTFingerprints(code) {
  const fingerprints = [];
  let gptScore = 0;
  
  // GPT tends to add explanatory comments above code blocks
  const explanatoryCommentPattern = /\/\/\s*(This|Here|Now|First|Then|Finally|Note)/gi;
  const explanatoryComments = code.match(explanatoryCommentPattern) || [];
  if (explanatoryComments.length > 3) {
    fingerprints.push({
      type: 'explanatory_comments',
      count: explanatoryComments.length,
      message: 'Multiple explanatory comments detected'
    });
    gptScore += 15;
  }
  
  // GPT often uses type hints and annotations
  const typeHints = (code.match(/:\s*(str|int|float|bool|list|dict|tuple|Any|Optional)/g) || []).length;
  if (typeHints > 5) {
    fingerprints.push({
      type: 'type_annotations',
      count: typeHints,
      message: 'Extensive type annotations'
    });
    gptScore += 10;
  }
  
  // GPT tends to write complete docstrings
  const docstringPattern = /'''[\s\S]*?'''|"""[\s\S]*?"""/g;
  const docstrings = code.match(docstringPattern) || [];
  if (docstrings.length > 2) {
    fingerprints.push({
      type: 'docstrings',
      count: docstrings.length,
      message: 'Multiple comprehensive docstrings'
    });
    gptScore += 10;
  }
  
  // GPT uses consistent error handling patterns
  const errorPatterns = [
    /except\s+\w+\s+as\s+e:/g,
    /catch\s*\(\s*\w+\s*\)/g,
    /try\s*{[\s\S]*?}\s*catch/g
  ];
  
  let errorHandlingCount = 0;
  errorPatterns.forEach(pattern => {
    const matches = code.match(pattern) || [];
    errorHandlingCount += matches.length;
  });
  
  if (errorHandlingCount > 2) {
    fingerprints.push({
      type: 'error_handling',
      count: errorHandlingCount,
      message: 'Comprehensive error handling'
    });
    gptScore += 10;
  }
  
  // GPT often includes validation logic
  const validationKeywords = ['validate', 'check', 'verify', 'ensure', 'assert'];
  let validationCount = 0;
  validationKeywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\w*\\b`, 'gi');
    const matches = code.match(regex) || [];
    validationCount += matches.length;
  });
  
  if (validationCount > 5) {
    fingerprints.push({
      type: 'validation_logic',
      count: validationCount,
      message: 'Extensive validation logic'
    });
    gptScore += 10;
  }
  
  // GPT uses consistent formatting with proper spacing
  const lines = code.split('\n');
  const properlySpacedLines = lines.filter(line => {
    if (line.trim().length === 0) return true;
    const indent = line.match(/^\s*/)[0].length;
    return indent % 2 === 0 || indent % 4 === 0;
  });
  
  const spacingRatio = lines.length > 0 ? properlySpacedLines.length / lines.length : 0;
  if (spacingRatio > 0.95 && lines.length > 20) {
    fingerprints.push({
      type: 'perfect_formatting',
      ratio: spacingRatio,
      message: 'Near-perfect code formatting'
    });
    gptScore += 15;
  }
  
  return {
    fingerprints,
    score: gptScore,
    likelyGPT: gptScore > 30
  };
}

/**
 * Calculate composite AI score with weighted factors
 */
function calculateCompositeAIScore(code) {
  const commentAnalysis = analyzeCommentRatio(code);
  const variableAnalysis = analyzeVariableNaming(code);
  const boilerplateAnalysis = detectBoilerplate(code);
  const gptAnalysis = detectGPTFingerprints(code);
  
  // Weighted scoring system
  let compositeScore = 0;
  const weights = {
    commentRatio: 20,
    variableNaming: 25,
    boilerplate: 20,
    gptFingerprints: 35
  };
  
  // Comment ratio scoring (0-20 points)
  if (commentAnalysis.ratio > 0.4) {
    compositeScore += weights.commentRatio * 1.0;
  } else if (commentAnalysis.ratio > 0.25) {
    compositeScore += weights.commentRatio * 0.7;
  } else if (commentAnalysis.ratio > 0.15) {
    compositeScore += weights.commentRatio * 0.4;
  }
  
  // Variable naming scoring (0-25 points)
  const varScore = (variableAnalysis.longNameRatio * 0.6 + 
                   variableAnalysis.genericRatio * 0.4) * weights.variableNaming;
  compositeScore += varScore;
  
  // Boilerplate scoring (0-20 points)
  const boilerplateRatio = Math.min(boilerplateAnalysis.score / 50, 1);
  compositeScore += boilerplateRatio * weights.boilerplate;
  
  // GPT fingerprints scoring (0-35 points)
  const gptRatio = Math.min(gptAnalysis.score / 60, 1);
  compositeScore += gptRatio * weights.gptFingerprints;
  
  // Normalize to 0-100
  compositeScore = Math.round(Math.min(compositeScore, 100));
  
  return {
    compositeScore,
    breakdown: {
      commentRatio: commentAnalysis,
      variableNaming: variableAnalysis,
      boilerplate: boilerplateAnalysis,
      gptFingerprints: gptAnalysis
    },
    weights
  };
}

/**
 * Detect AI-generated code with enhanced heuristics
 */
exports.detectAIGenerated = async (code) => {
  try {
    const indicators = [];
    let aiScore = 0;

    // Enhanced composite AI score
    const compositeAnalysis = calculateCompositeAIScore(code);
    aiScore = compositeAnalysis.compositeScore;
    
    // Add detailed indicators based on analysis
    if (compositeAnalysis.breakdown.commentRatio.ratio > 0.25) {
      indicators.push({
        type: 'comment_ratio',
        severity: compositeAnalysis.breakdown.commentRatio.ratio > 0.4 ? 'high' : 'medium',
        message: `Comment ratio: ${compositeAnalysis.breakdown.commentRatio.percentage}% (${compositeAnalysis.breakdown.commentRatio.commentLines} comment lines)`,
        details: compositeAnalysis.breakdown.commentRatio
      });
    }
    
    if (compositeAnalysis.breakdown.variableNaming.longNameRatio > 0.3) {
      indicators.push({
        type: 'variable_naming',
        severity: compositeAnalysis.breakdown.variableNaming.longNameRatio > 0.5 ? 'high' : 'medium',
        message: `${Math.round(compositeAnalysis.breakdown.variableNaming.longNameRatio * 100)}% of variables have unusually long names`,
        details: compositeAnalysis.breakdown.variableNaming
      });
    }
    
    if (compositeAnalysis.breakdown.boilerplate.hasBoilerplate) {
      indicators.push({
        type: 'boilerplate',
        severity: 'medium',
        message: `Boilerplate patterns detected: ${compositeAnalysis.breakdown.boilerplate.patterns.join(', ')}`,
        details: compositeAnalysis.breakdown.boilerplate
      });
    }
    
    if (compositeAnalysis.breakdown.gptFingerprints.likelyGPT) {
      compositeAnalysis.breakdown.gptFingerprints.fingerprints.forEach(fp => {
        indicators.push({
          type: fp.type,
          severity: 'high',
          message: fp.message,
          details: fp
        });
      });
    }

    // Legacy indicators (keeping for backwards compatibility)
    const lines = code.split('\n');
    
    // Check for docstring patterns
    if (code.includes('/**') && code.includes('@param') && code.includes('@returns')) {
      indicators.push({
        type: 'docstrings',
        severity: 'medium',
        message: 'Professional-level JSDoc documentation detected'
      });
    }

    // Check for error handling patterns
    const tryCatchCount = (code.match(/try\s*{/g) || []).length;
    if (tryCatchCount > 2) {
      indicators.push({
        type: 'error_handling',
        severity: 'low',
        message: `${tryCatchCount} try-catch blocks found`
      });
    }

    const isAIGenerated = aiScore > 50;
    const confidence = Math.min(aiScore, 100);

    console.log('Enhanced AI detection completed', {
      aiScore,
      compositeScore: compositeAnalysis.compositeScore,
      indicatorsFound: indicators.length,
      isAIGenerated
    });

    return {
      isAIGenerated,
      confidence,
      aiScore,
      compositeScore: compositeAnalysis.compositeScore,
      indicators,
      detailedAnalysis: compositeAnalysis.breakdown,
      recommendation: isAIGenerated
        ? 'HIGH RISK: Strong indicators of AI-generated code - manual review required'
        : aiScore > 35
          ? 'MODERATE RISK: Some AI patterns detected - consider review'
          : aiScore > 20
            ? 'LOW RISK: Minor indicators present'
            : 'MINIMAL RISK: Appears to be human-written code'
    };

  } catch (error) {
    console.error('AI detection error:', error);
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
    console.error('Code analysis error:', error);
    throw error;
  }
};

module.exports = exports;
