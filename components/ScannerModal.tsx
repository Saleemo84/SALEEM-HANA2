
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Modal from './Modal';
import type { Patient } from '../types';

declare const jsQR: any;

interface ScannerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onScanSuccess: (patient: Patient) => void;
    showToast: (message: string, type?: 'success' | 'error') => void;
}

const ScannerModal: React.FC<ScannerModalProps> = ({ isOpen, onClose, onScanSuccess, showToast }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scanResult, setScanResult] = useState<Patient | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const streamRef = useRef<MediaStream | null>(null);

    const stopScanner = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsScanning(false);
    }, []);

    const startScanner = useCallback(async () => {
        if (isScanning || !isOpen) return;
        setIsScanning(true);
        setScanResult(null);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            showToast("Error accessing camera. Please check permissions.", 'error');
            setIsScanning(false);
        }
    }, [isScanning, isOpen, showToast]);

    useEffect(() => {
        let animationFrameId: number;

        const tick = () => {
            if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && canvasRef.current) {
                const video = videoRef.current;
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');

                canvas.height = video.videoHeight;
                canvas.width = video.videoWidth;
                if (ctx) {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height, {
                        inversionAttempts: "dontInvert",
                    });

                    if (code) {
                        try {
                            const parsedData: Patient = JSON.parse(code.data);
                            if (parsedData.id && parsedData.name && parsedData.code) {
                                setScanResult(parsedData);
                                stopScanner();
                            }
                        } catch (e) {
                             // Ignore non-json QR codes quietly
                        }
                    }
                }
            }
            if(streamRef.current){
                animationFrameId = requestAnimationFrame(tick);
            }
        };

        if (isScanning && isOpen) {
            animationFrameId = requestAnimationFrame(tick);
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [isScanning, isOpen, stopScanner]);

    useEffect(() => {
        if (!isOpen) {
            stopScanner();
        }
    }, [isOpen, stopScanner]);


    const handleRestore = () => {
        if (scanResult) {
            onScanSuccess(scanResult);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Scan Patient Card">
            <div className="flex flex-col items-center">
                <div className="w-full max-w-sm rounded-lg overflow-hidden shadow-md relative bg-gray-900 mb-4">
                    <video ref={videoRef} className={`w-full transition-opacity duration-300 ${isScanning ? 'opacity-100' : 'opacity-0 h-0'}`} playsInline />
                    <canvas ref={canvasRef} className="hidden" />
                    {isScanning && (
                         <div className="absolute inset-0 border-4 border-primary pointer-events-none">
                            <div className="absolute h-1 w-full bg-primary animate-[scan_2s_infinite_linear] shadow-[0_0_10px_theme(colors.primary)]"></div>
                         </div>
                    )}
                </div>

                {!isScanning && !scanResult && (
                    <button onClick={startScanner} className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-sm">
                        <i className="fas fa-play"></i> Start Scanner
                    </button>
                )}
                {isScanning && <p className="text-gray-600 animate-pulse"><i className="fas fa-sync-alt fa-spin mr-2"></i>Scanning...</p>}
                
                {scanResult && (
                    <div className="w-full text-center p-4 bg-gray-100 rounded-lg">
                        <h3 className="font-semibold text-lg mb-2">Patient Found!</h3>
                        <p><span className="font-medium">Name:</span> {scanResult.name}</p>
                        <p><span className="font-medium">Code:</span> {scanResult.code}</p>
                        <button onClick={handleRestore} className="w-full mt-4 flex justify-center items-center gap-2 px-4 py-3 bg-success text-white font-medium rounded-lg hover:bg-green-600 transition-colors shadow-sm">
                            <i className="fas fa-history"></i> Restore Patient Data
                        </button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ScannerModal;
