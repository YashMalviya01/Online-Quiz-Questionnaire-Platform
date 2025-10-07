const EnhancedProctoringEvent = require('../models/EnhancedProctoringEvent');
const Result = require('../models/Result');
const Quiz = require('../models/Quiz');

/**
 * @desc    Create proctoring event
 * @route   POST /api/proctoring/events
 * @access  Private
 */
exports.createProctoringEvent = async (req, res) => {
  try {
    const { quizId, resultId } = req.body;

    // Verify quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Verify result exists and belongs to user
    const result = await Result.findById(resultId);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
      });
    }

  if (result.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const proctoringEvent = new EnhancedProctoringEvent({
      quiz: quizId,
      result: resultId,
      student: req.user.id
    });

    await proctoringEvent.save();

    // Link to result
    result.enhancedProctoringEvent = proctoringEvent._id;
    await result.save();

    res.status(201).json({
      success: true,
      message: 'Proctoring event created successfully',
      data: proctoringEvent
    });
  } catch (error) {
    console.error('Create proctoring event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating proctoring event',
      error: error.message
    });
  }
};

/**
 * @desc    Update proctoring event (add violations)
 * @route   PUT /api/proctoring/events/:id
 * @access  Private
 */
exports.updateProctoringEvent = async (req, res) => {
  try {
    const proctoringEvent = await EnhancedProctoringEvent.findById(req.params.id);

    if (!proctoringEvent) {
      return res.status(404).json({
        success: false,
        message: 'Proctoring event not found'
      });
    }

    // Verify ownership
    if (proctoringEvent.student.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const {
      eyeTracking,
      audioMonitoring,
      screenRecording,
      browserMonitoring,
      keystrokeAnalysis,
      faceDetection,
      idVerification,
      networkMonitoring
    } = req.body;

    // Update eye tracking
    if (eyeTracking) {
      if (eyeTracking.lookAwayCount !== undefined) {
        proctoringEvent.eyeTracking.lookAwayCount += eyeTracking.lookAwayCount;
      }
      if (eyeTracking.lookAwayDuration !== undefined) {
        proctoringEvent.eyeTracking.lookAwayDuration += eyeTracking.lookAwayDuration;
      }
      if (eyeTracking.gazeDrift !== undefined) {
        proctoringEvent.eyeTracking.gazeDrift = eyeTracking.gazeDrift;
      }
      if (eyeTracking.violation) {
        proctoringEvent.eyeTracking.eyeTrackingViolations.push(eyeTracking.violation);
      }
    }

    // Update audio monitoring
    if (audioMonitoring) {
      if (audioMonitoring.suspiciousSound) {
        proctoringEvent.audioMonitoring.suspiciousSounds.push(audioMonitoring.suspiciousSound);
      }
      if (audioMonitoring.voiceDetectionCount !== undefined) {
        proctoringEvent.audioMonitoring.voiceDetectionCount += audioMonitoring.voiceDetectionCount;
      }
      if (audioMonitoring.multipleVoicesDetected !== undefined) {
        proctoringEvent.audioMonitoring.multipleVoicesDetected = audioMonitoring.multipleVoicesDetected;
      }
    }

    // Update screen recording
    if (screenRecording) {
      if (screenRecording.recordingUrl) {
        proctoringEvent.screenRecording.recordingUrl = screenRecording.recordingUrl;
      }
      if (screenRecording.recordingStartTime) {
        proctoringEvent.screenRecording.recordingStartTime = screenRecording.recordingStartTime;
      }
      if (screenRecording.recordingEndTime) {
        proctoringEvent.screenRecording.recordingEndTime = screenRecording.recordingEndTime;
      }
      if (screenRecording.screenshot) {
        proctoringEvent.screenRecording.screenshotUrls.push(screenRecording.screenshot);
      }
      if (screenRecording.suspiciousScreenshot) {
        proctoringEvent.screenRecording.suspiciousScreenshots.push(screenRecording.suspiciousScreenshot);
      }
    }

    // Update browser monitoring
    if (browserMonitoring) {
      if (browserMonitoring.tabSwitch) {
        proctoringEvent.browserMonitoring.tabSwitches.push(browserMonitoring.tabSwitch);
        proctoringEvent.browserMonitoring.totalTabSwitches += 1;
      }
      if (browserMonitoring.appSwitch) {
        proctoringEvent.browserMonitoring.appSwitches.push(browserMonitoring.appSwitch);
      }
      if (browserMonitoring.copyPaste) {
        proctoringEvent.browserMonitoring.copyPasteAttempts.push(browserMonitoring.copyPaste);
      }
      if (browserMonitoring.rightClick) {
        proctoringEvent.browserMonitoring.rightClickAttempts.push(browserMonitoring.rightClick);
      }
    }

    // Update keystroke analysis
    if (keystrokeAnalysis) {
      if (keystrokeAnalysis.typingSpeed !== undefined) {
        proctoringEvent.keystrokeAnalysis.typingSpeed = keystrokeAnalysis.typingSpeed;
      }
      if (keystrokeAnalysis.typingPattern) {
        proctoringEvent.keystrokeAnalysis.typingPattern = keystrokeAnalysis.typingPattern;
      }
      if (keystrokeAnalysis.suspiciousTypingDetected !== undefined) {
        proctoringEvent.keystrokeAnalysis.suspiciousTypingDetected = keystrokeAnalysis.suspiciousTypingDetected;
      }
      if (keystrokeAnalysis.violation) {
        proctoringEvent.keystrokeAnalysis.keystrokeViolations.push(keystrokeAnalysis.violation);
      }
    }

    // Update face detection
    if (faceDetection) {
      if (faceDetection.multipleFacesDetected !== undefined) {
        proctoringEvent.faceDetection.multipleFacesDetected = faceDetection.multipleFacesDetected;
      }
      if (faceDetection.noFaceDetected !== undefined) {
        proctoringEvent.faceDetection.noFaceDetected = faceDetection.noFaceDetected;
      }
      if (faceDetection.differentPersonDetected !== undefined) {
        proctoringEvent.faceDetection.differentPersonDetected = faceDetection.differentPersonDetected;
      }
      if (faceDetection.emotionAnalysis) {
        proctoringEvent.faceDetection.emotionAnalysis.push(faceDetection.emotionAnalysis);
      }
      if (faceDetection.faceImage) {
        proctoringEvent.faceDetection.faceImages.push(faceDetection.faceImage);
      }
    }

    // Update ID verification
    if (idVerification) {
      if (idVerification.idImageUrl) {
        proctoringEvent.idVerification.idImageUrl = idVerification.idImageUrl;
      }
      if (idVerification.idType) {
        proctoringEvent.idVerification.idType = idVerification.idType;
      }
      if (idVerification.verificationStatus) {
        proctoringEvent.idVerification.verificationStatus = idVerification.verificationStatus;
      }
      if (idVerification.verifiedAt) {
        proctoringEvent.idVerification.verifiedAt = idVerification.verifiedAt;
      }
      if (idVerification.faceMatchScore !== undefined) {
        proctoringEvent.idVerification.faceMatchScore = idVerification.faceMatchScore;
      }
    }

    // Update network monitoring
    if (networkMonitoring) {
      if (networkMonitoring.ipAddress) {
        proctoringEvent.networkMonitoring.ipAddress = networkMonitoring.ipAddress;
      }
      if (networkMonitoring.ipChange) {
        proctoringEvent.networkMonitoring.ipChanges.push(networkMonitoring.ipChange);
      }
      if (networkMonitoring.vpnDetected !== undefined) {
        proctoringEvent.networkMonitoring.vpnDetected = networkMonitoring.vpnDetected;
      }
      if (networkMonitoring.suspiciousActivity) {
        proctoringEvent.networkMonitoring.suspiciousNetworkActivity.push(networkMonitoring.suspiciousActivity);
      }
    }

    // Recalculate risk score
    proctoringEvent.calculateRiskScore();

    await proctoringEvent.save();

    res.json({
      success: true,
      message: 'Proctoring event updated successfully',
      data: proctoringEvent
    });
  } catch (error) {
    console.error('Update proctoring event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating proctoring event',
      error: error.message
    });
  }
};

/**
 * @desc    Get proctoring event by ID
 * @route   GET /api/proctoring/events/:id
 * @access  Private
 */
exports.getProctoringEvent = async (req, res) => {
  try {
    const proctoringEvent = await EnhancedProctoringEvent.findById(req.params.id)
      .populate('student', 'name email')
      .populate('quiz', 'title')
      .populate('result');

    if (!proctoringEvent) {
      return res.status(404).json({
        success: false,
        message: 'Proctoring event not found'
      });
    }

    // Check permissions
    const isStudent = proctoringEvent.student._id.toString() === req.user.id;
    const isInstructor = proctoringEvent.quiz && 
      (await Quiz.findById(proctoringEvent.quiz._id)).createdBy.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isStudent && !isInstructor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: proctoringEvent
    });
  } catch (error) {
    console.error('Get proctoring event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching proctoring event',
      error: error.message
    });
  }
};

/**
 * @desc    Get proctoring events for a quiz
 * @route   GET /api/proctoring/quiz/:quizId/events
 * @access  Private (Instructor/Admin)
 */
exports.getQuizProctoringEvents = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { riskLevel, reviewStatus } = req.query;

    // Check if user has access to this quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Build query
    const query = { quiz: quizId };
    if (riskLevel) query.riskLevel = riskLevel;
    if (reviewStatus) query.reviewStatus = reviewStatus;

    const events = await EnhancedProctoringEvent.find(query)
      .populate('student', 'name email')
      .populate('result')
      .sort({ riskScore: -1, createdAt: -1 });

    res.json({
      success: true,
      data: events,
      count: events.length
    });
  } catch (error) {
    console.error('Get quiz proctoring events error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching proctoring events',
      error: error.message
    });
  }
};

/**
 * @desc    Review proctoring event
 * @route   POST /api/proctoring/events/:id/review
 * @access  Private (Instructor/Admin)
 */
exports.reviewProctoringEvent = async (req, res) => {
  try {
    const { reviewStatus, reviewNotes, actionTaken } = req.body;

    const proctoringEvent = await EnhancedProctoringEvent.findById(req.params.id);

    if (!proctoringEvent) {
      return res.status(404).json({
        success: false,
        message: 'Proctoring event not found'
      });
    }

    // Check permissions
    const quiz = await Quiz.findById(proctoringEvent.quiz);
    if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    proctoringEvent.reviewStatus = reviewStatus;
    proctoringEvent.reviewedBy = req.user.id;
    proctoringEvent.reviewedAt = new Date();

    if (reviewNotes) {
      proctoringEvent.notes.push({
        note: reviewNotes,
        addedBy: req.user.id,
        addedAt: new Date()
      });
    }

    if (actionTaken) {
      proctoringEvent.actions.push({
        action: actionTaken,
        takenBy: req.user.id,
        takenAt: new Date()
      });
    }

    await proctoringEvent.save();

    res.json({
      success: true,
      message: 'Proctoring event reviewed successfully',
      data: proctoringEvent
    });
  } catch (error) {
    console.error('Review proctoring event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error reviewing proctoring event',
      error: error.message
    });
  }
};

/**
 * @desc    Get flagged attempts (high/critical risk)
 * @route   GET /api/proctoring/quiz/:quizId/flagged
 * @access  Private (Instructor/Admin)
 */
exports.getFlaggedAttempts = async (req, res) => {
  try {
    const { quizId } = req.params;

    // Check if user has access to this quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const flaggedEvents = await EnhancedProctoringEvent.find({
      quiz: quizId,
      riskLevel: { $in: ['high', 'critical'] }
    })
      .populate('student', 'name email')
      .populate('result')
      .sort({ riskScore: -1 });

    res.json({
      success: true,
      data: flaggedEvents,
      count: flaggedEvents.length
    });
  } catch (error) {
    console.error('Get flagged attempts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching flagged attempts',
      error: error.message
    });
  }
};
