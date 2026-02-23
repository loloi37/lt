// components/SignaturePad.tsx
'use client';

import { useRef, useState, useEffect } from 'react';
import { Eraser, PenTool } from 'lucide-react';

interface SignaturePadProps {
    onEnd: (dataUrl: string | null) => void;
}

export default function SignaturePad({ onEnd }: SignaturePadProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);

    // Initialize Canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set high resolution for sharpness
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        ctx.scale(ratio, ratio);

        // Style
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#5a6b78'; // Charcoal color
    }, []);

    const getCoords = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();

        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        const coords = getCoords(e);
        ctx.beginPath();
        ctx.moveTo(coords.x, coords.y);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        const coords = getCoords(e);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();

        if (!hasSignature) setHasSignature(true);
    };

    const endDrawing = () => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        if (canvas && hasSignature) {
            onEnd(canvas.toDataURL('image/png'));
        }
    };

    const clear = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSignature(false);
        onEnd(null);
    };

    return (
        <div className="w-full">
            <div className="relative border-2 border-sand/40 rounded-xl bg-white overflow-hidden shadow-inner touch-none">
                <canvas
                    ref={canvasRef}
                    className="w-full h-48 cursor-crosshair block"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={endDrawing}
                    onMouseLeave={endDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={endDrawing}
                />

                {!hasSignature && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-charcoal/20">
                        <div className="flex items-center gap-2 text-sm font-handwriting">
                            <PenTool size={16} /> Sign here
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-end mt-2">
                <button
                    onClick={clear}
                    className="text-xs flex items-center gap-1 text-charcoal/50 hover:text-stone transition-colors"
                >
                    <Eraser size={14} /> Clear Signature
                </button>
            </div>
        </div>
    );
}