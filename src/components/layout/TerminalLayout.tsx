import { type FC, type ReactNode } from 'react';

interface TerminalLayoutProps {
    children: ReactNode;
}

export const TerminalLayout: FC<TerminalLayoutProps> = ({ children }) => {
    return (
        <div className="screen-curve crt-flicker relative w-full h-full overflow-hidden bg-black text-green-500">
            <div className="scanlines"></div>

            {/* Outer vignette for screen curve depth */}
            <div className="absolute inset-0 pointer-events-none z-40 bg-[radial-gradient(circle,rgba(0,0,0,0)_60%,rgba(0,0,0,0.6)_100%)]"></div>

            {/* Main Content Container */}
            <main className="relative z-30 w-full h-full p-6 flex flex-col pointer-events-auto">
                {children}
            </main>
        </div>
    );
};
