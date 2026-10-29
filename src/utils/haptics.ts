/**
 * Haptic feedback utility using the Navigator.vibrate API.
 * Provides short, sharp tactile pulses on touch and mobile devices for
 * block pickup, snapping, placement, line clears, combo streaks, and undo.
 */

class HapticsManager {
  private enabled: boolean = true;

  constructor() {
    try {
      const saved = localStorage.getItem('blockblast_haptics_enabled');
      if (saved !== null) {
        this.enabled = saved === 'true';
      }
    } catch {
      this.enabled = true;
    }
  }

  /**
   * Check if the Navigator.vibrate API is supported in the current environment
   */
  public isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      'navigator' in window &&
      typeof navigator.vibrate === 'function'
    );
  }

  public isEnabled(): boolean {
    return this.enabled && this.isSupported();
  }

  public toggle(): boolean {
    this.enabled = !this.enabled;
    try {
      localStorage.setItem('blockblast_haptics_enabled', String(this.enabled));
    } catch {
      // Ignore storage errors
    }
    if (this.enabled) {
      this.trigger(20);
    }
    return this.enabled;
  }

  public setEnabled(val: boolean): void {
    this.enabled = val;
    try {
      localStorage.setItem('blockblast_haptics_enabled', String(this.enabled));
    } catch {
      // Ignore storage errors
    }
    if (val) {
      this.trigger(20);
    }
  }

  /**
   * Safe execution wrapper for navigator.vibrate
   */
  public trigger(pattern: number | number[]): void {
    if (!this.enabled || !this.isSupported()) return;
    try {
      navigator.vibrate(pattern);
    } catch {
      // Non-fatal if browser blocks or device has no haptic motor
    }
  }

  /**
   * Short, crisp pulse when picking up a block piece from the tray (12ms)
   */
  public pickup(): void {
    this.trigger(12);
  }

  /**
   * Micro-tick when a dragged shape snaps into a valid grid position (8ms)
   */
  public snap(): void {
    this.trigger(8);
  }

  /**
   * Solid tactile thud when dropping and committing a piece into the board (24ms)
   */
  public place(): void {
    this.trigger(24);
  }

  /**
   * Dynamic haptic pulse sequence on line clears, scaling with completed lines and combos
   */
  public clear(linesCleared: number = 1, comboCount: number = 0): void {
    if (linesCleared >= 3 || comboCount >= 3) {
      // Triple / Quadruple clear or high combo: crescendo burst pattern
      this.trigger([30, 25, 45, 25, 60]);
    } else if (linesCleared === 2 || comboCount >= 2) {
      // Double clear or 2x combo: punchy double pulse
      this.trigger([24, 30, 36]);
    } else {
      // Single line clear: crisp sharp pulse
      this.trigger(30);
    }
  }

  /**
   * Subtle alert pulse when combo streak timer runs out
   */
  public comboExpire(): void {
    this.trigger([20, 35, 15]);
  }

  /**
   * Tactile pulse pattern when undoing a placed block
   */
  public undo(): void {
    this.trigger([16, 25, 16]);
  }

  /**
   * Downward rumble pattern when Game Over is triggered
   */
  public gameOver(): void {
    this.trigger([50, 40, 75]);
  }
}

export const haptics = new HapticsManager();
