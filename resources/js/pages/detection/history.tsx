import AppLayout from '@/layouts/app-layout';
import { index as detectionIndex, history } from '@/actions/App/Http/Controllers/DetectionController';
import { show as diseaseShow } from '@/actions/App/Http/Controllers/DiseaseController';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calendar, ChevronLeft, ChevronRight, Eye, ImageIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface Disease {
    id: number;
    name: string;
    slug: string;
}

interface DetectionHistoryItem {
    id: number;
    predicted_disease: string;
    confidence: number;
    original_filename: string;
    image_path: string;
    created_at: string;
    disease: Disease | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedHistories {
    data: DetectionHistoryItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

interface DetectionHistoryProps {
    histories: PaginatedHistories;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Deteksi Penyakit',
        href: detectionIndex().url,
    },
    {
        title: 'Riwayat',
        href: history().url,
    },
];

export default function DetectionHistory({ histories }: DetectionHistoryProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Deteksi" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Riwayat Deteksi
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            {histories.total} deteksi telah dilakukan
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={detectionIndex().url}>
                            + Deteksi Baru
                        </Link>
                    </Button>
                </div>

                {/* History Grid */}
                {histories.data.length > 0 ? (
                    <>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {histories.data.map((item) => (
                                <div
                                    key={item.id}
                                    className="group overflow-hidden rounded-xl border border-sidebar-border bg-card transition-shadow hover:shadow-md"
                                >
                                    {/* Image Thumbnail */}
                                    <div className="relative aspect-video overflow-hidden bg-muted">
                                        <img
                                            src={`/storage/${item.image_path}`}
                                            alt={item.original_filename}
                                            className="size-full object-cover transition-transform group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                                            <Link
                                                href={`/detection/result/${item.id}`}
                                                className="rounded-full bg-white p-2 shadow-lg"
                                            >
                                                <Eye className="size-5 text-gray-900" />
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="font-semibold text-foreground">
                                                    {item.predicted_disease}
                                                </p>
                                                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Calendar className="size-3" />
                                                    {formatDate(item.created_at)}
                                                </div>
                                            </div>
                                            <span
                                                className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${
                                                    item.confidence >= 0.8
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                                                        : item.confidence >= 0.5
                                                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                                                          : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                                                }`}
                                            >
                                                {Math.round(item.confidence * 100)}%
                                            </span>
                                        </div>

                                        {item.disease && (
                                            <Link
                                                href={diseaseShow(item.disease.slug).url}
                                                className="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                                            >
                                                Lihat info penyakit →
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {histories.last_page > 1 && (
                            <div className="flex items-center justify-center gap-2">
                                {histories.links.map((link, index) => {
                                    if (index === 0) {
                                        return (
                                            <Button
                                                key="prev"
                                                variant="outline"
                                                size="icon"
                                                disabled={!link.url}
                                                asChild={!!link.url}
                                            >
                                                {link.url ? (
                                                    <Link href={link.url}>
                                                        <ChevronLeft className="size-4" />
                                                    </Link>
                                                ) : (
                                                    <span>
                                                        <ChevronLeft className="size-4" />
                                                    </span>
                                                )}
                                            </Button>
                                        );
                                    }
                                    if (index === histories.links.length - 1) {
                                        return (
                                            <Button
                                                key="next"
                                                variant="outline"
                                                size="icon"
                                                disabled={!link.url}
                                                asChild={!!link.url}
                                            >
                                                {link.url ? (
                                                    <Link href={link.url}>
                                                        <ChevronRight className="size-4" />
                                                    </Link>
                                                ) : (
                                                    <span>
                                                        <ChevronRight className="size-4" />
                                                    </span>
                                                )}
                                            </Button>
                                        );
                                    }
                                    return (
                                        <Button
                                            key={link.label}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="icon"
                                            disabled={!link.url}
                                            asChild={!!link.url && !link.active}
                                        >
                                            {link.url && !link.active ? (
                                                <Link href={link.url}>{link.label}</Link>
                                            ) : (
                                                <span>{link.label}</span>
                                            )}
                                        </Button>
                                    );
                                })}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-sidebar-border p-12">
                        <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                            <ImageIcon className="size-8 text-muted-foreground" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-semibold text-foreground">Belum ada riwayat</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Mulai deteksi penyakit tanaman padi Anda
                            </p>
                        </div>
                        <Button asChild>
                            <Link href={detectionIndex().url}>Mulai Deteksi</Link>
                        </Button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
