import { type FC } from 'react';

interface SignalInputProps {
    msg: string;
    setMsg: (msg: string) => void;
    disabled?: boolean;
}

export const SignalInput: FC<SignalInputProps> = ({ msg, setMsg, disabled }) => {
    return (
        <div className="flex flex-col h-full border-2 border-green-800 bg-black/40 p-4 relative overflow-hidden group">
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-green-500"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-green-500"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-green-500"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-green-500"></div>

            <label className="block text-green-500 text-sm uppercase tracking-widest mb-2 border-b border-green-900 pb-1">
                Operator Message Input
            </label>

            <textarea
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                disabled={disabled}
                className="flex-1 bg-transparent border-0 resize-none outline-none font-mono text-xl text-green-400 placeholder-green-900/50 uppercase tracking-wider p-2 focus:bg-green-900/10 transition-colors"
                placeholder="ENTER TRANSMISSION..."
                spellCheck={false}
                autoFocus
            />

            <div className="mt-2 text-xs text-red-700 uppercase tracking-tight text-center animate-pulse">
                Plain text will not survive transmission
            </div>

            {/* Blinking cursor simulation if needed, though native cursor might suffice with this font. 
          Let's add a visual indicator of 'ready' state. */}
            <div className="absolute bottom-1 right-2 w-2 h-2 bg-green-500 animate-pulse"></div>
        </div>
    );
};
