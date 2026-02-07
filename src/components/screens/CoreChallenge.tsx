import { type FC, useState, useEffect, type ChangeEvent, useRef } from 'react';

interface CoreChallengeProps {
    onReset: () => void;
}

export const CoreChallenge: FC<CoreChallengeProps> = ({ onReset }) => {
    const [input, setInput] = useState("");
    const [sanity, setSanity] = useState(100);
    const [isPossessed, setIsPossessed] = useState(false);
    const [possessedTimer, setPossessedTimer] = useState(0);
    const [signalActive, setSignalActive] = useState(false);

    // Sanity Drain Logic
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isPossessed) {
                setSanity(prev => {
                    if (prev <= 0) {
                        setIsPossessed(true);
                        setPossessedTimer(30);
                        return 0;
                    }
                    return prev - 0.5;
                });
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [isPossessed]);

    // Possession Timer Logic
    useEffect(() => {
        if (!isPossessed) return;
        const interval = setInterval(() => {
            setPossessedTimer(prev => {
                if (prev <= 1) {
                    setIsPossessed(false);
                    setSanity(100);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [isPossessed]);

    const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value.toUpperCase());
        setSignalActive(true);
        setTimeout(() => setSignalActive(false), 500);
    };

    // Hidden recovery mechanism: Click the "SYSTEM SANITY" label 5 times
    const recoveryClicks = useRef(0);
    const handleRecovery = () => {
        if (!isPossessed) return;
        recoveryClicks.current += 1;
        if (recoveryClicks.current >= 5) {
            setIsPossessed(false);
            setSanity(100);
            recoveryClicks.current = 0;
        }
    };

    return (
        <div className={`w-full h-full bg-black text-term-green flex flex-col font-mono p-4 md:p-8 transition-all duration-300 ${isPossessed ? 'invert hue-rotate-180 animate-shake' : ''}`}>
            <div className="crt-scanline"></div>
            <div className="scanlines opacity-20"></div>

            {/* Header */}
            <header className="flex justify-between items-center border-b border-term-green/30 pb-4 mb-8">
                <div className="flex flex-col">
                    <span className="text-2xl font-black tracking-widest">SIGNAL_PROCESSOR_V8.3</span>
                    <span className="text-[10px] opacity-50">LOCATION: HAWKINS_LAB_SUBLEVEL_4</span>
                </div>
                <div className="text-right">
                    <div className={`text-xl font-bold ${isPossessed ? 'text-term-red animate-pulse' : 'text-term-green'}`}>
                        {isPossessed ? 'POSSESSED MODE ACTIVE' : 'MODE: NORMAL'}
                    </div>
                    <div className="text-[10px] opacity-50">{isPossessed ? `SYSTEM OVERRIDE: ${possessedTimer}s` : 'ENCRYPTION: ACTIVE'}</div>
                </div>
            </header>

            <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Section 1: Input & Signal Area */}
                <section className="flex flex-col gap-8 border-r border-term-green/10 pr-8">
                    <div className="flex flex-col gap-4">
                        <label className="text-xs tracking-[0.3em] opacity-60">OPERATOR INPUT</label>
                        <input
                            type="text"
                            value={input}
                            onChange={handleInput}
                            placeholder="TYPE SIGNAL HERE..."
                            className="bg-transparent border-4 border-term-green/30 p-4 text-2xl terminal-text focus:border-term-green outline-none placeholder:opacity-20"
                        />
                        <div className="text-[10px] opacity-40">CAUTION: WORDS ARE CONVERTED TO WAVEFORMS</div>
                    </div>

                    <div className="flex-1 border-4 border-term-green/20 relative overflow-hidden bg-term-green/5">
                        <div className="absolute inset-x-0 top-1/2 h-[2px] bg-term-green/20"></div>

                        {/* Visual Signal Area */}
                        <div className="h-full w-full flex items-center justify-center gap-4 px-12">
                            {input.split('').map((char, i) => (
                                <div
                                    key={i}
                                    className={`w-4 bg-term-green transition-all duration-300 ${signalActive ? 'animate-bar' : 'h-1/4 opacity-40'}`}
                                    style={{
                                        height: `${20 + (char.charCodeAt(0) % 60)}%`,
                                        animationDelay: `${i * 0.1}s`
                                    }}
                                ></div>
                            ))}
                            {input === "" && (
                                <div className="text-term-green/20 text-sm tracking-[0.5em] animate-pulse">AWAITING INPUT...</div>
                            )}
                        </div>

                        {/* Symbol Grid Overlay */}
                        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-[0.05] pointer-events-none">
                            {[...Array(64)].map((_, i) => (
                                <div key={i} className="border border-term-green/20 flex items-center justify-center text-[8px]">
                                    {Math.random() > 0.8 ? 'Δ' : '+'}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Section 2: Sanity & Status */}
                <section className="flex flex-col gap-12">
                    <div className="flex flex-col gap-6">
                        <div
                            className="flex justify-between items-end cursor-help group"
                            onClick={handleRecovery}
                        >
                            <label className="text-xs tracking-[0.3em] opacity-60 group-hover:opacity-100 transition-opacity">SYSTEM SANITY</label>
                            <span className={`text-3xl font-black ${sanity < 30 ? 'text-term-red animate-flicker' : ''}`}>
                                {Math.floor(sanity)}%
                            </span>
                        </div>
                        <div className="h-12 w-full border-4 border-term-green/30 p-1 bg-black">
                            <div
                                className={`h-full transition-all duration-300 ${sanity < 30 ? 'bg-term-red shadow-[0_0_15px_red]' : 'bg-term-green'}`}
                                style={{ width: `${sanity}%` }}
                            ></div>
                        </div>
                        {isPossessed && (
                            <div className="text-term-red text-xs animate-pulse font-bold tracking-widest text-center">
                                RESISTANCE REQUIRED // INITIATE OVERRIDE
                            </div>
                        )}
                    </div>

                    <div className="flex-1 grid grid-cols-2 gap-4">
                        <div className="border border-term-green/30 p-4 flex flex-col gap-2 relative group">
                            <span className="text-[10px] opacity-40">REALITY_ANCHOR</span>
                            <div className="flex-1 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full border-4 border-term-green/20 border-t-term-green animate-spin"></div>
                            </div>
                            <div className="text-center text-xs opacity-60">STABLE</div>
                        </div>
                        <div className="border border-term-green/30 p-4 flex flex-col gap-2">
                            <span className="text-[10px] opacity-40">DIMENSIONAL_DRIFT</span>
                            <div className="flex-1 flex flex-col justify-center gap-1">
                                {[...Array(8)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-2 bg-term-green/20 relative"
                                    >
                                        <div
                                            className="absolute inset-y-0 bg-term-green/60 animate-bar"
                                            style={{ animationDelay: `${i * 0.2}s`, width: `${30 + Math.random() * 40}%` }}
                                        ></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="h-32 border-4 border-term-amber/30 bg-term-amber/5 p-4 flex flex-col gap-2">
                        <span className="text-[10px] text-term-amber font-bold">SYSTEM_LOG</span>
                        <div className="overflow-hidden text-[9px] text-term-amber/80 flex flex-col gap-1">
                            <div>{'>'} INITIALIZING NEURAL_LINK... OK</div>
                            <div className="animate-flicker">{'>'} WARNING: UNKNOWN ENTITY DETECTED</div>
                            {isPossessed && <div className="text-term-red animate-pulse">{'>'} ERROR: CONTROL_LOST_TO_FLAYER</div>}
                        </div>
                    </div>
                </section>
            </main>

            <footer className="mt-8 pt-4 border-t border-term-green/30 flex justify-between text-[10px] opacity-40">
                <button onClick={onReset} className="hover:opacity-100 transition-opacity">SYSTEM_REBOOT</button>
                <span>DATALINK_ESTABLISHED // TARGET: THE_VOID</span>
            </footer>
        </div>
    );
};
