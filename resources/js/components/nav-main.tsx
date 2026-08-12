import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    
    // Helper function to check if menu item is active
    const isItemActive = (itemHref: NavItem['href']) => {
        const currentUrl = page.url.split('?')[0]; // Remove query params
        const itemUrl = resolveUrl(itemHref);
        
        // Exact match first
        if (currentUrl === itemUrl) {
            return true;
        }
        
        // For sub-routes, check if it starts with the item URL
        // but make sure we don't match parent routes incorrectly
        // e.g., /detection should not match when on /detection/history
        if (currentUrl.startsWith(itemUrl + '/')) {
            // Check if any other item has a more specific match
            const hasMoreSpecificMatch = items.some(otherItem => {
                const otherUrl = resolveUrl(otherItem.href);
                return otherUrl !== itemUrl && 
                       currentUrl.startsWith(otherUrl) && 
                       otherUrl.length > itemUrl.length;
            });
            return !hasMoreSpecificMatch;
        }
        
        return false;
    };
    
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={isItemActive(item.href)}
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
