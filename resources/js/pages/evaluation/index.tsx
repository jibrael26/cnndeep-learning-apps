import AppLayout from '@/layouts/app-layout';
import { index } from '@/actions/App/Http/Controllers/ModelEvaluationController';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Activity, AlertCircle, BarChart3, CheckCircle2, Cpu, TrendingUp } from 'lucide-react';

interface TrainingHistory {
    accuracy: number[];
    val_accuracy: number[];
    loss: number[];
    val_loss: number[];
}

interface Metrics {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
}

interface EvaluationIndexProps {
    isApiHealthy: boolean;
    modelLoaded: boolean;
    diseaseClasses: string[];
    metrics: Metrics | null;
    trainingHistory: TrainingHistory | null;
    confusionMatrix: number[][] | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Evaluasi Model',
        href: index().url,
    },
];

export default function EvaluationIndex({
    isApiHealthy,
    modelLoaded,
    diseaseClasses,
    metrics,
    trainingHistory,
}: EvaluationIndexProps) {
    const metricCards = metrics
        ? [
              {
                  title: 'Accuracy',
                  value: metrics.accuracy,
                  icon: CheckCircle2,
                  color: 'text-green-600 dark:text-green-400',
                  bgColor: 'bg-green-100 dark:bg-green-900/30',
              },
              {
                  title: 'Precision',
                  value: metrics.precision,
                  icon: BarChart3,
                  color: 'text-blue-600 dark:text-blue-400',
                  bgColor: 'bg-blue-100 dark:bg-blue-900/30',
              },
              {
                  title: 'Recall',
                  value: metrics.recall,
                  icon: TrendingUp,
                  color: 'text-amber-600 dark:text-amber-400',
                  bgColor: 'bg-amber-100 dark:bg-amber-900/30',
              },
              {
                  title: 'F1 Score',
                  value: metrics.f1_score,
                  icon: Activity,
                  color: 'text-purple-600 dark:text-purple-400',
                  bgColor: 'bg-purple-100 dark:bg-purple-900/30',
              },
          ]
        : [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Evaluasi Model CNN" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        Evaluasi Model CNN
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        Metrics dan performa model klasifikasi penyakit padi
                    </p>
                </div>

                {/* Status Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {/* API Status */}
                    <div className="rounded-xl border border-sidebar-border bg-card p-4">
                        <div className="flex items-center gap-3">
                            <div
                                className={`rounded-lg p-2 ${
                                    isApiHealthy
                                        ? 'bg-green-100 dark:bg-green-900/30'
                                        : 'bg-red-100 dark:bg-red-900/30'
                                }`}
                            >
                                <Cpu
                                    className={`size-5 ${
                                        isApiHealthy
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-red-600 dark:text-red-400'
                                    }`}
                                />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Status API</p>
                                <p
                                    className={`font-semibold ${
                                        isApiHealthy ? 'text-green-600' : 'text-red-600'
                                    }`}
                                >
                                    {isApiHealthy ? 'Online' : 'Offline'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Model Status */}
                    <div className="rounded-xl border border-sidebar-border bg-card p-4">
                        <div className="flex items-center gap-3">
                            <div
                                className={`rounded-lg p-2 ${
                                    modelLoaded
                                        ? 'bg-green-100 dark:bg-green-900/30'
                                        : 'bg-amber-100 dark:bg-amber-900/30'
                                }`}
                            >
                                <Activity
                                    className={`size-5 ${
                                        modelLoaded
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-amber-600 dark:text-amber-400'
                                    }`}
                                />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Model</p>
                                <p
                                    className={`font-semibold ${
                                        modelLoaded ? 'text-green-600' : 'text-amber-600'
                                    }`}
                                >
                                    {modelLoaded ? 'Loaded' : 'Not Loaded'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Classes Count */}
                    <div className="rounded-xl border border-sidebar-border bg-card p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-primary/10 p-2">
                                <BarChart3 className="size-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Jumlah Kelas</p>
                                <p className="font-semibold text-foreground">
                                    {diseaseClasses.length} Penyakit
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Metrics */}
                {metrics ? (
                    <>
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">
                                Performance Metrics
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Hasil evaluasi model pada data validasi
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {metricCards.map((metric) => (
                                <div
                                    key={metric.title}
                                    className="rounded-xl border border-sidebar-border bg-card p-6"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className={`rounded-lg p-2 ${metric.bgColor}`}>
                                            <metric.icon className={`size-5 ${metric.color}`} />
                                        </div>
                                        <span className="text-2xl font-bold text-foreground">
                                            {metric.value}%
                                        </span>
                                    </div>
                                    <p className="mt-3 text-sm font-medium text-muted-foreground">
                                        {metric.title}
                                    </p>
                                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${
                                                metric.value >= 80
                                                    ? 'bg-green-500'
                                                    : metric.value >= 60
                                                      ? 'bg-amber-500'
                                                      : 'bg-red-500'
                                            }`}
                                            style={{ width: `${metric.value}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-sidebar-border p-12">
                        <div className="flex size-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                            <AlertCircle className="size-8 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-semibold text-foreground">
                                Metrics tidak tersedia
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Model belum di-train atau API sedang tidak tersedia
                            </p>
                        </div>
                    </div>
                )}

                {/* Disease Classes */}
                {diseaseClasses.length > 0 && (
                    <>
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">
                                Kelas Penyakit
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Daftar penyakit yang dapat dideteksi oleh model
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {diseaseClasses.map((disease, index) => (
                                <span
                                    key={disease}
                                    className="inline-flex items-center gap-2 rounded-full border border-sidebar-border bg-card px-4 py-2 text-sm"
                                >
                                    <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                                        {index + 1}
                                    </span>
                                    {disease}
                                </span>
                            ))}
                        </div>
                    </>
                )}

                {/* Training History Chart Placeholder */}
                {trainingHistory && (
                    <>
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">
                                Training History
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Grafik akurasi dan loss selama training
                            </p>
                        </div>

                        <div className="grid gap-4 lg:grid-cols-2">
                            {/* Accuracy Chart */}
                            <div className="rounded-xl border border-sidebar-border bg-card p-6">
                                <h3 className="font-medium text-foreground">Accuracy</h3>
                                <div className="mt-4 flex h-48 items-end gap-1">
                                    {trainingHistory.accuracy.slice(-20).map((acc, i) => (
                                        <div
                                            key={i}
                                            className="flex-1 rounded-t bg-primary/80 transition-all hover:bg-primary"
                                            style={{ height: `${acc * 100}%` }}
                                            title={`Epoch ${i + 1}: ${(acc * 100).toFixed(1)}%`}
                                        />
                                    ))}
                                </div>
                                <p className="mt-2 text-center text-xs text-muted-foreground">
                                    Last 20 epochs
                                </p>
                            </div>

                            {/* Loss Chart */}
                            <div className="rounded-xl border border-sidebar-border bg-card p-6">
                                <h3 className="font-medium text-foreground">Loss</h3>
                                <div className="mt-4 flex h-48 items-end gap-1">
                                    {trainingHistory.loss.slice(-20).map((loss, i) => {
                                        const maxLoss = Math.max(...trainingHistory.loss);
                                        const height = maxLoss > 0 ? (loss / maxLoss) * 100 : 0;
                                        return (
                                            <div
                                                key={i}
                                                className="flex-1 rounded-t bg-amber-500/80 transition-all hover:bg-amber-500"
                                                style={{ height: `${height}%` }}
                                                title={`Epoch ${i + 1}: ${loss.toFixed(4)}`}
                                            />
                                        );
                                    })}
                                </div>
                                <p className="mt-2 text-center text-xs text-muted-foreground">
                                    Last 20 epochs
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AppLayout>
    );
}
