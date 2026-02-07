import { useState } from 'react';
import { IntroSequence } from './components/screens/IntroSequence';
import { InitializeSignal } from './components/screens/InitializeSignal';
import { DecoderInterface } from './components/screens/DecoderInterface';
import { SystemStatus } from './components/screens/SystemStatus';

function App() {
  const [appMode, setAppMode] = useState<'intro' | 'initialize' | 'decoder' | 'status'>('intro');

  if (appMode === 'intro') {
    return <IntroSequence onNavigate={(mode) => setAppMode(mode as any)} />;
  }

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative">
      {/* Dynamic Background Noise (Persists across pages) */}
      <div className="fixed inset-0 pointer-events-none z-[100] bg-noise opacity-[0.03]"></div>
      <div className="fixed inset-0 pointer-events-none z-[101] scanlines opacity-20"></div>

      {appMode === 'initialize' && <InitializeSignal />}
      {appMode === 'decoder' && <DecoderInterface />}
      {appMode === 'status' && <SystemStatus />}

      {/* Global Navigation Override (Hidden for ritual) */}
      <div className="fixed bottom-4 right-4 z-[200] opacity-0 hover:opacity-10 transition-opacity">
        <button
          onClick={() => setAppMode('intro')}
          className="text-[10px] text-red-900 font-mono tracking-widest"
        >
          SYSTEM_REBOOT
        </button>
      </div>
    </div>
  );
}

export default App;
