import { useState } from 'react';
import { IntroSequence } from './components/screens/IntroSequence';
import { CoreChallenge } from './components/screens/CoreChallenge';

function App() {
  const [appMode, setAppMode] = useState<'intro' | 'challenge'>('intro');

  const handleNavigate = () => {
    setAppMode('challenge');
  };

  const handleReset = () => {
    setAppMode('intro');
  };

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative">
      {/* Dynamic Background Noise (Persists across pages) */}
      <div className="fixed inset-0 pointer-events-none z-[100] bg-noise opacity-[0.03]"></div>
      <div className="fixed inset-0 pointer-events-none z-[101] scanlines opacity-20"></div>

      {appMode === 'intro' && <IntroSequence onNavigate={handleNavigate} />}
      {appMode === 'challenge' && <CoreChallenge onReset={handleReset} />}

      {/* Global Metadata Tooltip */}
      <div className="fixed bottom-4 left-4 z-[200] opacity-0 hover:opacity-10 transition-opacity">
        <span className="text-[8px] text-term-green font-mono tracking-widest">
          HAWKINS_TERMINAL_V8.3_LIVE
        </span>
      </div>
    </div>
  );
}

export default App;
