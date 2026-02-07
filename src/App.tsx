import { useState, useEffect, useRef, useCallback } from 'react';
import './crt-effects.css';

// Morse code dictionary
const MORSE_CODE: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
  '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.', ' ': '/'
};

const REVERSE_MORSE: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE_CODE).map(([k, v]) => [v, k])
);

type PhosphorColor = 'green' | 'amber' | 'white';

const UpsideDownCommunicator = () => {
  // Core state
  const [message, setMessage] = useState('');
  const [morseOutput, setMorseOutput] = useState<string[]>([]);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [currentSignalIndex, setCurrentSignalIndex] = useState(0);
  const [transmissionHistory, setTransmissionHistory] = useState<Array<{message: string, timestamp: string}>>([]);
  
  // Sanity Meter
  const [sanity, setSanity] = useState(100);
  const [isPossessed, setIsPossessed] = useState(false);
  const [possessionTimer, setPossessionTimer] = useState(0);
  
  // Konami Code
  const [konamiSequence, setKonamiSequence] = useState<string[]>([]);
  const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'a', 'b'];
  
  // CRT Effects
  const [glitchIntensity, setGlitchIntensity] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false);
  const [currentSignalType, setCurrentSignalType] = useState<'dit' | 'dah' | null>(null);
  const [screenWarmedUp, setScreenWarmedUp] = useState(false);
  const [staticBurst, setStaticBurst] = useState(false);
  
  // New features
  const [phosphorColor, setPhosphorColor] = useState<PhosphorColor>('green');
  const [channel, setChannel] = useState(3);
  const [isChannelChanging, setIsChannelChanging] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [decodeMode, setDecodeMode] = useState(false);
  const [decodeInput, setDecodeInput] = useState('');
  const [decodedText, setDecodedText] = useState('');
  const [oscilloscopeData, setOscilloscopeData] = useState<number[]>(new Array(64).fill(50));
  
  // Audio refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Get phosphor colors based on selection
  const getPhosphorColors = () => {
    switch (phosphorColor) {
      case 'amber': return { main: '#ffaa00', dim: '#cc8800', dark: '#664400' };
      case 'white': return { main: '#ffffff', dim: '#cccccc', dark: '#666666' };
      default: return { main: '#00ff00', dim: '#00cc00', dark: '#006600' };
    }
  };

  const colors = getPhosphorColors();

  // Initialize audio context
  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      gainNodeRef.current.gain.value = 0;
    }
  }, []);

  // Play morse tone
  const playTone = useCallback((frequency: number, duration: number) => {
    if (!audioEnabled || !audioContextRef.current || !gainNodeRef.current) return;
    
    const osc = audioContextRef.current.createOscillator();
    osc.type = isPossessed ? 'sawtooth' : 'sine';
    osc.frequency.value = isPossessed ? frequency * (0.8 + Math.random() * 0.4) : frequency;
    osc.connect(gainNodeRef.current);
    
    gainNodeRef.current.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
    osc.start();
    
    setTimeout(() => {
      if (gainNodeRef.current && audioContextRef.current) {
        gainNodeRef.current.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      }
      osc.stop();
    }, duration);
  }, [audioEnabled, isPossessed]);

  // Play click sound
  const playClick = useCallback(() => {
    if (!audioEnabled || !audioContextRef.current) return;
    const osc = audioContextRef.current.createOscillator();
    const gain = audioContextRef.current.createGain();
    osc.type = 'square';
    osc.frequency.value = 150;
    osc.connect(gain);
    gain.connect(audioContextRef.current.destination);
    gain.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.05);
    osc.start();
    osc.stop(audioContextRef.current.currentTime + 0.05);
  }, [audioEnabled]);

  // Screen warmup effect
  useEffect(() => {
    const timer = setTimeout(() => setScreenWarmedUp(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Random static bursts
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.05) {
        setStaticBurst(true);
        setTimeout(() => setStaticBurst(false), 100 + Math.random() * 200);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Oscilloscope animation
  useEffect(() => {
    const interval = setInterval(() => {
      setOscilloscopeData(prev => {
        const newData = [...prev];
        newData.shift();
        if (isTransmitting && isFlashing) {
          newData.push(currentSignalType === 'dah' ? 90 : 70);
        } else if (isPossessed) {
          newData.push(Math.random() * 100);
        } else {
          newData.push(50 + Math.sin(Date.now() / 200) * 10 + Math.random() * 5);
        }
        return newData;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [isTransmitting, isFlashing, currentSignalType, isPossessed]);

  // Sanity meter countdown
  useEffect(() => {
    if (!isPossessed && sanity > 0) {
      const interval = setInterval(() => {
        setSanity(prev => Math.max(0, prev - 0.5));
      }, 1000);
      return () => clearInterval(interval);
    }
    if (sanity <= 0 && !isPossessed) {
      setIsPossessed(true);
      setPossessionTimer(30);
      setStaticBurst(true);
    }
  }, [sanity, isPossessed]);

  // Possession timer
  useEffect(() => {
    if (isPossessed && possessionTimer > 0) {
      const interval = setInterval(() => {
        setPossessionTimer(prev => {
          if (prev <= 1) {
            setIsPossessed(false);
            setSanity(100);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPossessed, possessionTimer]);

  // Konami code listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newSequence = [...konamiSequence, e.key].slice(-10);
      setKonamiSequence(newSequence);
      
      if (JSON.stringify(newSequence) === JSON.stringify(KONAMI_CODE)) {
        setIsPossessed(false);
        setSanity(100);
        setPossessionTimer(0);
        setKonamiSequence([]);
        setGlitchIntensity(0);
        playClick();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiSequence, playClick]);

  // Glitch effect during possession
  useEffect(() => {
    if (isPossessed) {
      const interval = setInterval(() => {
        setGlitchIntensity(Math.random() * 15);
      }, 80);
      return () => clearInterval(interval);
    } else {
      setGlitchIntensity(0);
    }
  }, [isPossessed]);

  // Morse transmission
  useEffect(() => {
    if (isTransmitting && currentSignalIndex < morseOutput.length) {
      const currentMorse = morseOutput[currentSignalIndex];
      const signals = currentMorse.split('');
      let signalIdx = 0;
      
      const playSignal = () => {
        if (signalIdx >= signals.length) {
          setIsFlashing(false);
          setCurrentSignalType(null);
          setTimeout(() => setCurrentSignalIndex(prev => prev + 1), 500);
          return;
        }
        
        const signal = signals[signalIdx];
        const isDit = signal === '.';
        const duration = isDit ? 200 : 600;
        
        setIsFlashing(true);
        setCurrentSignalType(isDit ? 'dit' : 'dah');
        playTone(emergencyMode ? 880 : 700, duration);
        
        setTimeout(() => {
          setIsFlashing(false);
          setCurrentSignalType(null);
          setTimeout(() => { signalIdx++; playSignal(); }, 200);
        }, duration);
      };
      
      playSignal();
    } else if (currentSignalIndex >= morseOutput.length && isTransmitting) {
      const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
      setTransmissionHistory(prev => [...prev, { message, timestamp }]);
      setIsTransmitting(false);
      setCurrentSignalIndex(0);
      setIsFlashing(false);
      setCurrentSignalType(null);
      setMessage('');
    }
  }, [isTransmitting, currentSignalIndex, morseOutput, message, playTone, emergencyMode]);

  const textToMorse = (text: string): string[] => {
    return text.toUpperCase().split('').map(char => MORSE_CODE[char] || '').filter(Boolean);
  };

  const handleTransmit = () => {
    if (message.trim()) {
      initAudio();
      playClick();
      const morse = textToMorse(message);
      setMorseOutput(morse);
      setIsTransmitting(true);
      setCurrentSignalIndex(0);
    }
  };

  const handleChannelChange = (newChannel: number) => {
    if (newChannel < 1 || newChannel > 13) return;
    playClick();
    setIsChannelChanging(true);
    setStaticBurst(true);
    setTimeout(() => {
      setChannel(newChannel);
      setIsChannelChanging(false);
      setStaticBurst(false);
    }, 500);
  };

  const handleDecode = () => {
    const parts = decodeInput.trim().split(/\s+/);
    const decoded = parts.map(p => REVERSE_MORSE[p] || '?').join('');
    setDecodedText(decoded);
  };

  const handleEmergencySOS = () => {
    initAudio();
    playClick();
    setEmergencyMode(true);
    setMessage('SOS');
    setTimeout(() => {
      const morse = textToMorse('SOS');
      setMorseOutput(morse);
      setIsTransmitting(true);
      setCurrentSignalIndex(0);
    }, 100);
  };

  const renderOscilloscope = () => (
    <div className="oscilloscope">
      <svg viewBox="0 0 64 40" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke={emergencyMode ? '#ff0000' : colors.main}
          strokeWidth="1"
          points={oscilloscopeData.map((v, i) => `${i},${40 - v * 0.4}`).join(' ')}
        />
      </svg>
      <div className="oscilloscope-label">SIGNAL WAVEFORM</div>
    </div>
  );

  const renderMorseReferenceChart = () => {
    const alphabet = [
      ['A', '.-'], ['B', '-...'], ['C', '-.-.'], ['D', '-..'],
      ['E', '.'], ['F', '..-.'], ['G', '--.'], ['H', '....'],
      ['I', '..'], ['J', '.---'], ['K', '-.-'], ['L', '.-..'],
      ['M', '--'], ['N', '-.'], ['O', '---'], ['P', '.--.'],
      ['Q', '--.-'], ['R', '.-.'], ['S', '...'], ['T', '-'],
      ['U', '..-'], ['V', '...-'], ['W', '.--'], ['X', '-..-'],
      ['Y', '-.--'], ['Z', '--..']
    ];

    return (
      <div className="morse-reference">
        <div className="reference-title">MORSE CODE REFERENCE</div>
        <div className="reference-grid">
          {alphabet.map(([char, code]) => (
            <div 
              key={char} 
              className={`reference-item ${isTransmitting && message.charAt(currentSignalIndex) === char ? 'active' : ''}`}
            >
              <span className="ref-char">{char}</span>
              <span className="ref-code">{code}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="crt-outer-housing">
      {/* CRT Bezel */}
      <div className="crt-bezel">
        <div className="bezel-brand">HAWKINS ELECTRONICS</div>
        <div className="bezel-model">MODEL UDC-1983</div>
        
        {/* Power LED */}
        <div className={`power-led ${screenWarmedUp ? 'on' : 'warming'}`} />
        
        {/* Channel Dial */}
        <div className="channel-dial">
          <div className="dial-label">CH</div>
          <div className="dial-display">{channel}</div>
          <div className="dial-buttons">
            <button onClick={() => handleChannelChange(channel - 1)}>▲</button>
            <button onClick={() => handleChannelChange(channel + 1)}>▼</button>
          </div>
        </div>
        
        {/* Phosphor Selector */}
        <div className="phosphor-selector">
          <div className="dial-label">PHOSPHOR</div>
          <div className="phosphor-buttons">
            <button 
              className={phosphorColor === 'green' ? 'active' : ''} 
              onClick={() => { setPhosphorColor('green'); playClick(); }}
              style={{ background: '#00ff00' }}
            />
            <button 
              className={phosphorColor === 'amber' ? 'active' : ''} 
              onClick={() => { setPhosphorColor('amber'); playClick(); }}
              style={{ background: '#ffaa00' }}
            />
            <button 
              className={phosphorColor === 'white' ? 'active' : ''} 
              onClick={() => { setPhosphorColor('white'); playClick(); }}
              style={{ background: '#ffffff' }}
            />
          </div>
        </div>

        {/* Audio Toggle */}
        <div className="audio-toggle">
          <button 
            onClick={() => { initAudio(); setAudioEnabled(!audioEnabled); playClick(); }}
            className={audioEnabled ? 'active' : ''}
          >
            {audioEnabled ? '🔊' : '🔇'}
          </button>
        </div>
      </div>

      {/* CRT Screen */}
      <div 
        className={`crt-screen ${!screenWarmedUp ? 'warming-up' : ''} ${isChannelChanging ? 'channel-changing' : ''} ${emergencyMode ? 'emergency' : ''}`}
        style={{
          '--phosphor-main': colors.main,
          '--phosphor-dim': colors.dim,
          '--phosphor-dark': colors.dark,
        } as React.CSSProperties}
      >
        {/* Barrel Distortion SVG Filter */}
        <svg className="crt-filters">
          <defs>
            <filter id="barrel">
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur" />
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" />
            </filter>
          </defs>
        </svg>

        {/* Full-screen morse flash */}
        {isFlashing && (
          <div 
            className={`morse-flash ${currentSignalType} ${emergencyMode ? 'emergency' : ''}`}
            style={{
              background: emergencyMode ? '#ff0000' : colors.main,
              animation: isPossessed ? 'glitch-flash 0.1s infinite' : 'none'
            }}
          />
        )}
        
        {/* Scanlines */}
        <div className="scanlines" />
        
        {/* Vertical Blanking Bar */}
        <div className="vbl-bar" />
        
        {/* Static Noise Overlay */}
        <div className={`static-noise ${staticBurst ? 'burst' : ''}`} />
        
        {/* RGB Split during possession */}
        {isPossessed && <div className="rgb-split-overlay" />}

        {/* Screen Content */}
        <div 
          className="screen-content"
          style={{
            transform: isPossessed ? `translate(${glitchIntensity}px, ${glitchIntensity * 0.5}px)` : 'none',
            filter: isPossessed ? `hue-rotate(${possessionTimer * 12}deg)` : 'none'
          }}
        >
          {/* Header */}
          <div className="terminal-header">
            <div className="terminal-title" style={{ color: colors.main }}>
              {isPossessed ? '▓▓▓ ƎƆIVƎD ᗡƎSSƎSSOS ▓▓▓' : '=== DIMENSIONAL COMM ARRAY ==='}
            </div>
            <div className="terminal-subtitle" style={{ color: colors.dim }}>
              {isPossessed ? 'ƎЯƎH ƧWϽ⅃ƎB ƎH⊥' : `HAWKINS NAT. LAB - CH ${channel}`}
            </div>
          </div>

          {/* Oscilloscope */}
          {renderOscilloscope()}

          {/* Sanity Meter */}
          <div className="sanity-container">
            <div className="meter-label">
              {isPossessed ? 'POSSESSION TIMER' : 'SYSTEM INTEGRITY'}
            </div>
            <div className="meter-bar-container">
              <div 
                className={`meter-bar ${isPossessed ? 'possessed' : sanity < 30 ? 'critical' : ''}`}
                style={{ 
                  width: `${isPossessed ? (possessionTimer / 30) * 100 : sanity}%`,
                  backgroundColor: isPossessed ? '#ff0066' : sanity < 30 ? '#ff6600' : colors.main
                }}
              />
              {/* VU meter ticks */}
              <div className="vu-ticks">
                {[...Array(10)].map((_, i) => <div key={i} className="tick" />)}
              </div>
            </div>
            <div className="meter-value" style={{ color: colors.main }}>
              {isPossessed ? `${possessionTimer}s` : `${Math.floor(sanity)}%`}
            </div>
          </div>

          {/* Warning Messages */}
          {isPossessed && (
            <div className="warning-flash">
              ⚠ ENTER KONAMI CODE TO RECOVER ⚠
            </div>
          )}

          {/* Mode Tabs */}
          <div className="mode-tabs">
            <button 
              className={!decodeMode ? 'active' : ''} 
              onClick={() => { setDecodeMode(false); playClick(); }}
              style={{ borderColor: colors.main, color: !decodeMode ? '#000' : colors.main, background: !decodeMode ? colors.main : 'transparent' }}
            >
              TRANSMIT
            </button>
            <button 
              className={decodeMode ? 'active' : ''} 
              onClick={() => { setDecodeMode(true); playClick(); }}
              style={{ borderColor: colors.main, color: decodeMode ? '#000' : colors.main, background: decodeMode ? colors.main : 'transparent' }}
            >
              DECODE
            </button>
            <button 
              className={`emergency-btn ${emergencyMode ? 'active' : ''}`}
              onClick={handleEmergencySOS}
            >
              🚨 SOS
            </button>
          </div>

          {!decodeMode ? (
            <>
              {/* Input Section */}
              <div className="input-section">
                <label className="input-label" style={{ color: colors.dim }}>
                  {isPossessed ? 'ƎƧƧⱯМ⅃ⱯИƎMI⅃UD ЯƎ⊥ИƎ' : 'ENTER MESSAGE TO ENCODE:'}
                </label>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => {
                    setEmergencyMode(false);
                    if (isPossessed) {
                      setMessage(e.target.value.split('').reverse().join(''));
                    } else {
                      setMessage(e.target.value.toUpperCase());
                    }
                  }}
                  className="terminal-input"
                  placeholder={isPossessed ? "...ƎЯƎH ƎM ԀƎHL" : "TYPE MESSAGE HERE..."}
                  maxLength={50}
                  disabled={isTransmitting}
                  style={{ borderColor: colors.main, color: colors.main }}
                />
              </div>

              {/* Transmit Button */}
              <button
                onClick={handleTransmit}
                disabled={isTransmitting || !message.trim()}
                className="transmit-button"
                style={{
                  borderColor: colors.main,
                  color: colors.main,
                  transform: isPossessed ? 'scaleX(-1)' : 'none'
                }}
              >
                {isPossessed ? '⊥IMƧИⱯЯ⊥ ▼' : isTransmitting ? '▼ TRANSMITTING...' : '▼ INITIATE TRANSMISSION ▼'}
              </button>

              {/* Transmission Display */}
              {isTransmitting && currentSignalIndex < morseOutput.length && (
                <div className="transmission-display" style={{ borderColor: colors.main }}>
                  <div className="tx-char" style={{ color: colors.main }}>
                    TRANSMITTING: <span className="highlight">{message.charAt(currentSignalIndex)}</span>
                  </div>
                  <div className="tx-pattern" style={{ color: colors.dim }}>
                    PATTERN: {morseOutput[currentSignalIndex]}
                  </div>
                  <div className="tx-progress" style={{ color: colors.dark }}>
                    {currentSignalIndex + 1} / {morseOutput.length}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Decode Mode */
            <div className="decode-section">
              <label className="input-label" style={{ color: colors.dim }}>
                ENTER MORSE CODE (space-separated):
              </label>
              <input
                type="text"
                value={decodeInput}
                onChange={(e) => setDecodeInput(e.target.value.toUpperCase())}
                className="terminal-input"
                placeholder=".- -... -.-."
                style={{ borderColor: colors.main, color: colors.main }}
              />
              <button
                onClick={handleDecode}
                className="transmit-button"
                style={{ borderColor: colors.main, color: colors.main }}
              >
                ▼ DECODE ▼
              </button>
              {decodedText && (
                <div className="decoded-output" style={{ borderColor: colors.main, color: colors.main }}>
                  DECODED: {decodedText}
                </div>
              )}
            </div>
          )}

          {/* Signal Legend */}
          <div className="signal-legend">
            <div className="legend-item">
              <div className="flash-indicator dit" style={{ background: colors.main }} /> 
              <span style={{ color: colors.dim }}>SHORT = DIT (·)</span>
            </div>
            <div className="legend-item">
              <div className="flash-indicator dah" style={{ background: colors.main }} /> 
              <span style={{ color: colors.dim }}>LONG = DAH (-)</span>
            </div>
          </div>

          {/* Morse Reference */}
          <div className="reference-section">
            {renderMorseReferenceChart()}
          </div>

          {/* Transmission History */}
          {transmissionHistory.length > 0 && (
            <div className="history-section" style={{ borderColor: colors.main }}>
              <div className="history-title" style={{ color: colors.main }}>TRANSMISSION LOG</div>
              <div className="history-list">
                {transmissionHistory.slice(-5).reverse().map((entry, idx) => (
                  <div key={idx} className="history-entry" style={{ borderColor: colors.dim }}>
                    <span className="history-time" style={{ color: colors.dim }}>[{entry.timestamp}]</span>
                    <span className="history-message" style={{ color: colors.main }}>{entry.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="terminal-footer" style={{ borderColor: colors.main, color: colors.dim }}>
            {isPossessed ? 
              '҉҉҉ ИWOD ƎDI⊥ƧԀU Ǝ⊥ƆƎИИOƆ ҉҉҉' : 
              '=== UPSIDE DOWN CONNECTED ==='
            }
          </div>
        </div>

        {/* CRT Curvature Overlay */}
        <div className="crt-curvature" />
        
        {/* Phosphor Glow */}
        <div className="phosphor-glow" style={{ boxShadow: `inset 0 0 100px ${colors.main}40` }} />
      </div>
    </div>
  );
};

export default UpsideDownCommunicator;
