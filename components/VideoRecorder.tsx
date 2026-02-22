// components/VideoRecorder.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Video, Square, RotateCcw, Play, Loader2, CheckCircle } from 'lucide-react';

interface VideoRecorderProps {
    fullName: string;
    deceasedName: string;
    onComplete: (blob: Blob | null) => void;
}

export default function VideoRecorder({ fullName, deceasedName, onComplete }: VideoRecorderProps) {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const [countdown, setCountdown] = useState(10);
    const [error, setError] = useState<string | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Get current date for the script
    const today = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric' 
    });

    const startCamera = async () => {
        try {
            setError(null);
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'user' }, 
                audio: true 
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Camera error:", err);
            setError("Could not access camera. Please check permissions.");
        }
    };

    // Auto-start camera when component mounts
    useEffect(() => {
        startCamera();
        return () => {
            if (stream) stream.getTracks().forEach(track => track.stop());
        };
    }, []);

    const startRecording = () => {
        if (!stream) return;

        chunksRef.current = [];
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'video/mp4' });
            setRecordedBlob(blob);
            onComplete(blob);
        };

        recorder.start();
        setIsRecording(true);
        setCountdown(10);

        // Auto-stop after 10 seconds
        timerRef.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    stopRecording();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const resetRecording = () => {
        setRecordedBlob(null);
        onComplete(null);
        setCountdown(10);
        startCamera();
    };

    return (
        <div className="space-y-6">
            {/* The Script Prompt - CRITICAL for legal validity */}
            <div className="bg-charcoal text-ivory p-4 rounded-xl text-center border-2 border-mist/40">
                <p className="text-[10px] uppercase tracking-widest opacity-50 mb-2">Read this aloud:</p>
                <p className="font-serif italic text-lg leading-relaxed">
                    "I am <span className="text-mist not-italic font-bold">{fullName || '[Name]'}</span>. I authorize the creation of this archive for <span className="text-mist not-italic font-bold">{deceasedName}</span> on <span className="text-mist not-italic font-bold">{today}</span>. This is my video signature."
                </p>
            </div>

            {/* Video Preview */}
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden border-2 border-sand/40 shadow-inner">
                {!recordedBlob ? (
                    <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover mirror" />
                ) : (
                    <video src={URL.createObjectURL(recordedBlob)} controls className="w-full h-full object-cover" />
                )}

                {/* Status Overlays */}
                {isRecording && (
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full animate-pulse text-xs font-bold">
                        <div className="w-2 h-2 bg-white rounded-full" />
                        REC {countdown}s
                    </div>
                )}
                
                {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-6 text-center">
                        <p className="text-white text-sm">{error}</p>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
                {!recordedBlob ? (
                    <button
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
                            isRecording 
                            ? 'bg-red-600 text-white hover:bg-red-700' 
                            : 'bg-mist text-ivory hover:shadow-lg scale-105'
                        }`}
                    >
                        {isRecording ? <Square size={18} /> : <Video size={18} />}
                        {isRecording ? 'Stop Recording' : 'Start 10s Recording'}
                    </button>
                ) : (
                    <button
                        onClick={resetRecording}
                        className="px-6 py-3 bg-white border-2 border-sand/40 text-charcoal rounded-xl font-medium hover:bg-sand/10 transition-all flex items-center gap-2"
                    >
                        <RotateCcw size={18} />
                        Re-record Video
                    </button>
                )}
            </div>
        </div>
    );
}