import {
  Dumbbell,
  Palette,
  BookOpen,
  PenTool,
  Code,
  Trophy,
  User,
  Settings,
  LayoutDashboard,
  BarChart3,
} from 'lucide-react';

export const primaryNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', shortLabel: 'Home' },
  { icon: Dumbbell, label: 'Body Transformation', path: '/body-transformation', shortLabel: 'Body' },
  { icon: Palette, label: 'Dual Brand', path: '/dual-brand', shortLabel: 'Brand' },
  { icon: BookOpen, label: 'Reading Journey', path: '/reading', shortLabel: 'Reading' },
  { icon: PenTool, label: "Writer's Journey", path: '/writers', shortLabel: 'Writing' },
  { icon: Code, label: 'Software Engineering', path: '/software-engineering', shortLabel: 'Code' },
];

export const secondaryNavItems = [
  { icon: BarChart3, label: 'Analytics', path: '/analytics', shortLabel: 'Stats' },
  { icon: Trophy, label: 'Achievements', path: '/achievements', shortLabel: 'Awards' },
  { icon: User, label: 'Profile', path: '/profile', shortLabel: 'Profile' },
  { icon: Settings, label: 'Settings', path: '/settings', shortLabel: 'Settings' },
];

export const allNavItems = [...primaryNavItems, ...secondaryNavItems];

/** Desktop sidebar: journeys + account (no duplicate dashboard — logo links home) */
export const desktopNavItems = [...primaryNavItems.slice(1), ...secondaryNavItems];

export const mobileBottomNavItems = [
  primaryNavItems[0],
  { icon: Code, label: 'Journeys', path: '__journeys__', shortLabel: 'Journeys' },
  secondaryNavItems[0],
  secondaryNavItems[1],
];

export const mobileJourneyItems = primaryNavItems.slice(1);
