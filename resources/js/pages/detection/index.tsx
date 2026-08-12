import AppLayout from '@/layouts/app-layout';
import { index, detect } from '@/actions/App/Http/Controllers/DetectionController';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { AlertCircle, Camera, CloudUpload, Loader2, Trash2 } from 'lucide-react';
import { useCallback, useState, useRef, type DragEvent, type ChangeEvent } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DetectionIndexProps {
    isApiHealthy: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Deteksi Penyakit',
        href: index().url,
    },
];

export default function DetectionIndex({ isApiHealthy }: DetectionIndexProps) {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ✅ CAMERA STATE
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    }, []);

    const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    }, []);

    const handleFileSelect = (file: File) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setError('Format tidak didukung');
            return;
        }

        setSelectedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setPreviewUrl(null);
    };

    // ✅ OPEN CAMERA
    const openCamera = async () => {
        setIsCameraOpen(true);

        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
        });

        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    };

    // ✅ CAPTURE FOTO
    const capturePhoto = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        if (canvas && video) {
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            context?.drawImage(video, 0, 0);

            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], "camera.jpg", {
                        type: "image/jpeg",
                    });

                    setSelectedImage(file);
                    setPreviewUrl(URL.createObjectURL(file));
                    setIsCameraOpen(false);
                }
            }, 'image/jpeg');
        }
    };

    const handleDetect = () => {
        if (!selectedImage) return;

        setIsLoading(true);

        router.post(
            detect().url,
            { image: selectedImage },
            {
                forceFormData: true,
                onFinish: () => setIsLoading(false),
            }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Deteksi Penyakit" />

            <div className="p-6 flex flex-col gap-6">

                <h1 className="text-2xl font-bold text-center">
                    Deteksi Penyakit Daun Padi
                </h1>

                {/* Upload Area */}
                {!selectedImage ? (
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={cn(
                            'border-2 border-dashed p-8 text-center rounded-xl',
                            isDragging ? 'border-green-500' : 'border-gray-300'
                        )}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="fileInput"
                        />

                        <label htmlFor="fileInput" className="cursor-pointer">
                            <CloudUpload className="mx-auto mb-3" />
                            <p>Upload Gambar atau Drag & Drop</p>
                        </label>

                        {/* ✅ TOMBOL KAMERA */}
                        <div className="mt-4">
                            <Button onClick={openCamera}>
                                <Camera className="mr-2" />
                                Gunakan Kamera
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <img
                            src={previewUrl!}
                            className="mx-auto rounded-lg max-h-64"
                        />
                        <Button onClick={handleRemoveImage} className="mt-3">
                            <Trash2 className="mr-2" />
                            Hapus
                        </Button>
                    </div>
                )}

                {/* ✅ CAMERA VIEW */}
                {isCameraOpen && (
                    <div className="text-center">
                        <video
                            ref={videoRef}
                            autoPlay
                            className="mx-auto rounded-lg max-h-64"
                        />
                        <canvas ref={canvasRef} className="hidden"></canvas>

                        <Button onClick={capturePhoto} className="mt-3">
                            Ambil Foto
                        </Button>
                    </div>
                )}

                {/* BUTTON DETEKSI */}
                <div className="text-center">
                    <Button
                        onClick={handleDetect}
                        disabled={!selectedImage || isLoading || !isApiHealthy}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin mr-2" />
                                Mendeteksi...
                            </>
                        ) : (
                            <>
                                <Camera className="mr-2" />
                                Deteksi
                            </>
                        )}
                    </Button>
                </div>

                {/* ERROR */}
                {error && (
                    <div className="text-red-500 text-center">
                        {error}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}