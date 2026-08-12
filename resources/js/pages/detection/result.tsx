import AppLayout from '@/layouts/app-layout';
import { index as detectionIndex, history as historyRoute } from '@/actions/App/Http/Controllers/DetectionController';
import { show as diseaseShow } from '@/actions/App/Http/Controllers/DiseaseController';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, CheckCircle2, Info, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface Disease {
    id: number;
    name: string;
    slug: string;
    description: string;
}

interface DetectionHistory {
    id: number;
    predicted_disease: string;
    confidence: number;
    all_predictions: Record<string, number>;
    original_filename: string;
    created_at: string;
    disease: Disease | null;
}

interface DetectionResultProps {
    history: DetectionHistory;
    imageUrl: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Deteksi Penyakit',
        href: detectionIndex().url,
    },
    {
        title: 'Hasil Deteksi',
        href: '#',
    },
];

export default function DetectionResult({ history, imageUrl }: DetectionResultProps) {
    const confidencePercent = Math.round(history.confidence * 100);
    const isHealthy = history.predicted_disease.toLowerCase() === 'healthy';

    // Sort predictions by confidence
    const sortedPredictions = Object.entries(history.all_predictions)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Hasil Deteksi" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Result Header */}
                <div className="text-center">
                    <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
                        <CheckCircle2 className="size-8 text-primary" />
                    </div>
                    <h1 className="mt-4 text-2xl font-bold text-foreground">
                        Hasil Deteksi
                    </h1>
                </div>

                <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-2">
                    {/* Image Preview */}
                    <div className="overflow-hidden rounded-2xl border border-sidebar-border bg-card">
                        <div className="aspect-video w-full overflow-hidden bg-muted">
                            <img
                                src={imageUrl}
                                alt={history.original_filename}
                                className="size-full object-contain"
                            />
                        </div>
                        <div className="border-t border-sidebar-border p-4">
                            <p className="truncate text-sm text-muted-foreground">
                                {history.original_filename}
                            </p>
                        </div>
                    </div>

                    {/* Prediction Result */}
                    <div className="flex flex-col gap-4">
                        {/* Main Prediction */}
                        <div className="rounded-2xl border border-sidebar-border bg-card p-6">
                            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                                Penyakit Terdeteksi
                            </h2>
                            <p
                                className={`mt-2 text-2xl font-bold ${
                                    isHealthy ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'
                                }`}
                            >
                                {history.predicted_disease}
                            </p>

                            {/* Confidence Bar */}
                            <div className="mt-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Tingkat Kepercayaan</span>
                                    <span className="font-semibold text-foreground">{confidencePercent}%</span>
                                </div>
                                <div className="mt-2 h-3 overflow-hidden rounded-full bg-secondary">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${
                                            confidencePercent >= 80
                                                ? 'bg-green-500'
                                                : confidencePercent >= 50
                                                  ? 'bg-amber-500'
                                                  : 'bg-red-500'
                                        }`}
                                        style={{ width: `${confidencePercent}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* All Predictions */}
                        <div className="rounded-2xl border border-sidebar-border bg-card p-6">
                            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                                Semua Prediksi
                            </h2>
                            <div className="mt-4 space-y-3">
                                {sortedPredictions.map(([disease, confidence], index) => (
                                    <div key={disease} className="flex items-center gap-3">
                                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium">
                                            {index + 1}
                                        </span>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className={index === 0 ? 'font-medium text-foreground' : 'text-muted-foreground'}>
                                                    {disease}
                                                </span>
                                                <span className={index === 0 ? 'font-semibold' : 'text-muted-foreground'}>
                                                    {Math.round(confidence)}%
                                                </span>
                                            </div>
                                            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                                                <div
                                                    className={`h-full rounded-full ${index === 0 ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                                                    style={{ width: `${confidence}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Disease Info Link */}
                        {history.disease && (
                            <Link
                                href={diseaseShow(history.disease.slug).url}
                                className="flex items-center justify-between rounded-2xl border border-sidebar-border bg-card p-4 transition-colors hover:bg-accent"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                                        <Info className="size-5 text-primary" />
                                    </div>
                                    <span className="font-medium">Lihat Informasi Penyakit</span>
                                </div>
                                <ArrowRight className="size-5 text-muted-foreground" />
                            </Link>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="mx-auto flex flex-wrap justify-center gap-3">
                    <Button variant="outline" asChild>
                        <Link href={historyRoute().url}>
                            <ArrowLeft className="size-4" />
                            Riwayat Deteksi
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href={detectionIndex().url}>
                            <RefreshCw className="size-4" />
                            Deteksi Baru
                        </Link>
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
