import { useState, useEffect, useCallback } from 'react';

export const useSanitySystem = () => {
    const [sanity, setSanity] = useState(100);
    const [isPossessed, setIsPossessed] = useState(false);
    const [, setHistory] = useState<string[]>([]);

    // Decay logic
    useEffect(() => {
        if (isPossessed) return;

        const decayInterval = setInterval(() => {
            setSanity(prev => {
                const drop = Math.random() * 0.5 + 0.1; // Slow random decay
                const newValue = Math.max(0, prev - drop);

                if (newValue <= 0) {
                    setIsPossessed(true); // Trigger possession
                }
                return newValue;
            });
        }, 500);

        return () => clearInterval(decayInterval);
    }, [isPossessed]);

    // Possessed Mode Timer
    useEffect(() => {
        if (isPossessed) {
            // Auto-recover after 30 seconds if user fails to act? 
            // Or maybe just stay possessed until key input.
            // Requirement said "For 30 seconds, the UI becomes hostile." 
            // implying it might pass, or it's a phase.
            // Let's make it so you MUST fix it, or it eventually resets to 50% after 30s.
            const timeout = setTimeout(() => {
                recoverSystem();
            }, 30000);
            return () => clearTimeout(timeout);
        }
    }, [isPossessed]);

    const recoverSystem = useCallback(() => {
        setIsPossessed(false);
        setSanity(100);
        // Play recovery sound effect here if we had audio context props
    }, []);

    // Konami Code / Secret Input Handler
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            setHistory(prev => {
                const newHistory = [...prev, e.key];
                if (newHistory.length > 10) newHistory.shift();

                // Check for sequence: ArrowUp, ArrowUp, ArrowDown, ArrowDown... 
                // Let's make it simpler: "H E L P"
                const str = newHistory.join('').toUpperCase();
                if (str.includes("HELP")) {
                    recoverSystem();
                    return [];
                }
                return newHistory;
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [recoverSystem]);

    return {
        sanity,
        isPossessed,
        recoverSystem
    };
};
