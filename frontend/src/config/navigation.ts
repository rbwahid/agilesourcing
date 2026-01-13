import {
  LayoutDashboard,
  Palette,
  Building2,
  MessageSquare,
  Settings,
  Users,
  CheckCircle,
  CreditCard,
  HelpCircle,
  Inbox,
  BarChart3,
  Heart,
  UserCircle,
  Award,
  Package,
} from 'lucide-react';
import type { NavigationItem } from '@/types/navigation';
import type { UserRole } from '@/types';

export const designerNavigation: NavigationItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Designs', href: '/designs', icon: Palette },
  { label: 'Validations', href: '/validations', icon: BarChart3 },
  { label: 'Find Suppliers', href: '/suppliers', icon: Building2 },
  { label: 'Saved Suppliers', href: '/suppliers/saved', icon: Heart },
  { label: 'Messages', href: '/messages', icon: MessageSquare },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export const supplierNavigation: NavigationItem[] = [
  { label: 'Dashboard', href: '/supplier-dashboard', icon: LayoutDashboard },
  { label: 'Profile', href: '/supplier-profile', icon: UserCircle },
  { label: 'Certifications', href: '/supplier-certifications', icon: Award },
  { label: 'Catalog', href: '/supplier-catalog', icon: Package },
  { label: 'Inquiries', href: '/inquiries', icon: Inbox },
  { label: 'Messages', href: '/messages', icon: MessageSquare },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export const adminNavigation: NavigationItem[] = [
  { label: 'Dashboard', href: '/admin-dashboard', icon: LayoutDashboard },
  { label: 'Users', href: '/users', icon: Users },
  { label: 'Verifications', href: '/verifications', icon: CheckCircle },
  { label: 'Subscriptions', href: '/subscriptions', icon: CreditCard },
  { label: 'Support', href: '/support', icon: HelpCircle },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function getNavigationForRole(role: UserRole): NavigationItem[] {
  switch (role) {
    case 'designer':
      return designerNavigation;
    case 'supplier':
      return supplierNavigation;
    case 'admin':
    case 'super_admin':
      return adminNavigation;
    default:
      return designerNavigation;
  }
}

export function getDashboardPathForRole(role: UserRole): string {
  switch (role) {
    case 'designer':
      return '/dashboard';
    case 'supplier':
      return '/supplier-dashboard';
    case 'admin':
    case 'super_admin':
      return '/admin-dashboard';
    default:
      return '/dashboard';
  }
}
