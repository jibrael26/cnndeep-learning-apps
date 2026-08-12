import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Camera,
    Upload,
    BrainCircuit,
    Percent,
    History,
    Menu,
    X,
    Leaf,
    ChevronRight,
    Sparkles,
    Shield,
    Zap,
    BarChart3,
} from 'lucide-react';
import { useState } from 'react';

const appName = import.meta.env.VITE_APP_NAME || 'RiceLeaf AI';

// Navigation Component
function Navigation({ auth, canRegister }: { auth: SharedData['auth']; canRegister: boolean }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Beranda', href: '/' },
        { name: 'Deteksi', href: '/detection' },
        { name: 'Riwayat', href: '/detection/history' },
        { name: 'Info Penyakit', href: '/diseases' },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-sm">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white">
                            <Leaf className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-gray-900">{appName}</span>
                            <span className="text-[10px] text-emerald-600 font-medium -mt-1">
                                Disease Detection
                            </span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors rounded-lg hover:bg-emerald-50"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all"
                            >
                                Dashboard
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors"
                                >
                                    Masuk
                                </Link>
                                {canRegister && (
                                    <Link
                                        href="/detection"
                                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all"
                                    >
                                        Mulai Deteksi
                                    </Link>
                                )}
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-emerald-50"
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-emerald-100">
                        <div className="flex flex-col gap-1">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                        <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-emerald-100">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl"
                                    >
                                        Masuk
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href="/detection"
                                            className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl"
                                        >
                                            Mulai Deteksi
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}

// Hero Section
function HeroSection({ diseaseCount }: { diseaseCount: number }) {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 bg-gradient-to-b from-emerald-50 via-white to-white">

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="text-center lg:text-left">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full text-emerald-700 text-sm font-medium mb-6">
                            <Sparkles className="h-4 w-4" />
                            <span>Powered by CNN & Deep Learning</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                            Deteksi Penyakit{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-600">
                                Daun Padi
                            </span>{' '}
                            dengan AI
                        </h1>

                        {/* Description */}
                        <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                            Unggah foto daun padi Anda dan dapatkan diagnosis penyakit secara instan
                            menggunakan teknologi Convolutional Neural Network dengan akurasi tinggi.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                            <Link
                                href="/detection"
                                className="group inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl hover:from-emerald-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
                            >
                                <Upload className="h-5 w-5" />
                                Mulai Deteksi
                                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <a
                                href="#cara-kerja"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-2xl hover:border-emerald-300 hover:bg-emerald-50 transition-all"
                            >
                                Pelajari Lebih Lanjut
                            </a>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
                            {[
                                { value: String(diseaseCount), label: 'Jenis Penyakit' },
                                { value: '95%', label: 'Akurasi' },
                                { value: '<1s', label: 'Hasil Cepat' },
                            ].map((stat, index) => (
                                <div key={index} className="text-center lg:text-left">
                                    <div className="text-2xl font-bold text-emerald-600">{stat.value}</div>
                                    <div className="text-sm text-gray-500">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Content - Illustration */}
                    <div className="relative hidden lg:block">
                        <div className="relative w-full aspect-square max-w-lg mx-auto">
                            {/* Main Card */}
                            <div className="absolute inset-0 bg-white rounded-3xl shadow-lg border border-emerald-100 p-8">
                                <div className="h-full flex flex-col items-center justify-center">
                                    <div className="w-32 h-32 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center mb-6">
                                        <Leaf className="h-16 w-16 text-emerald-500" />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            Upload Gambar Daun
                                        </h3>
                                        <p className="text-gray-500 text-sm">
                                            Format: JPG, PNG, WEBP
                                        </p>
                                    </div>
                                    <div className="mt-6 w-full max-w-xs border-2 border-dashed border-emerald-200 rounded-2xl p-6 bg-emerald-50/50">
                                        <div className="flex flex-col items-center">
                                            <Camera className="h-8 w-8 text-emerald-400 mb-2" />
                                            <span className="text-sm text-emerald-600 font-medium">
                                                Drag & Drop atau Klik
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Elements */}
                            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-md p-4 border border-emerald-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <Shield className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500">Status</div>
                                        <div className="text-sm font-semibold text-green-600">Healthy</div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-md p-4 border border-emerald-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                        <BarChart3 className="h-5 w-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500">Confidence</div>
                                        <div className="text-sm font-semibold text-emerald-600">98.5%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <a href="#cara-kerja" className="flex flex-col items-center gap-2 text-gray-400 hover:text-emerald-500 transition-colors">
                    <span className="text-xs font-medium">Scroll</span>
                    <div className="w-6 h-10 border-2 border-current rounded-full flex items-start justify-center p-1">
                        <div className="w-1.5 h-2.5 bg-current rounded-full animate-bounce" />
                    </div>
                </a>
            </div>
        </section>
    );
}

// How It Works Section
function HowItWorksSection() {
    const steps = [
        {
            step: '01',
            icon: Upload,
            title: 'Upload Gambar',
            description: 'Ambil foto daun padi yang ingin diperiksa dan unggah ke sistem kami.',
        },
        {
            step: '02',
            icon: BrainCircuit,
            title: 'Analisis AI',
            description: 'CNN akan menganalisis gambar dan mendeteksi pola penyakit pada daun.',
        },
        {
            step: '03',
            icon: Percent,
            title: 'Hasil & Rekomendasi',
            description: 'Dapatkan diagnosis penyakit beserta tingkat kepercayaan dan saran penanganan.',
        },
    ];

    return (
        <section id="cara-kerja" className="py-24 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">
                        Cara Kerja
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4">
                        Mudah, Cepat, dan Akurat
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Proses deteksi penyakit daun padi hanya membutuhkan 3 langkah sederhana
                    </p>
                </div>

                {/* Steps */}
                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((item, index) => (
                        <div key={index} className="relative group">
                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-emerald-300 to-emerald-100" />
                            )}

                            <div className="relative bg-white rounded-3xl p-8 border-2 border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                                {/* Step Number */}
                                <div className="absolute -top-4 left-8 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-bold px-4 py-1 rounded-full">
                                    {item.step}
                                </div>

                                {/* Icon */}
                                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                    <item.icon className="h-8 w-8 text-emerald-600 group-hover:text-white" />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// Disease Classes Section
function DiseaseSection({ diseases }: { diseases: Disease[] }) {
    // Color palette for diseases
    const colors = [
        'bg-red-500',
        'bg-amber-600',
        'bg-orange-500',
        'bg-gray-600',
        'bg-yellow-600',
        'bg-rose-500',
        'bg-emerald-500',
        'bg-blue-500',
        'bg-purple-500',
    ];

    return (
        <section className="py-24 bg-gradient-to-b from-white to-emerald-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">
                        Deteksi Penyakit
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4">
                        {diseases.length} Jenis Kondisi Daun yang Terdeteksi
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Sistem kami dapat mengidentifikasi berbagai jenis penyakit pada daun padi
                    </p>
                </div>

                {/* Disease Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {diseases.map((disease, index) => (
                        <div
                            key={disease.name}
                            className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 group"
                        >
                            <div className="flex items-start gap-3">
                                <div className={`w-3 h-3 ${colors[index % colors.length]} rounded-full mt-1.5 flex-shrink-0`} />
                                <div>
                                    <h4 className="font-semibold text-gray-900 text-sm group-hover:text-emerald-600 transition-colors">
                                        {disease.name}
                                    </h4>
                                    <p className="text-xs text-emerald-600 font-medium">
                                        {disease.name_id}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                        {disease.description?.substring(0, 50)}...
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-12">
                    <Link
                        href="/diseases"
                        className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
                    >
                        Lihat Detail Penyakit
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

// Features Section
function FeaturesSection() {
    const features = [
        {
            icon: Zap,
            title: 'Deteksi Instan',
            description: 'Hasil diagnosis dalam hitungan detik menggunakan CNN yang teroptimasi.',
        },
        {
            icon: BrainCircuit,
            title: 'Akurasi Tinggi',
            description: 'Model terlatih dengan ribuan sampel untuk hasil prediksi yang akurat.',
        },
        {
            icon: History,
            title: 'Riwayat Lengkap',
            description: 'Simpan semua hasil deteksi untuk monitoring kesehatan tanaman.',
        },
        {
            icon: Shield,
            title: 'Data Aman',
            description: 'Gambar dan data Anda dijamin keamanan dan privasinya.',
        },
    ];

    return (
        <section className="py-24 bg-emerald-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">
                        Keunggulan
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4">
                        Mengapa Memilih Kami?
                    </h2>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-6 border border-emerald-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                                <feature.icon className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// CTA Section
function CTASection() {
    return (
        <section className="py-24 bg-gradient-to-br from-emerald-500 to-green-600 relative overflow-hidden">

            <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                    Siap Melindungi Tanaman Padi Anda?
                </h2>
                <p className="text-lg text-emerald-100 mb-10 max-w-2xl mx-auto">
                    Deteksi dini adalah kunci keberhasilan budidaya. Gunakan teknologi AI kami untuk
                    mengidentifikasi penyakit sejak awal.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        href="/detection"
                        className="inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold text-emerald-600 bg-white rounded-2xl hover:bg-emerald-50 transition-all shadow-md"
                    >
                        <Camera className="h-5 w-5" />
                        Mulai Deteksi Sekarang
                    </Link>
                    <Link
                        href="/detection"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-white/20 border-2 border-white/30 rounded-2xl hover:bg-white/30 transition-all backdrop-blur-sm"
                    >
                        Mulai Sekarang
                    </Link>
                </div>
            </div>
        </section>
    );
}

// Footer
function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-400 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white">
                            <Leaf className="h-5 w-5" />
                        </div>
                        <div>
                            <span className="font-semibold text-white">{appName}</span>
                            <p className="text-xs">© {currentYear} All rights reserved</p>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-6 text-sm">
                        <a href="/" className="hover:text-white transition-colors">Beranda</a>
                        <a href="/detection" className="hover:text-white transition-colors">Deteksi</a>
                        <a href="/diseases" className="hover:text-white transition-colors">Info Penyakit</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

// Disease type (from Python API)
interface Disease {
    name: string;
    name_id: string;
    name_scientific: string | null;
    description: string;
    symptoms: string;
    causes: string;
    treatment: string;
    prevention: string;
}

// Main Component
export default function Welcome({ 
    canRegister = true,
    diseases = [],
}: { 
    canRegister?: boolean;
    diseases?: Disease[];
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Deteksi Penyakit Daun Padi">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=inter:400,500,600,700,800"
                    rel="stylesheet"
                />
            </Head>
            <div className="min-h-screen bg-white font-sans antialiased">
                <Navigation auth={auth} canRegister={canRegister} />
                <main>
                    <HeroSection diseaseCount={diseases.length} />
                    <HowItWorksSection />
                    <DiseaseSection diseases={diseases} />
                    <FeaturesSection />
                    <CTASection />
                </main>
                <Footer />
            </div>
        </>
    );
}
