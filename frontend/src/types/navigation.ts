import { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number | string;
  children?: NavigationItem[];
}

export interface NavigationGroup {
  label?: string;
  items: NavigationItem[];
}
