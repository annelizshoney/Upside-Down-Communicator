import { type FC } from 'react';

export const SystemStatus: FC = () => {
    return (
        <div className="w-full h-full bg-black flex flex-col items-center p-8 md:p-16 relative overflow-hidden border-[20px] border-red-950/10">
            <div className="bg-film-grain opacity-20"></div>
            <div className="scanlines opacity-30"></div>
            <div className="radar-scan-line"></div>

            <div className="z-10 w-full max-w-6xl flex flex-col gap-12">
                <h1 className="text-5xl md:text-8xl font-serif text-red-900 tracking-widest border-b border-red-950 pb-4">
                    SYSTEM STATUS
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">

                    {/* Meter 1: Sanity */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-xl font-mono text-red-700 tracking-[0.3em]">SANITY LEVEL</h3>
                        <div className="h-64 md:h-96 w-full border border-red-950 bg-red-950/10 relative flex items-end p-2 px-4 gap-2">
                            {[...Array(12)].map((_, i) => (
                                <div
                                    key={i}
                                    className="flex-1 bg-red-900/40 border-t border-red-600 animate-meter"
                                    style={{
                                        animationDelay: `${i * 0.15}s`,
                                        animationDuration: `${2 + Math.random() * 2}s`
                                    }}
                                ></div>
                            ))}
                        </div>
                    </div>

                    {/* Meter 2: Signal Integrity */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-xl font-mono text-white tracking-[0.3em]">SIGNAL INTEGRITY</h3>
                        <div className="h-64 md:h-96 w-full border border-red-950 bg-red-950/10 relative overflow-hidden">
                            <svg className="w-full h-full opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <path
                                    d="M0 50 Q 25 20, 50 50 T 100 50"
                                    fill="none"
                                    stroke="red"
                                    strokeWidth="1"
                                    className="animate-pulse"
                                />
                                <path
                                    d="M0 50 Q 25 80, 50 50 T 100 50"
                                    fill="none"
                                    stroke="red"
                                    strokeWidth="0.5"
                                    className="animate-heartbeat opacity-40"
                                />
                            </svg>
                            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-red-800 opacity-20"></div>
                        </div>
                    </div>

                    {/* Meter 3: Interference */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-xl font-mono text-red-600 tracking-[0.3em] flex justify-between">
                            <span>INTERFERENCE</span>
                            <span className="animate-blink-red font-black">CRITICAL</span>
                        </h3>
                        <div className="flex-1 grid grid-rows-8 gap-2">
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-full border border-red-900 p-1 transition-all duration-1000 ${Math.random() > 0.4 ? 'bg-red-900/20' : 'bg-red-600 animate-pulse'}`}
                                >
                                    <div className="h-full bg-red-950 opacity-10"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                <div className="mt-auto flex justify-between items-center text-xs font-mono text-red-950 tracking-widest py-8 border-t border-red-950">
                    <span>HAWKINS_SYS_MGR_V4.2</span>
                    <div className="flex gap-8">
                        <span className="text-red-800 animate-pulse">OVERLOAD_WARNING</span>
                        <span>0xFF-83_BREACH_DETECTED</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
