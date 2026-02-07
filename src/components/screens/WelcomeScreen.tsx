import { type FC, useState } from 'react';

interface WelcomeScreenProps {
    onStart: () => void;
}

export const WelcomeScreen: FC<WelcomeScreenProps> = ({ onStart }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden radar-grid">

            {/* Radar Sweep Effect */}
            <div className="radar-sweep"></div>

            {/* Status Corners */}
            <div className="absolute top-8 left-8 text-sm md:text-base text-green-700 font-mono flex flex-col gap-1">
                <span>HAWKINS LAB // 1983</span>
                <span className="text-red-900 animate-pulse">SECURITY LEVEL: BLACK</span>
            </div>

            <div className="absolute top-8 right-8 text-sm md:text-base text-green-700 font-mono flex flex-col gap-1 text-right">
                <span className="text-red-600 animate-pulse">RIFT STATUS: OPEN</span>
                <span className="text-jitter">INTERFERENCE: SEVERE</span>
            </div>

            <div className="absolute bottom-8 left-8 text-sm md:text-base text-green-800 font-mono flex flex-col gap-1">
                <span>SYSTEM SANITY: 67%</span>
                <span className="opacity-50">STABILITY: DEGRADING</span>
            </div>

            <div className="absolute bottom-8 right-8 text-sm md:text-base text-green-800 font-mono flex flex-col gap-1 text-right">
                <span className="text-red-800 text-jitter">UNKNOWN PRESENCE DETECTED</span>
                <span className="opacity-50">SIGNAL ORIGIN: UNVERIFIED</span>
            </div>


            {/* Main Content */}
            <div className="z-10 flex flex-col items-center gap-2 mb-16">
                <h1 className="text-6xl md:text-8xl font-bold text-center text-glow tracking-tighter leading-none crt-flicker">
                    UPSIDE DOWN<br />
                    COMMUNICATOR
                </h1>
                <div className="text-amber-500 tracking-[0.5em] text-sm md:text-lg animate-pulse mt-4">
                    INTERDIMENSIONAL SIGNAL RELAY
                </div>
                <div className="text-green-900 text-xs tracking-widest opacity-60">
                    EXPERIMENTAL PROTOTYPE
                </div>
            </div>

            {/* Action Button */}
            <button
                onClick={onStart}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`
            z-20 px-8 py-4 border-2 transition-all duration-75 relative group
            ${isHovered ? 'bg-green-500 border-green-400 text-black' : 'bg-black border-green-700 text-green-500'}
        `}
            >
                <div className={`text-xl md:text-2xl font-bold tracking-widest uppercase ${isHovered ? 'invert' : ''}`}>
                    [ INITIALIZE SIGNAL DECODER ]
                </div>

                {/* Button glint */}
                <div className="absolute top-0 left-0 w-full h-1 bg-white opacity-10"></div>
            </button>

            <div className="mt-4 text-xs text-red-900 uppercase tracking-widest opacity-80 animate-pulse">
                Plain text communication will not survive
            </div>

        </div>
    );
};
