import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Upload, History, BookOpen, BarChart3, Leaf, ArrowRight } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

const appName = import.meta.env.VITE_APP_NAME || 'RiceLeaf AI';

const quickActions = [
    {
        title: 'Mulai Deteksi',
        description: 'Upload gambar daun padi untuk deteksi penyakit',
        icon: Upload,
        href: '/detection',
        color: 'from-emerald-500 to-green-600',
        bgColor: 'bg-emerald-50',
        iconColor: 'text-emerald-600',
    },
    {
        title: 'Riwayat Deteksi',
        description: 'Lihat hasil deteksi sebelumnya',
        icon: History,
        href: '/detection/history',
        color: 'from-blue-500 to-blue-600',
        bgColor: 'bg-blue-50',
        iconColor: 'text-blue-600',
    },
    {
        title: 'Info Penyakit',
        description: 'Pelajari tentang penyakit daun padi',
        icon: BookOpen,
        href: '/diseases',
        color: 'from-amber-500 to-orange-500',
        bgColor: 'bg-amber-50',
        iconColor: 'text-amber-600',
    },
    {
        title: 'Evaluasi Model',
        description: 'Lihat performa model CNN',
        icon: BarChart3,
        href: '/evaluation',
        color: 'from-purple-500 to-purple-600',
        bgColor: 'bg-purple-50',
        iconColor: 'text-purple-600',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Welcome Card */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 p-6 text-white">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                                <Leaf className="h-5 w-5" />
                            </div>
                            <h1 className="text-2xl font-bold">{appName}</h1>
                        </div>
                        <p className="text-emerald-100 max-w-xl">
                            Sistem deteksi penyakit daun padi menggunakan teknologi Convolutional Neural Network (CNN).
                            Upload gambar daun padi untuk mendapatkan diagnosis penyakit secara instan.
                        </p>
                    </div>
                    <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent" />
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Menu Cepat</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {quickActions.map((action, index) => (
                            <Link
                                key={index}
                                href={action.href}
                                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-emerald-200 hover:shadow-lg"
                            >
                                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${action.bgColor} mb-4`}>
                                    <action.icon className={`h-6 w-6 ${action.iconColor}`} />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
                                    {action.title}
                                </h3>
                                <p className="text-sm text-gray-600">{action.description}</p>
                                <ArrowRight className="absolute right-4 bottom-4 h-5 w-5 text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-gray-200 bg-white p-5">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-600">Total Deteksi</span>
                            <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                                <Upload className="h-4 w-4 text-emerald-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">0</p>
                        <p className="text-xs text-gray-500 mt-1">Deteksi yang telah dilakukan</p>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white p-5">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-600">Jenis Penyakit</span>
                            <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                <BookOpen className="h-4 w-4 text-blue-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">4</p>
                        <p className="text-xs text-gray-500 mt-1">Penyakit yang dapat dideteksi</p>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white p-5">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-600">Akurasi Model</span>
                            <div className="h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center">
                                <BarChart3 className="h-4 w-4 text-purple-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">95%</p>
                        <p className="text-xs text-gray-500 mt-1">Tingkat akurasi prediksi</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
