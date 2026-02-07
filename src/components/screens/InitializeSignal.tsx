import { type FC } from 'react';

export const InitializeSignal: FC = () => {
    return (
        <div className="w-full h-full bg-black flex flex-col items-center justify-center relative overflow-hidden">
            <div className="bg-film-grain mix-blend-overlay"></div>
            <div className="scanlines opacity-60"></div>

            {/* Waveform Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <div className="w-[800px] h-[800px] border border-red-900 rounded-full animate-pulse-ring"></div>
                <div className="w-[600px] h-[600px] border border-red-900 rounded-full animate-pulse-ring" style={{ animationDelay: '1s' }}></div>
                <div className="w-[400px] h-[400px] border border-red-900 rounded-full animate-pulse-ring" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="z-10 flex flex-col items-center gap-12 text-center">
                <h1 className="text-5xl md:text-7xl font-serif text-white tracking-[0.3em] drop-shadow-[0_0_20px_red]">
                    SIGNAL INITIALIZATION
                </h1>

                <div className="relative w-48 h-48 flex items-center justify-center">
                    {/* Pulsing Signal Ring */}
                    <div className="absolute inset-0 border-4 border-red-600 rounded-full animate-ping opacity-20"></div>
                    <div className="absolute inset-4 border-2 border-red-800 rounded-full animate-pulse opacity-40"></div>
                    <div className="w-4 h-4 bg-red-600 rounded-full shadow-[0_0_20px_red] animate-heartbeat"></div>
                </div>

                <div className="flex flex-col gap-4 text-xl md:text-2xl font-mono text-red-500 tracking-[0.4em] h-8">
                    <span className="animate-pulse">ESTABLISHING SIGNAL PATH...</span>
                </div>

                <div className="mt-8 text-xs text-red-900 font-mono tracking-widest opacity-60">
                    CHANNEL LOCKING // FREQUENCY SHIFTING // CONNECTION UNSTABLE
                </div>
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 pointer-events-none p-8">
                {[...Array(10)].map((_, i) => (
                    <div
                        key={i}
                        className="w-1 h-1 bg-red-600 rounded-full absolute animate-ping opacity-30"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    ></div>
                ))}
            </div>
        </div>
    );
};
