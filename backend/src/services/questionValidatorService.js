/**
 * Advanced Question Type Validators
 * Handles validation and grading logic for all 7 question types
 */

/**
 * Validate and grade multiple-choice question
 */
exports.validateMultipleChoice = (question, answer) => {
  if (!answer.selectedOption) {
    return {
      isValid: false,
      error: 'No option selected'
    };
  }

  const correctOption = question.options.find(opt => opt.isCorrect);
  const isCorrect = answer.selectedOption === correctOption?.text;

  return {
    isValid: true,
    isCorrect,
    awardedScore: isCorrect ? question.points : 0,
    maxScore: question.points
  };
};

/**
 * Validate and grade code question
 */
exports.validateCode = async (question, answer) => {
  if (!answer.codeAnswer) {
    return {
      isValid: false,
      error: 'No code submitted'
    };
  }

  // This would typically run test cases
  // For now, we'll mark as needing manual grading
  return {
    isValid: true,
    needsGrading: true,
    awardedScore: 0,
    maxScore: question.points
  };
};

/**
 * Validate and grade fill-in-the-blank question
 */
exports.validateFillInBlank = (question, answer) => {
  if (!answer.blankAnswers || !Array.isArray(answer.blankAnswers)) {
    return {
      isValid: false,
      error: 'Invalid blank answers format'
    };
  }

  if (answer.blankAnswers.length !== question.blankAnswers.length) {
    return {
      isValid: false,
      error: 'Incorrect number of blanks filled'
    };
  }

  let correctCount = 0;
  const caseSensitive = question.caseSensitive || false;

  question.blankAnswers.forEach((correctAnswer, index) => {
    const studentAnswer = answer.blankAnswers[index];
    
    // Support multiple acceptable answers separated by |
    const acceptableAnswers = correctAnswer.split('|').map(a => a.trim());
    
    const isCorrect = acceptableAnswers.some(acceptable => {
      if (caseSensitive) {
        return studentAnswer === acceptable;
      } else {
        return studentAnswer.toLowerCase() === acceptable.toLowerCase();
      }
    });

    if (isCorrect) correctCount++;
  });

  const isFullyCorrect = correctCount === question.blankAnswers.length;
  let awardedScore = 0;

  if (isFullyCorrect) {
    awardedScore = question.points;
  } else if (question.partialCredit) {
    // Award partial credit based on percentage correct
    awardedScore = (correctCount / question.blankAnswers.length) * question.points;
    awardedScore = Math.round(awardedScore * 100) / 100; // Round to 2 decimals
  }

  return {
    isValid: true,
    isCorrect: isFullyCorrect,
    awardedScore,
    maxScore: question.points,
    correctCount,
    totalBlanks: question.blankAnswers.length
  };
};

/**
 * Validate and grade matching question
 */
exports.validateMatching = (question, answer) => {
  if (!answer.matchingAnswers || !Array.isArray(answer.matchingAnswers)) {
    return {
      isValid: false,
      error: 'Invalid matching answers format'
    };
  }

  if (answer.matchingAnswers.length !== question.matchingPairs.length) {
    return {
      isValid: false,
      error: 'Incorrect number of matches'
    };
  }

  let correctCount = 0;

  question.matchingPairs.forEach(correctPair => {
    const studentMatch = answer.matchingAnswers.find(
      pair => pair.left === correctPair.left
    );

    if (studentMatch && studentMatch.right === correctPair.right) {
      correctCount++;
    }
  });

  const isFullyCorrect = correctCount === question.matchingPairs.length;
  let awardedScore = 0;

  if (isFullyCorrect) {
    awardedScore = question.points;
  } else if (question.partialCredit) {
    // Award partial credit based on percentage correct
    awardedScore = (correctCount / question.matchingPairs.length) * question.points;
    awardedScore = Math.round(awardedScore * 100) / 100; // Round to 2 decimals
  }

  return {
    isValid: true,
    isCorrect: isFullyCorrect,
    awardedScore,
    maxScore: question.points,
    correctMatches: correctCount,
    totalMatches: question.matchingPairs.length
  };
};

/**
 * Validate essay question
 */
exports.validateEssay = (question, answer) => {
  if (!answer.essayAnswer || typeof answer.essayAnswer !== 'string') {
    return {
      isValid: false,
      error: 'No essay answer provided'
    };
  }

  const wordCount = answer.essayAnswer.trim().split(/\s+/).length;

  // Check word limit if specified
  if (question.wordLimit && wordCount > question.wordLimit) {
    return {
      isValid: false,
      error: `Essay exceeds word limit of ${question.wordLimit} words`
    };
  }

  // Essays need manual grading
  return {
    isValid: true,
    needsGrading: true,
    wordCount,
    awardedScore: 0,
    maxScore: question.points
  };
};

/**
 * Validate file upload question
 */
exports.validateFileUpload = (question, answer) => {
  if (!answer.uploadedFiles || !Array.isArray(answer.uploadedFiles)) {
    return {
      isValid: false,
      error: 'No files uploaded'
    };
  }

  if (answer.uploadedFiles.length === 0) {
    return {
      isValid: false,
      error: 'No files uploaded'
    };
  }

  // Validate file types if specified
  if (question.allowedFileTypes && question.allowedFileTypes.length > 0) {
    for (const file of answer.uploadedFiles) {
      const fileExtension = file.filename.split('.').pop().toLowerCase();
      if (!question.allowedFileTypes.includes(fileExtension)) {
        return {
          isValid: false,
          error: `File type .${fileExtension} is not allowed. Allowed types: ${question.allowedFileTypes.join(', ')}`
        };
      }
    }
  }

  // Validate file size if specified (in MB)
  if (question.maxFileSize) {
    for (const file of answer.uploadedFiles) {
      const fileSizeMB = file.fileSize / (1024 * 1024);
      if (fileSizeMB > question.maxFileSize) {
        return {
          isValid: false,
          error: `File ${file.filename} exceeds maximum size of ${question.maxFileSize} MB`
        };
      }
    }
  }

  // File uploads need manual grading
  return {
    isValid: true,
    needsGrading: true,
    awardedScore: 0,
    maxScore: question.points,
    fileCount: answer.uploadedFiles.length
  };
};

/**
 * Validate and grade true/false question
 */
exports.validateTrueFalse = (question, answer) => {
  if (answer.selectedOption === undefined || answer.selectedOption === null) {
    return {
      isValid: false,
      error: 'No answer selected'
    };
  }

  if (typeof answer.selectedOption !== 'boolean') {
    return {
      isValid: false,
      error: 'Answer must be true or false'
    };
  }

  const correctOption = question.options.find(opt => opt.isCorrect);
  const correctAnswer = correctOption?.text === 'True' || correctOption?.text === true;
  const isCorrect = answer.selectedOption === correctAnswer;

  return {
    isValid: true,
    isCorrect,
    awardedScore: isCorrect ? question.points : 0,
    maxScore: question.points
  };
};

/**
 * Main validator - routes to appropriate type-specific validator
 */
exports.validateAnswer = async (question, answer) => {
  switch (question.questionType) {
    case 'multiple-choice':
      return this.validateMultipleChoice(question, answer);
    
    case 'code':
      return await this.validateCode(question, answer);
    
    case 'fill-in-blank':
      return this.validateFillInBlank(question, answer);
    
    case 'matching':
      return this.validateMatching(question, answer);
    
    case 'essay':
      return this.validateEssay(question, answer);
    
    case 'file-upload':
      return this.validateFileUpload(question, answer);
    
    case 'true-false':
      return this.validateTrueFalse(question, answer);
    
    default:
      return {
        isValid: false,
        error: `Unknown question type: ${question.questionType}`
      };
  }
};

/**
 * Grade a rubric-based answer (for essays and file uploads)
 */
exports.gradeWithRubric = (question, rubricScores) => {
  if (!question.rubric || !Array.isArray(question.rubric)) {
    return {
      isValid: false,
      error: 'No rubric defined for this question'
    };
  }

  let totalScore = 0;
  const rubricResults = [];

  for (const criterion of question.rubric) {
    const score = rubricScores.get(criterion.name) || 0;
    
    if (score < 0 || score > criterion.maxPoints) {
      return {
        isValid: false,
        error: `Invalid score for criterion "${criterion.name}". Must be between 0 and ${criterion.maxPoints}`
      };
    }

    totalScore += score;
    rubricResults.push({
      criterion: criterion.name,
      score,
      maxPoints: criterion.maxPoints
    });
  }

  return {
    isValid: true,
    awardedScore: totalScore,
    maxScore: question.points,
    rubricResults
  };
};

/**
 * Calculate statistics for a question across all attempts
 */
exports.calculateQuestionStatistics = async (questionId) => {
  const Question = require('../models/Question');
  const Result = require('../models/Result');

  const results = await Result.find({
    'answers.question': questionId,
    status: 'completed'
  });

  if (results.length === 0) {
    return {
      timesUsed: 0,
      averageScore: 0,
      averageTimeSpent: 0
    };
  }

  let totalScore = 0;
  let totalTime = 0;
  let count = 0;

  results.forEach(result => {
    const answer = result.answers.find(
      a => a.question.toString() === questionId.toString()
    );
    
    if (answer) {
      totalScore += answer.awardedScore || 0;
      totalTime += answer.timeSpent || 0;
      count++;
    }
  });

  return {
    timesUsed: count,
    averageScore: count > 0 ? totalScore / count : 0,
    averageTimeSpent: count > 0 ? totalTime / count : 0
  };
};
