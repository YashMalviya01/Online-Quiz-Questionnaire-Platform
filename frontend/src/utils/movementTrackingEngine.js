// Eye Gaze and Movement Tracking Engine
import * as faceapi from 'face-api.js';

class MovementTrackingEngine {
  constructor() {
    this.violations = [];
    this.gazeHistory = [];
    this.headPoseHistory = [];
    this.bodyMovementHistory = [];
    this.warningsIssued = 0;
    this.trackingInterval = null;
    this.alertCallback = null;
    this.isTracking = false;
    
    // Thresholds for detection
    this.thresholds = {
      gazeDeviation: 0.3,        // Eye looking away threshold
      headRotation: 35,           // Head angle in degrees (increased from 15 to allow natural movement)
      bodyMovement: 50,           // Pixel movement threshold
      blinkRate: 30,              // Blinks per minute (normal: 15-20)
      eyesClosed: 2,              // Seconds with eyes closed
      lookAwayDuration: 3,        // Seconds looking away
      multiplePersons: 1,         // More than 1 face detected
      suspiciousMovement: 5       // Sudden large movements
    };
    
    // Violation cooldown tracking (prevent spam)
    this.lastViolationTime = {
      head_rotation: 0,
      eye_gaze_away: 0,
      body_movement: 0,
      suspicious_expression: 0,
      mouth_movement: 0
    };
    this.violationCooldown = 3000; // 3 seconds cooldown between same violation types

    // Tracking state
    this.state = {
      lastFacePosition: null,
      lastLandmarks: null,
      eyesClosedStart: null,
      lookAwayStart: null,
      blinkCount: 0,
      lastBlinkTime: null,
      videoElement: null,
      canvasElement: null
    };
  }

  initialize(videoElement, canvasElement, alertCallback) {
    this.state.videoElement = videoElement;
    this.state.canvasElement = canvasElement;
    this.alertCallback = alertCallback;
  }

  startTracking() {
    if (this.isTracking) return;
    
    this.isTracking = true;
    this.trackingInterval = setInterval(() => {
      this.analyzeFrame();
    }, 1000); // Analyze every second
    
    console.log('👁️ Movement tracking started');
  }

  stopTracking() {
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
    }
    this.isTracking = false;
    console.log('👁️ Movement tracking stopped');
  }

  async analyzeFrame() {
    const { videoElement, canvasElement } = this.state;
    if (!videoElement || !canvasElement) return;

    try {
      // Check if models are loaded
      if (!faceapi.nets.tinyFaceDetector.isLoaded || 
          !faceapi.nets.faceLandmark68TinyNet.isLoaded) {
        console.warn('[Movement Engine] Face models not loaded yet, skipping frame');
        return;
      }

      // Detect all faces with landmarks
      // Use lower scoreThreshold to detect faces more easily (including from screens)
      const detections = await faceapi
        .detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.3 }))
        .withFaceLandmarks(true); // true = use tiny landmark model explicitly

      console.log(`[Movement Engine] Detected ${detections?.length || 0} face(s)`);

      if (!detections || detections.length === 0) {
        this.handleNoFaceDetected();
        return;
      }

      if (detections.length > 1) {
        this.handleMultipleFacesDetected(detections.length);
        return;
      }

      const detection = detections[0];
      
      // Analyze different aspects
      this.analyzeEyeGaze(detection);
      this.analyzeHeadPose(detection);
      this.analyzeBodyMovement(detection);
      // Note: Facial expressions analysis removed - model not loaded
      this.analyzeBlinkRate(detection);
      
      // Draw tracking visualization
      this.drawTrackingOverlay(detection);

    } catch (error) {
      console.error('❌ Frame analysis error:', error);
    }
  }

  analyzeEyeGaze(detection) {
    const landmarks = detection.landmarks;
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();

    // Calculate eye center
    const leftEyeCenter = this.getCenter(leftEye);
    const rightEyeCenter = this.getCenter(rightEye);

    // Calculate gaze direction (simplified)
    const gazeVector = {
      x: (leftEyeCenter.x + rightEyeCenter.x) / 2,
      y: (leftEyeCenter.y + rightEyeCenter.y) / 2
    };

    // Check if eyes are looking away from center
    const videoCenter = {
      x: this.state.videoElement.videoWidth / 2,
      y: this.state.videoElement.videoHeight / 2
    };

    const gazeDeviation = Math.sqrt(
      Math.pow(gazeVector.x - videoCenter.x, 2) +
      Math.pow(gazeVector.y - videoCenter.y, 2)
    ) / this.state.videoElement.videoWidth;

    if (gazeDeviation > this.thresholds.gazeDeviation) {
      if (!this.state.lookAwayStart) {
        this.state.lookAwayStart = Date.now();
      } else {
        const lookAwayDuration = (Date.now() - this.state.lookAwayStart) / 1000;
        if (lookAwayDuration > this.thresholds.lookAwayDuration) {
          this.triggerViolation('eye_gaze_away', {
            deviation: gazeDeviation.toFixed(2),
            duration: lookAwayDuration.toFixed(1),
            severity: 'medium'
          });
        }
      }
    } else {
      this.state.lookAwayStart = null;
    }

    this.gazeHistory.push({
      timestamp: Date.now(),
      deviation: gazeDeviation,
      vector: gazeVector
    });

    // Keep only last 60 seconds
    this.gazeHistory = this.gazeHistory.filter(
      h => Date.now() - h.timestamp < 60000
    );
  }

  analyzeHeadPose(detection) {
    const landmarks = detection.landmarks;
    const positions = landmarks.positions;

    // Calculate head rotation using facial landmarks
    const nose = positions[30]; // Nose tip
    const leftEye = this.getCenter(landmarks.getLeftEye());
    const rightEye = this.getCenter(landmarks.getRightEye());

    // Calculate angles
    const eyeCenter = {
      x: (leftEye.x + rightEye.x) / 2,
      y: (leftEye.y + rightEye.y) / 2
    };

    // Yaw (left/right rotation)
    const yaw = Math.atan2(nose.x - eyeCenter.x, nose.y - eyeCenter.y) * (180 / Math.PI);
    
    // Roll (tilt)
    const roll = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x) * (180 / Math.PI);

    // Pitch (up/down)
    const pitch = Math.atan2(nose.y - eyeCenter.y, eyeCenter.x - nose.x) * (180 / Math.PI);

    const headRotation = {
      yaw: Math.abs(yaw),
      pitch: Math.abs(pitch),
      roll: Math.abs(roll),
      timestamp: Date.now()
    };

    // Check for excessive head rotation
    // Note: Pitch calculation seems unreliable (consistently shows 80-90°), only check yaw for now
    if (headRotation.yaw > this.thresholds.headRotation) {
      this.triggerViolation('head_rotation', {
        yaw: headRotation.yaw.toFixed(1),
        pitch: headRotation.pitch.toFixed(1),
        roll: headRotation.roll.toFixed(1),
        severity: 'medium'
      });
    }

    this.headPoseHistory.push(headRotation);
    this.headPoseHistory = this.headPoseHistory.filter(
      h => Date.now() - h.timestamp < 60000
    );
  }

  analyzeBodyMovement(detection) {
    const currentBox = detection.detection.box;
    const currentPosition = {
      x: currentBox.x + currentBox.width / 2,
      y: currentBox.y + currentBox.height / 2,
      width: currentBox.width,
      height: currentBox.height,
      timestamp: Date.now()
    };

    if (this.state.lastFacePosition) {
      // Calculate movement
      const dx = currentPosition.x - this.state.lastFacePosition.x;
      const dy = currentPosition.y - this.state.lastFacePosition.y;
      const movement = Math.sqrt(dx * dx + dy * dy);

      // Calculate size change (person moving closer/farther)
      const sizeChange = Math.abs(
        currentPosition.width - this.state.lastFacePosition.width
      );

      if (movement > this.thresholds.bodyMovement) {
        this.triggerViolation('excessive_movement', {
          movement: movement.toFixed(1),
          direction: dx > 0 ? 'right' : 'left',
          severity: 'low'
        });
      }

      if (sizeChange > this.thresholds.bodyMovement) {
        this.triggerViolation('distance_change', {
          change: sizeChange.toFixed(1),
          direction: sizeChange > 0 ? 'closer' : 'farther',
          severity: 'medium'
        });
      }

      this.bodyMovementHistory.push({
        timestamp: Date.now(),
        movement,
        sizeChange
      });

      this.bodyMovementHistory = this.bodyMovementHistory.filter(
        h => Date.now() - h.timestamp < 60000
      );
    }

    this.state.lastFacePosition = currentPosition;
  }

  analyzeFacialExpressions(detection) {
    const expressions = detection.expressions;
    
    // Check for suspicious expressions
    if (expressions.surprised > 0.7) {
      this.triggerViolation('suspicious_expression', {
        expression: 'surprised',
        confidence: expressions.surprised.toFixed(2),
        severity: 'low'
      });
    }

    // Detect if person is talking (mouth movements)
    const landmarks = detection.landmarks;
    const mouth = landmarks.getMouth();
    const mouthHeight = this.getVerticalDistance(mouth);
    
    if (mouthHeight > 15) {
      this.triggerViolation('mouth_movement', {
        type: 'talking_suspected',
        severity: 'medium'
      });
    }
  }

  analyzeBlinkRate(detection) {
    const landmarks = detection.landmarks;
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();

    // Calculate eye aspect ratio (EAR)
    const leftEAR = this.calculateEyeAspectRatio(leftEye);
    const rightEAR = this.calculateEyeAspectRatio(rightEye);
    const avgEAR = (leftEAR + rightEAR) / 2;

    // Eyes closed if EAR < 0.2
    if (avgEAR < 0.2) {
      if (!this.state.eyesClosedStart) {
        this.state.eyesClosedStart = Date.now();
        this.state.blinkCount++;
      } else {
        const closedDuration = (Date.now() - this.state.eyesClosedStart) / 1000;
        if (closedDuration > this.thresholds.eyesClosed) {
          this.triggerViolation('eyes_closed', {
            duration: closedDuration.toFixed(1),
            severity: 'high'
          });
        }
      }
    } else {
      this.state.eyesClosedStart = null;
    }

    // Check blink rate (excessive blinking can indicate stress/cheating)
    const now = Date.now();
    if (this.state.lastBlinkTime) {
      const timeSinceLastCheck = (now - this.state.lastBlinkTime) / 60000; // minutes
      const blinkRate = this.state.blinkCount / timeSinceLastCheck;
      
      if (blinkRate > this.thresholds.blinkRate) {
        this.triggerViolation('abnormal_blink_rate', {
          rate: blinkRate.toFixed(1),
          severity: 'low'
        });
        this.state.blinkCount = 0;
        this.state.lastBlinkTime = now;
      }
    } else {
      this.state.lastBlinkTime = now;
    }
  }

  handleNoFaceDetected() {
    this.triggerViolation('no_face_detected', {
      severity: 'critical',
      message: 'Student not visible in camera'
    });
  }

  handleMultipleFacesDetected(count) {
    this.triggerViolation('multiple_faces', {
      count,
      severity: 'critical',
      message: `${count} people detected in frame`
    });
  }

  triggerViolation(type, data) {
    // Check cooldown to prevent spam
    const now = Date.now();
    const lastTime = this.lastViolationTime[type] || 0;
    
    if (now - lastTime < this.violationCooldown) {
      // Still in cooldown, skip this violation
      return;
    }
    
    // Update last violation time
    this.lastViolationTime[type] = now;
    
    const violation = {
      type,
      timestamp: now,
      data,
      warningLevel: this.calculateWarningLevel(type, data.severity)
    };

    this.violations.push(violation);

    // Trigger alert callback
    if (this.alertCallback) {
      this.alertCallback(violation);
    }

    console.warn('⚠️ Violation detected:', type, data);
  }

  calculateWarningLevel(type, severity) {
    const criticalTypes = ['no_face_detected', 'multiple_faces'];
    const highTypes = ['eyes_closed', 'head_rotation'];
    const mediumTypes = ['eye_gaze_away', 'distance_change', 'mouth_movement'];

    if (criticalTypes.includes(type) || severity === 'critical') {
      this.warningsIssued += 3;
      return 'critical';
    } else if (highTypes.includes(type) || severity === 'high') {
      this.warningsIssued += 2;
      return 'high';
    } else if (mediumTypes.includes(type) || severity === 'medium') {
      this.warningsIssued += 1;
      return 'medium';
    }
    return 'low';
  }

  // Helper methods
  getCenter(points) {
    const x = points.reduce((sum, p) => sum + p.x, 0) / points.length;
    const y = points.reduce((sum, p) => sum + p.y, 0) / points.length;
    return { x, y };
  }

  getVerticalDistance(points) {
    const yValues = points.map(p => p.y);
    return Math.max(...yValues) - Math.min(...yValues);
  }

  calculateEyeAspectRatio(eyePoints) {
    // Eye Aspect Ratio (EAR) formula
    const v1 = Math.sqrt(
      Math.pow(eyePoints[1].x - eyePoints[5].x, 2) +
      Math.pow(eyePoints[1].y - eyePoints[5].y, 2)
    );
    const v2 = Math.sqrt(
      Math.pow(eyePoints[2].x - eyePoints[4].x, 2) +
      Math.pow(eyePoints[2].y - eyePoints[4].y, 2)
    );
    const h = Math.sqrt(
      Math.pow(eyePoints[0].x - eyePoints[3].x, 2) +
      Math.pow(eyePoints[0].y - eyePoints[3].y, 2)
    );
    return (v1 + v2) / (2.0 * h);
  }

  drawTrackingOverlay(detection) {
    const { canvasElement, videoElement } = this.state;
    if (!canvasElement) return;

    const ctx = canvasElement.getContext('2d');
    const displaySize = {
      width: videoElement.videoWidth,
      height: videoElement.videoHeight
    };

    faceapi.matchDimensions(canvasElement, displaySize);
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    const resizedDetection = faceapi.resizeResults(detection, displaySize);

    // Draw face box
    const box = resizedDetection.detection.box;
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.strokeRect(box.x, box.y, box.width, box.height);

    // Draw eye tracking indicators
    const landmarks = resizedDetection.landmarks;
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();

    ctx.fillStyle = '#00ffff';
    [leftEye, rightEye].forEach(eye => {
      const center = this.getCenter(eye);
      ctx.beginPath();
      ctx.arc(center.x, center.y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw nose point
    const nose = landmarks.positions[30];
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(nose.x, nose.y, 4, 0, 2 * Math.PI);
    ctx.fill();
  }

  getViolationSummary() {
    const last60s = this.violations.filter(
      v => Date.now() - v.timestamp < 60000
    );

    const summary = {
      total: this.violations.length,
      last60s: last60s.length,
      warningsIssued: this.warningsIssued,
      byType: {},
      bySeverity: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0
      }
    };

    this.violations.forEach(v => {
      summary.byType[v.type] = (summary.byType[v.type] || 0) + 1;
      summary.bySeverity[v.warningLevel]++;
    });

    return summary;
  }

  reset() {
    this.violations = [];
    this.gazeHistory = [];
    this.headPoseHistory = [];
    this.bodyMovementHistory = [];
    this.warningsIssued = 0;
    this.state = {
      lastFacePosition: null,
      lastLandmarks: null,
      eyesClosedStart: null,
      lookAwayStart: null,
      blinkCount: 0,
      lastBlinkTime: null,
      videoElement: this.state.videoElement,
      canvasElement: this.state.canvasElement
    };
  }
}

export default MovementTrackingEngine;
