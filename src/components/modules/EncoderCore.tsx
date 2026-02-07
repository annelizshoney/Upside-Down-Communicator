import { type FC, useEffect, useRef } from 'react';

export const EncoderCore: FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let frameId: number;
        const cols = 40;
        const rows = 20;
        const charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&@$";

        const draw = () => {
            // Set canvas dimensions to match display size
            if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
                canvas.width = canvas.offsetWidth;
                canvas.height = canvas.offsetHeight;
            }

            ctx.fillStyle = "rgba(0, 5, 0, 0.1)"; // Fade effect
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const w = canvas.width / cols;
            const h = canvas.height / rows;

            ctx.font = `${Math.floor(h * 0.8)}px VT323`;

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    if (Math.random() > 0.95) {
                        const char = charSet[Math.floor(Math.random() * charSet.length)];
                        const x = i * w;
                        const y = j * h + h;

                        // Random color variation for "decoding" effect
                        const isAmber = Math.random() > 0.98;
                        ctx.fillStyle = isAmber ? "#ffb000" : "#33ff00";
                        ctx.shadowBlur = isAmber ? 8 : 4;
                        ctx.shadowColor = ctx.fillStyle;

                        ctx.fillText(char, x, y);
                        ctx.shadowBlur = 0;
                    }
                }
            }

            // Draw a scanning line
            const scanY = (Date.now() / 10) % canvas.height;
            ctx.strokeStyle = "rgba(51, 255, 0, 0.3)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, scanY);
            ctx.lineTo(canvas.width, scanY);
            ctx.stroke();

            frameId = requestAnimationFrame(draw);
        };

        frameId = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(frameId);
    }, []);

    return (
        <div className="flex-1 border-2 border-green-700 bg-black relative flex flex-col p-1 overflow-hidden">
            <div className="absolute top-0 left-0 bg-green-900 text-black text-xs px-2 py-0.5 z-10">
                ENCODER_OUT // LIVE
            </div>
            <canvas ref={canvasRef} className="w-full h-full opacity-80" />
            <div className="absolute bottom-2 left-2 text-xs text-green-600 animate-pulse">
                INTERPRETING PATTERN...
            </div>
        </div>
    );
};
