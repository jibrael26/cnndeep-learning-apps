import AppLayout from '@/layouts/app-layout';
import { index } from '@/actions/App/Http/Controllers/DiseaseController';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { AlertCircle, BookOpen, ChevronRight, Leaf, Search } from 'lucide-react';
import { useState } from 'react';

import { Input } from '@/components/ui/input';

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

interface DiseasesIndexProps {
    diseases: Disease[];
    apiConnected: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Informasi Penyakit',
        href: index().url,
    },
];

const colorMap: Record<string, { bg: string; border: string; text: string; dot: string }> = {
    red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', dot: 'bg-red-500' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', dot: 'bg-orange-500' },
    yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', dot: 'bg-yellow-500' },
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    rose: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', dot: 'bg-rose-500' },
    gray: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', dot: 'bg-gray-500' },
};

export default function DiseasesIndex({ diseases, apiConnected }: DiseasesIndexProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredDiseases = diseases.filter(
        (disease) =>
            disease.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            disease.name_id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Informasi Penyakit Padi" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Informasi Penyakit Padi
                        </h1>
                        <p className="mt-1 text-gray-600">
                            Pelajari tentang berbagai penyakit pada tanaman padi yang dapat dideteksi oleh sistem
                        </p>
                    </div>
                    {!apiConnected && (
                        <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
                            <AlertCircle className="size-4" />
                            <span>Data dari cache (API tidak tersedia)</span>
                        </div>
                    )}
                </div>

                {/* Search */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        type="search"
                        placeholder="Cari penyakit..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 border-gray-300 focus:border-emerald-500"
                    />
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-2">
                        <Leaf className="size-4 text-emerald-500" />
                        {diseases.length} jenis kondisi terdeteksi
                    </span>
                </div>

                {/* Disease Grid */}
                {filteredDiseases.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredDiseases.map((disease) => {
                            const colors = colorMap[disease.color || 'gray'] || colorMap.gray;
                            return (
                                <Link
                                    key={disease.id}
                                    href={`/diseases/${disease.slug}`}
                                    className={`group flex flex-col overflow-hidden rounded-xl border ${colors.border} bg-white transition-all hover:shadow-lg`}
                                >
                                    {/* Header */}
                                    <div className={`${colors.bg} px-5 py-4`}>
                                        <div className="flex items-start gap-3">
                                            <div className={`mt-1 size-3 rounded-full ${colors.dot}`} />
                                            <div className="flex-1">
                                                <h3 className={`font-semibold ${colors.text} group-hover:text-gray-900 transition-colors`}>
                                                    {disease.name}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {disease.name_id}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-1 flex-col p-5">
                                        <p className="line-clamp-3 flex-1 text-sm text-gray-600 leading-relaxed">
                                            {disease.description}
                                        </p>
                                        <div className="mt-4 flex items-center gap-1 text-sm font-medium text-emerald-600 group-hover:text-emerald-700">
                                            Lihat detail
                                            <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-gray-300 p-12">
                        <div className="flex size-16 items-center justify-center rounded-full bg-gray-100">
                            <BookOpen className="size-8 text-gray-400" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-semibold text-gray-900">
                                Tidak ada penyakit ditemukan
                            </h3>
                            <p className="mt-1 text-sm text-gray-600">
                                Coba ubah kata kunci pencarian Anda
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
