import { type FC, useState, useEffect, useRef } from 'react';

interface IntroSequenceProps {
    onNavigate: () => void;
}

export const IntroSequence: FC<IntroSequenceProps> = ({ onNavigate }) => {
    const [scene, setScene] = useState<'loading' | 'home' | 'transition'>('loading');
    const [loadStep, setLoadStep] = useState(0);
    const [statusText, setStatusText] = useState<string[]>([]);
    const [isReady, setIsReady] = useState(false);

    const fogRef = useRef<HTMLDivElement>(null);
    const maxBlocks = 20;

    // Scene 1: Loading Logic
    useEffect(() => {
        if (scene !== 'loading') return;

        const loadInterval = setInterval(() => {
            setLoadStep(prev => {
                if (prev >= maxBlocks) {
                    clearInterval(loadInterval);
                    return maxBlocks;
                }
                // Occasional dropout simulation
                if (Math.random() < 0.1) return prev;
                return prev + 1;
            });
        }, 150);

        const textSteps = [
            { d: 1000, t: "CHECKING SIGNAL PATH" },
            { d: 2500, t: "REALITY ANCHOR UNSTABLE" },
            { d: 4500, t: "INTERFERENCE DETECTED" },
            { d: 6500, t: "DECODER READY", finale: true }
        ];

        const timeouts = textSteps.map(s => setTimeout(() => {
            setStatusText(prev => [...prev, s.t]);
            if (s.finale) setIsReady(true);
        }, s.d));

        return () => {
            clearInterval(loadInterval);
            timeouts.forEach(clearTimeout);
        };
    }, [scene]);

    // Scene 2/3: Home Mouse Interaction
    useEffect(() => {
        if (scene !== 'home') return;
        const handleMouseMove = (e: MouseEvent) => {
            if (fogRef.current) {
                const x = (e.clientX / window.innerWidth - 0.5) * 20;
                const y = (e.clientY / window.innerHeight - 0.5) * 20;
                fogRef.current.style.transform = `translate(${x}px, ${y}px)`;
            }
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [scene]);

    const handleStart = () => {
        setScene('transition');
        setTimeout(() => {
            onNavigate();
        }, 2000);
    };

    // LOADING RENDER
    if (scene === 'loading') {
        return (
            <div className="w-full h-full bg-black text-term-green flex flex-col items-center justify-center p-8 font-mono">
                <div className="crt-scanline"></div>
                <div className="scanlines opacity-20"></div>

                <div className="flex flex-col gap-12 w-full max-w-2xl">
                    <h1 className="text-3xl md:text-5xl text-center tracking-widest animate-flicker uppercase">
                        POWERING INTERDIMENSIONAL RELAY
                    </h1>

                    {/* Chunky Loader */}
                    <div className="flex justify-center h-8">
                        {[...Array(maxBlocks)].map((_, i) => (
                            <div
                                key={i}
                                className={`w-6 h-8 mr-1 border border-term-green/30 ${i < loadStep ? 'bg-term-green shadow-[0_0_10px_rgba(0,255,65,0.5)]' : ''}`}
                                style={{ opacity: i < loadStep ? (Math.random() > 0.05 ? 1 : 0.5) : 0.2 }}
                            ></div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-2 text-xl opacity-80 h-32">
                        {statusText.map((t, i) => (
                            <div key={i} className="animate-diag">{t}</div>
                        ))}
                    </div>

                    {isReady && (
                        <button
                            onClick={() => setScene('home')}
                            className="mt-8 self-center animate-pulse border-2 border-term-green px-6 py-2 hover:bg-term-green hover:text-black transition-colors uppercase tracking-widest"
                        >
                            INITIALIZE INTERFACE
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // HOME RENDER
    if (scene === 'home') {
        return (
            <div className="w-full h-full bg-black text-term-green flex flex-col relative overflow-hidden font-mono p-4 md:p-8">
                <div className="crt-scanline"></div>
                <div className="scanlines opacity-20"></div>

                {/* Title Header */}
                <header className="z-10 border-4 border-term-green p-6 text-center relative">
                    <h1 className="text-5xl md:text-7xl tracking-tighter font-black animate-flicker">
                        UPSIDE DOWN COMMUNICATOR
                    </h1>
                    <p className="mt-2 text-lg tracking-[0.4em] opacity-60">NON-TEXT SIGNAL TRANSMISSION INTERFACE</p>
                    <div className="absolute -bottom-1 left-4 bg-black px-2 text-xs">V.1983-RELAY</div>
                </header>

                <main className="flex-1 flex flex-col md:flex-row gap-8 py-8 items-center justify-center relative z-10 w-full max-w-7xl mx-auto">
                    {/* Left Panel */}
                    <div className="hidden md:flex flex-col gap-12 w-64 border-r border-term-green/30 p-4">
                        <div className="flex flex-col gap-2">
                            <div className="text-xs opacity-50 uppercase">Signal Integrity</div>
                            <div className="text-xl font-bold">LOW</div>
                            <div className="h-2 w-full bg-term-green/10 border border-term-green/30">
                                <div className="h-full bg-term-green w-1/4 animate-pulse"></div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="text-xs opacity-50 uppercase">Interference</div>
                            <div className="text-xl font-bold">ACTIVE</div>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className={`h-4 w-4 border border-term-green/30 ${i < 4 ? 'bg-term-green animate-pulse' : ''}`}></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Center Core */}
                    <div className="flex-1 flex flex-col items-center justify-center gap-16 px-4">
                        <div className="relative group">
                            <div className="absolute -inset-4 border border-term-green/20 animate-pulse-ring rounded-full"></div>
                            <button
                                onClick={handleStart}
                                className="chunky-button relative z-10"
                            >
                                <span className="relative z-10">ENTER CORE SYSTEM</span>
                            </button>
                        </div>
                        <div className="text-[10px] tracking-[1em] opacity-30 mt-8 animate-pulse">CAUTION: DIMENSIONAL DRIFT DETECTED</div>
                    </div>

                    {/* Right Panel */}
                    <div className="hidden md:flex flex-col gap-12 w-64 border-l border-term-green/30 p-4 text-right">
                        <div className="flex flex-col gap-2">
                            <div className="text-xs opacity-50 uppercase">System Sanity</div>
                            <div className="text-xl font-bold">78%</div>
                            <div className="h-2 w-full bg-term-green/10 border border-term-green/30">
                                <div className="h-full bg-term-green w-[78%] animate-bar"></div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="text-xs opacity-50 uppercase">Terminal Mode</div>
                            <div className="text-xl font-bold">NORMAL</div>
                            <div className="animate-flicker text-xs font-bold text-term-amber">SECURE_LINK_ENCRYPTED</div>
                        </div>
                    </div>
                </main>

                <footer className="z-10 border-t border-term-green/30 py-4 flex justify-between text-[10px] opacity-40 uppercase tracking-widest">
                    <span>HAWKINS_NATIONAL_LAB // 1983</span>
                    <span>SYS_TEMP: 104F // FAN_AUTO</span>
                    <span>GATE_MONITOR: [STABLE]</span>
                </footer>
            </div>
        );
    }

    // TRANSITION RENDER
    return (
        <div className="w-full h-full bg-black flex items-center justify-center animate-shake relative overflow-hidden">
            <div className="fixed inset-0 bg-term-green mix-blend-difference z-50 animate-pulse opacity-20"></div>
            <div className="fixed inset-0 bg-noise opacity-20 z-[60]"></div>
            <div className="text-center z-[70] flex flex-col gap-4">
                <h1 className="text-white text-5xl font-black italic tracking-tighter drop-shadow-[0_0_20px_red]">
                    ENGAGING NON-STANDARD TRANSMISSION PROTOCOL
                </h1>
                <div className="h-1 w-full bg-term-amber animate-pulse"></div>
            </div>
        </div>
    );
};
