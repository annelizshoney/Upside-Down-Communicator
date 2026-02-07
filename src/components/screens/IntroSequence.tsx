import { type FC, useState, useEffect, useRef } from 'react';

interface IntroSequenceProps {
    onNavigate: (target: 'initialize' | 'decoder' | 'status') => void;
}

export const IntroSequence: FC<IntroSequenceProps> = ({ onNavigate }) => {
    const [scene, setScene] = useState<'scene1' | 'scene2' | 'transition'>('scene1');
    const [scene1Step, setScene1Step] = useState(0);
    const [scene2Step, setScene2Step] = useState(0);
    const [transitionTarget, setTransitionTarget] = useState<'initialize' | 'decoder' | 'status' | null>(null);
    const [transitionStep, setTransitionStep] = useState(0);

    const fogRef = useRef<HTMLDivElement>(null);

    // Scene 1 Logic: The Gate Opening
    useEffect(() => {
        if (scene !== 'scene1') return;
        const steps = [
            { d: 1000, fn: () => setScene1Step(1) },
            { d: 3000, fn: () => setScene1Step(2) },
            { d: 5000, fn: () => setScene1Step(3) },
            { d: 8000, fn: () => setScene1Step(4) },
            { d: 10000, fn: () => setScene1Step(5) },
            { d: 13000, fn: () => setScene1Step(6) },
            { d: 15000, fn: () => setScene('scene2') }
        ];
        const timeouts = steps.map(s => setTimeout(s.fn, s.d));
        return () => timeouts.forEach(clearTimeout);
    }, [scene]);

    // Scene 2 Logic: Home Page assembly
    useEffect(() => {
        if (scene !== 'scene2') return;
        const timer = setInterval(() => {
            setScene2Step(prev => (prev >= 6 ? 6 : prev + 1));
        }, 600);
        return () => clearInterval(timer);
    }, [scene]);

    // Transition Logic: Targeted Physical Redirects
    useEffect(() => {
        if (scene !== 'transition' || !transitionTarget) return;

        const timings: Record<string, number[]> = {
            initialize: [1500, 3000], // Establish text -> Redirect
            decoder: [1000, 2000],     // Frag -> Redirect
            status: [1200, 2500]       // Slide -> Redirect
        };

        const steps = timings[transitionTarget];
        const t1 = setTimeout(() => setTransitionStep(1), steps[0]);
        const t2 = setTimeout(() => onNavigate(transitionTarget), steps[1]);

        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [scene, transitionTarget, onNavigate]);

    if (scene === 'scene1') {
        return (
            <div className="w-full h-full bg-black flex items-center justify-center relative overflow-hidden">
                <div className="bg-film-grain mix-blend-overlay"></div>
                {scene1Step >= 1 && <div className="scanlines opacity-50"></div>}
                <div className={`relative transition-all duration-[4000ms] ${scene1Step >= 3 ? 'scale-100' : 'scale-50 opacity-0'}`}>
                    <div className="w-[300px] h-[300px] md:w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,#8a0000_0%,transparent_70%)] opacity-60 animate-pulse"></div>
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                        {scene1Step >= 3 && (
                            <>
                                <path d="M50 50 Q60 20 80 10" className="vein-crack animate-vein" />
                                <path d="M50 50 Q30 80 10 90" className="vein-crack animate-vein" style={{ animationDelay: '1s' }} />
                            </>
                        )}
                    </svg>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-8">
                    {scene1Step === 2 && <h1 className="text-4xl md:text-6xl font-serif text-glow-blood animate-text-warp uppercase tracking-[0.2em]">INTERDIMENSIONAL SIGNAL DETECTED</h1>}
                    {scene1Step === 3 && <h2 className="text-2xl md:text-4xl font-mono text-red-950 font-black animate-pulse uppercase tracking-[0.5em]">STABILITY FAILING</h2>}
                    {scene1Step >= 4 && (
                        <div className="flex flex-col gap-8">
                            <h1 className="text-6xl md:text-9xl font-serif text-white tracking-[0.3em] drop-shadow-[0_0_20px_red]">THE GATE</h1>
                            {scene1Step >= 5 && <h2 className="text-4xl md:text-6xl font-serif text-red-600 tracking-[0.5em] animate-breathe-heavy">IS OPEN</h2>}
                        </div>
                    )}
                </div>
                {scene1Step >= 6 && <div className="fixed inset-0 z-50 bg-noise mix-blend-color-dodge opacity-40 animate-violent-shake"></div>}
            </div>
        );
    }

    if (scene === 'scene2') {
        return (
            <div className="relative w-full h-full bg-black overflow-hidden flex flex-col items-center justify-center">
                <div className="blood-drain-overlay blood-drain-active opacity-40"></div>
                <div className="absolute inset-0 bg-fog opacity-30 pointer-events-none transform scale-110" ref={fogRef}></div>
                <div className="bg-film-grain opacity-20"></div>
                <div className="scanlines opacity-20"></div>
                <div className="z-20 text-center mb-16 relative px-4">
                    <h1 className={`text-6xl md:text-9xl font-serif text-glow-blood tracking-widest text-red-600 animate-heartbeat transition-all duration-1000 ${scene2Step >= 1 ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>UPSIDE DOWN</h1>
                    <h2 className={`text-3xl md:text-5xl font-serif text-red-800 tracking-widest transition-all duration-1000 delay-500 ${scene2Step >= 2 ? 'opacity-80' : 'opacity-0 translate-y-4'}`}>COMMUNICATOR</h2>
                    <p className={`mt-8 text-xs md:text-sm text-red-900 font-mono tracking-[0.8em] uppercase transition-opacity duration-1000 delay-1000 ${scene2Step >= 3 ? 'opacity-50' : 'opacity-0'}`}>The Signal Must Get Through</p>
                </div>
                <div className="z-30 w-full max-w-2xl px-8 flex flex-col gap-6">
                    {[
                        { l: 'INITIALIZE SIGNAL', t: 'initialize' },
                        { l: 'DECODER INTERFACE', t: 'decoder' },
                        { l: 'SYSTEM STATUS', t: 'status' },
                        { l: 'ARCHIVES', t: 'status' }
                    ].map((item, i) => {
                        const visible = scene2Step >= (4 + i);
                        return (
                            <button
                                key={item.l}
                                onClick={() => { setTransitionTarget(item.t as any); setScene('transition'); }}
                                className={`w-full py-5 px-8 border border-red-950/30 text-red-800 font-mono text-xl tracking-[0.3em] transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} hover:border-red-600 hover:text-red-500 hover:shadow-[0_0_20px_rgba(255,0,0,0.3)] hover:bg-red-950/10 group relative overflow-hidden`}
                            >
                                <div className="absolute inset-0 bg-noise opacity-0 group-hover:opacity-10 pointer-events-none"></div>
                                <span className="relative z-10 block group-hover:animate-pulse">{item.l}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    // TRANSITION SCENE
    return (
        <div className={`w-full h-full bg-black flex items-center justify-center relative overflow-hidden transition-all duration-500 ${transitionStep === 1 ? 'brightness-0' : ''}`}>
            <div className="bg-film-grain mix-blend-overlay"></div>
            <div className="scanlines opacity-40"></div>

            {transitionTarget === 'initialize' && (
                <div className={`fixed inset-0 z-50 bg-noise mix-blend-multiply opacity-60 animate-static-inward`}>
                    <div className="h-full w-full flex items-center justify-center">
                        <h1 className="text-white font-serif text-3xl tracking-widest animate-pulse">ESTABLISHING SIGNAL PATH</h1>
                    </div>
                </div>
            )}

            {transitionTarget === 'decoder' && (
                <div className="fixed inset-0 z-50 animate-violent-glitch bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <h1 className="text-red-600 font-serif text-5xl tracking-[0.5em] animate-pulse">DECODER ACTIVE</h1>
                </div>
            )}

            {transitionTarget === 'status' && (
                <div className="fixed inset-0 z-50 animate-gravity-slide bg-red-950/20 flex flex-col items-center justify-center">
                    <div className="mb-48 flex flex-col items-center gap-4">
                        <div className="w-16 h-1 w-full bg-red-600 animate-blink-red"></div>
                        <h1 className="text-white font-mono text-2xl tracking-[0.5em]">ACCESSING CORE SYSTEMS</h1>
                        <div className="w-16 h-1 w-full bg-red-600 animate-blink-red"></div>
                    </div>
                </div>
            )}
        </div>
    );
};
