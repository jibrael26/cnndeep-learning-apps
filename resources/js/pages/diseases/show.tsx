import AppLayout from '@/layouts/app-layout';
import { index as detectionIndex } from '@/actions/App/Http/Controllers/DetectionController';
import { index as diseasesIndex } from '@/actions/App/Http/Controllers/DiseaseController';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowLeft,
    Camera,
    CheckCircle2,
    HeartPulse,
    Leaf,
    Shield,
    Pill,
    ShieldCheck,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

interface Disease {
    id: number;
    name: string;
    name_id: string;
    name_scientific?: string | null;
    slug: string;
    description: string;
    symptoms: string;
    causes?: string;
    treatment: string;
    prevention?: string;
    color?: string;
    image_path?: string | null;
}

interface DiseaseShowProps {
    disease: Disease;
}

const colorMap: Record<string, { bg: string; border: string; text: string; lightBg: string }> = {
    red: { bg: 'bg-red-500', border: 'border-red-200', text: 'text-red-700', lightBg: 'bg-red-50' },
    amber: { bg: 'bg-amber-500', border: 'border-amber-200', text: 'text-amber-700', lightBg: 'bg-amber-50' },
    orange: { bg: 'bg-orange-500', border: 'border-orange-200', text: 'text-orange-700', lightBg: 'bg-orange-50' },
    yellow: { bg: 'bg-yellow-500', border: 'border-yellow-200', text: 'text-yellow-700', lightBg: 'bg-yellow-50' },
    emerald: { bg: 'bg-emerald-500', border: 'border-emerald-200', text: 'text-emerald-700', lightBg: 'bg-emerald-50' },
    rose: { bg: 'bg-rose-500', border: 'border-rose-200', text: 'text-rose-700', lightBg: 'bg-rose-50' },
    gray: { bg: 'bg-gray-500', border: 'border-gray-200', text: 'text-gray-700', lightBg: 'bg-gray-50' },
};

export default function DiseaseShow({ disease }: DiseaseShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Informasi Penyakit',
            href: diseasesIndex().url,
        },
        {
            title: disease.name,
            href: `/diseases/${disease.slug}`,
        },
    ];

    const isHealthy = disease.name.toLowerCase() === 'healthy';
    const colors = colorMap[disease.color || 'gray'] || colorMap.gray;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={disease.name} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Back Button */}
                <div>
                    <Button variant="ghost" size="sm" asChild className="text-gray-600 hover:text-gray-900">
                        <Link href={diseasesIndex().url}>
                            <ArrowLeft className="size-4" />
                            Kembali ke Daftar
                        </Link>
                    </Button>
                </div>

                {/* Header Card */}
                <div className={`rounded-2xl ${colors.lightBg} ${colors.border} border p-6`}>
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                        {/* Icon */}
                        <div className={`flex size-20 shrink-0 items-center justify-center rounded-2xl ${colors.bg}`}>
                            {isHealthy ? (
                                <HeartPulse className="size-10 text-white" />
                            ) : (
                                <Leaf className="size-10 text-white" />
                            )}
                        </div>

                        {/* Title & Description */}
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {disease.name}
                                </h1>
                                <span className={`rounded-full px-3 py-1 text-sm font-medium ${colors.lightBg} ${colors.text}`}>
                                    {disease.name_id}
                                </span>
                            </div>
                            {disease.name_scientific && (
                                <p className="mt-1 text-sm italic text-gray-500">{disease.name_scientific}</p>
                            )}
                            <p className="mt-4 leading-relaxed text-gray-700">
                                {disease.description}
                            </p>

                            {!isHealthy && (
                                <Button className="mt-6 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700" asChild>
                                    <Link href={detectionIndex().url}>
                                        <Camera className="size-4" />
                                        Deteksi Penyakit Ini
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Symptoms */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="rounded-lg bg-amber-100 p-2">
                                <AlertTriangle className="size-5 text-amber-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                {isHealthy ? 'Karakteristik' : 'Gejala'}
                            </h2>
                        </div>
                        {disease.symptoms ? (
                            <p className="text-gray-600 leading-relaxed">{disease.symptoms}</p>
                        ) : (
                            <p className="text-gray-500">Informasi gejala belum tersedia.</p>
                        )}
                    </div>

                    {/* Causes */}
                    {disease.causes && (
                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="rounded-lg bg-red-100 p-2">
                                    <AlertTriangle className="size-5 text-red-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Penyebab</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed">{disease.causes}</p>
                        </div>
                    )}

                    {/* Treatment */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="rounded-lg bg-blue-100 p-2">
                                <Pill className="size-5 text-blue-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                {isHealthy ? 'Cara Mempertahankan' : 'Penanganan'}
                            </h2>
                        </div>
                        {disease.treatment ? (
                            <p className="text-gray-600 leading-relaxed">{disease.treatment}</p>
                        ) : (
                            <p className="text-gray-500">Informasi penanganan belum tersedia.</p>
                        )}
                    </div>

                    {/* Prevention */}
                    {disease.prevention && (
                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="rounded-lg bg-emerald-100 p-2">
                                    <ShieldCheck className="size-5 text-emerald-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Pencegahan</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed">{disease.prevention}</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

