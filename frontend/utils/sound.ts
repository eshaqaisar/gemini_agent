// Simple audio synthesizer to avoid external asset dependencies
const audioCtx = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

export const playSound = (type: 'success' | 'click' | 'complete') => {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') {
      audioCtx.resume();
  }

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  const now = audioCtx.currentTime;

  if (type === 'click') {
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, now);
    oscillator.frequency.exponentialRampToValueAtTime(300, now + 0.1);
    gainNode.gain.setValueAtTime(0.1, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    oscillator.start(now);
    oscillator.stop(now + 0.1);
  } else if (type === 'success') {
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(440, now);
    oscillator.frequency.setValueAtTime(554, now + 0.1); // C#
    oscillator.frequency.setValueAtTime(659, now + 0.2); // E
    gainNode.gain.setValueAtTime(0.1, now);
    gainNode.gain.linearRampToValueAtTime(0.1, now + 0.2);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    oscillator.start(now);
    oscillator.stop(now + 0.6);
  } else if (type === 'complete') {
     // Fanfare-ish
     oscillator.type = 'square';
     oscillator.frequency.setValueAtTime(523.25, now); // C
     gainNode.gain.setValueAtTime(0.1, now);
     gainNode.gain.setValueAtTime(0, now + 0.1);
     
     const osc2 = audioCtx.createOscillator();
     const gain2 = audioCtx.createGain();
     osc2.connect(gain2);
     gain2.connect(audioCtx.destination);
     osc2.type = 'square';
     osc2.frequency.setValueAtTime(659.25, now + 0.15); // E
     gain2.gain.setValueAtTime(0.1, now + 0.15);
     gain2.gain.exponentialRampToValueAtTime(0.01, now + 1.0);
     
     oscillator.start(now);
     oscillator.stop(now + 0.15);
     osc2.start(now + 0.15);
     osc2.stop(now + 1.0);
  }
};

export const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    }
};