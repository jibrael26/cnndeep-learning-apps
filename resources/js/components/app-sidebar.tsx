import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as detectionIndex, history as detectionHistory } from '@/actions/App/Http/Controllers/DetectionController';
import { index as diseasesIndex } from '@/actions/App/Http/Controllers/DiseaseController';
import { index as evaluationIndex } from '@/actions/App/Http/Controllers/ModelEvaluationController';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Activity, Camera, Clock, LayoutGrid, Leaf } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Deteksi Penyakit',
        href: detectionIndex(),
        icon: Camera,
    },
    {
        title: 'Riwayat Deteksi',
        href: detectionHistory(),
        icon: Clock,
    },
    {
        title: 'Informasi Penyakit',
        href: diseasesIndex(),
        icon: Leaf,
    },
    {
        title: 'Evaluasi Model',
        href: evaluationIndex(),
        icon: Activity,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

