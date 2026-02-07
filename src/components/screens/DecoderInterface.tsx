import { type FC } from 'react';

const symbols = ["∇", "Δ", "Ξ", "Ψ", "Ω", "Σ", "Π", "Φ", "Λ", "Θ", "Ж", "Ѻ"];

export const DecoderInterface: FC = () => {
    return (
        <div className="w-full h-full bg-black flex flex-col items-center justify-center relative overflow-hidden">
            <div className="bg-film-grain mix-blend-multiply opacity-40"></div>
            <div className="scanlines opacity-70"></div>

            {/* Claustrophobic directional light */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1a0000_0%,transparent_50% )] opacity-60 pointer-events-none"></div>

            <div className="z-10 flex flex-col items-center gap-16 w-full max-w-4xl px-8">
                <h1 className="text-4xl md:text-6xl font-serif text-red-900 tracking-[0.5em] text-glow-blood uppercase">
                    DECODER INTERFACE
                </h1>

                {/* Symbol Grid */}
                <div className="grid grid-cols-4 md:grid-cols-6 gap-8 text-5xl md:text-7xl text-red-600 font-serif opacity-80">
                    {[...Array(24)].map((_, i) => (
                        <div
                            key={i}
                            className="animate-symbol flex items-center justify-center"
                            style={{ animationDelay: `${Math.random() * 4}s` }}
                        >
                            {symbols[i % symbols.length]}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-3 gap-12 w-full text-xs md:text-sm font-mono tracking-widest text-red-900 border-t border-red-950 pt-8">
                    <div className="flex flex-col gap-2">
                        <span className="text-white animate-pulse">PATTERN STABLE</span>
                        <div className="h-1 bg-red-900 w-full overflow-hidden">
                            <div className="h-full bg-red-600 w-1/2 animate-pulse"></div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 opacity-40">
                        <span>PATTERN LOST</span>
                        <div className="h-1 bg-red-950 w-full"></div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-red-700">PATTERN REFORMING</span>
                        <div className="h-1 bg-red-900 w-full overflow-hidden">
                            <div className="h-full bg-red-600 w-3/4 animate-pulse" style={{ animationDelay: '1s' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Extreme noise flash */}
            <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none animate-violent-shake"></div>
        </div>
    );
};
