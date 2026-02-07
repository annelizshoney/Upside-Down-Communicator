import { type FC } from 'react';

interface SanityMeterProps {
    sanity: number; // 0 to 100
}

export const SanityMeter: FC<SanityMeterProps> = ({ sanity }) => {
    // Calculate segments (e.g., 20 segments total)
    const totalSegments = 20;
    const activeSegments = Math.round((sanity / 100) * totalSegments);

    return (
        <div className="h-full w-24 border-l-2 border-green-800 bg-black/60 flex flex-col items-center p-2 relative">
            <div className="text-xs text-green-500 mb-2 writing-vertical-lr tracking-widest uppercase opacity-80 transform rotate-180">
                System Sanity
            </div>

            <div className="flex-1 w-full flex flex-col-reverse gap-1 py-2">
                {Array.from({ length: totalSegments }).map((_, i) => {
                    const isActive = i < activeSegments;
                    const isCritical = i < 5; // Bottom 25% is red zone
                    const isWarn = i < 10 && i >= 5; // Next 25% is amber

                    let colorClass = "bg-green-900"; // Inactive default

                    if (isActive) {
                        if (isCritical) colorClass = "bg-red-600 shadow-[0_0_8px_rgba(255,0,0,0.8)]";
                        else if (isWarn) colorClass = "bg-amber-500 shadow-[0_0_5px_rgba(255,176,0,0.6)]";
                        else colorClass = "bg-green-500 shadow-[0_0_5px_rgba(51,255,0,0.6)]";
                    }

                    return (
                        <div
                            key={i}
                            className={`w-full flex-1 ${colorClass} transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-20'}`}
                        />
                    );
                })}
            </div>

            <div className="mt-2 text-center text-xl font-bold font-mono">
                <span className={sanity < 30 ? "text-red-500 animate-pulse" : "text-green-500"}>
                    {Math.round(sanity)}%
                </span>
            </div>
        </div>
    );
};
