import { type FC, useState, useEffect } from 'react';

export const Header: FC = () => {
    const [time, setTime] = useState(new Date());
    const [riftState, setRiftState] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        const riftTimer = setInterval(() => setRiftState(s => !s), 800);
        return () => {
            clearInterval(timer);
            clearInterval(riftTimer);
        };
    }, []);

    // NOV 06 1983 // 23:17:42
    // We'll hardcode the date to match the lore, but keep real time?
    // The user prompt said: "NOV 06 1983 // 23:17:42" as an example.
    // Let's make it fixed date, real time for immersive feel.
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;

    return (
        <header className="w-full border-b-2 border-green-500 p-4 flex justify-between items-center bg-black/50 backdrop-blur-sm z-50">
            <div className="flex flex-col">
                <h1 className="text-xl md:text-2xl tracking-widest text-glow font-bold uppercase">
                    Interdimensional Signal Relay <span className="text-xs align-top opacity-50">– ONLINE</span>
                </h1>
            </div>

            <div className="flex flex-col items-end gap-1">
                <div className={`text-sm uppercase tracking-widest ${riftState ? 'opacity-100' : 'opacity-20'} text-red-500 text-glow-red font-bold`}>
                    ⚠ Rift Status: Unstable
                </div>
                <div className="text-lg font-mono text-glow">
                    NOV 06 1983 // {timeString}
                </div>
            </div>
        </header>
    );
};
