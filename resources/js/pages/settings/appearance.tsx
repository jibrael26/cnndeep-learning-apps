import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit as editAppearance } from '@/routes/appearance';
import { Sun } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: editAppearance().url,
    },
];

export default function Appearance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Appearance settings"
                        description="Your account appearance settings"
                    />
                    <div className="flex items-center gap-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                            <Sun className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">Light Mode</p>
                            <p className="text-sm text-gray-600">
                                Aplikasi ini menggunakan tema terang secara default.
                            </p>
                        </div>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
