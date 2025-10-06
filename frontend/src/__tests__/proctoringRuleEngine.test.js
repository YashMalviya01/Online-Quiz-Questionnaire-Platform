import { describe, expect, it, vi } from 'vitest';
import ProctoringRuleEngine from '../utils/proctoringRuleEngine.js';

describe('ProctoringRuleEngine', () => {
  it('throttles events based on cooldown', () => {
    const sendEvent = vi.fn();
    const engine = new ProctoringRuleEngine({ sendEvent });

    engine.trigger('TAB_SWITCH', 'medium', {}, { cooldownMs: 1000 });
    engine.trigger('TAB_SWITCH', 'medium', {}, { cooldownMs: 1000 });

    expect(sendEvent).toHaveBeenCalledTimes(1);
  });

  it('tracks counts per event type', () => {
    const sendEvent = vi.fn();
    const engine = new ProctoringRuleEngine({ sendEvent });

    engine.trigger('VOICE_DETECTED', 'medium');
    engine.trigger('VOICE_DETECTED', 'medium', {}, { cooldownMs: -1 });

    expect(sendEvent).toHaveBeenCalledTimes(2);
    expect(sendEvent.mock.calls[1][0].eventData.count).toBe(2);
  });
});
