export default class ProctoringRuleEngine {
  constructor({ sendEvent, onNotify }) {
    this.sendEvent = sendEvent;
    this.onNotify = onNotify;
    this.cooldowns = new Map();
    this.counts = new Map();
    this.violations = [];
    this.riskScore = 0;
    this.startTime = Date.now();
  }

  trigger(eventType, severity, eventData = {}, options = {}) {
    const now = Date.now();
    const cooldown = options.cooldownMs ?? 5000; // Reduced cooldown for faster detection
    const key = `${eventType}-${severity}`;
    const lastTriggered = this.cooldowns.get(key) || 0;

    if (now - lastTriggered < cooldown) {
      return;
    }

    const count = (this.counts.get(eventType) || 0) + 1;
    this.counts.set(eventType, count);
    this.cooldowns.set(key, now);

    // Calculate risk score based on severity and frequency
    const riskIncrease = this.calculateRiskIncrease(eventType, severity, count);
    this.riskScore = Math.min(100, this.riskScore + riskIncrease);

    // Store violation
    const violation = {
      eventType,
      severity,
      timestamp: now,
      count,
      riskScore: this.riskScore,
      ...eventData
    };
    this.violations.push(violation);

    const payload = {
      eventType,
      severity,
      eventData: {
        count,
        totalViolations: this.violations.length,
        riskScore: this.riskScore,
        ...eventData
      }
    };

    this.sendEvent(payload);
    if (typeof this.onNotify === 'function') {
      this.onNotify(payload);
    }

    // Auto-terminate quiz if risk score is too high
    if (this.riskScore >= 80 && options.autoTerminate !== false) {
      this.trigger('auto_terminate', 'critical', {
        reason: 'Risk score exceeded threshold',
        finalScore: this.riskScore
      });
    }
  }

  calculateRiskIncrease(eventType, severity, count) {
    const severityWeights = {
      low: 2,
      medium: 5,
      high: 10,
      critical: 20
    };

    const frequencyMultiplier = Math.min(count / 3, 2); // Max 2x for repeated violations
    return severityWeights[severity] * frequencyMultiplier;
  }

  getViolationSummary() {
    return {
      totalViolations: this.violations.length,
      riskScore: this.riskScore,
      duration: Date.now() - this.startTime,
      violationsByType: this.getViolationsByType(),
      timeline: this.violations
    };
  }

  getViolationsByType() {
    const summary = {};
    this.violations.forEach(v => {
      if (!summary[v.eventType]) {
        summary[v.eventType] = { count: 0, severity: v.severity };
      }
      summary[v.eventType].count++;
    });
    return summary;
  }

  reset() {
    this.cooldowns.clear();
    this.counts.clear();
    this.violations = [];
    this.riskScore = 0;
    this.startTime = Date.now();
  }
}
