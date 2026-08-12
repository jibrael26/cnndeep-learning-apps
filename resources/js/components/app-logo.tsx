import { Leaf } from 'lucide-react';

const appName = import.meta.env.VITE_APP_NAME || 'RiceLeaf AI';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-green-600">
                <Leaf className="size-4 text-white" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold text-gray-900">
                    {appName}
                </span>
            </div>
        </>
    );
}
