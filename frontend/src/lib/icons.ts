/**
 * Icon Mapping Utility
 *
 * Maps Strapi icon enum strings to Lucide React icon components.
 * Used by components that store icon names as strings in Strapi
 * and need to render the actual icon component.
 */

import {
  Heart,
  Activity,
  Stethoscope,
  Users,
  Calendar,
  FileText,
  Building,
  Shield,
  Clock,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Award,
  TrendingUp,
  Target,
  UserCheck,
  ClipboardCheck,
  DoorOpen,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Move,
  LucideIcon,
} from 'lucide-react';

/**
 * Icon name type - all valid icon names from Strapi enums
 */
export type IconName =
  // Healthcare/General Icons
  | 'Heart'
  | 'Activity'
  | 'Stethoscope'
  | 'Users'
  | 'Calendar'
  | 'FileText'
  | 'Building'
  | 'Shield'
  | 'Clock'
  | 'CheckCircle'
  | 'Phone'
  | 'Mail'
  | 'MapPin'
  | 'Briefcase'
  | 'Award'
  | 'TrendingUp'
  | 'Target'
  | 'UserCheck'
  | 'ClipboardCheck'
  // Navigation Icons
  | 'DoorOpen'
  | 'ArrowUp'
  | 'ArrowDown'
  | 'ArrowRight'
  | 'Move';

/**
 * Icon component mapping
 */
const ICON_MAP: Record<IconName, LucideIcon> = {
  // Healthcare/General Icons
  Heart,
  Activity,
  Stethoscope,
  Users,
  Calendar,
  FileText,
  Building,
  Shield,
  Clock,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Award,
  TrendingUp,
  Target,
  UserCheck,
  ClipboardCheck,
  // Navigation Icons
  DoorOpen,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Move,
};

/**
 * Get Lucide icon component from icon name string
 *
 * @param iconName - Icon name from Strapi enum
 * @returns Lucide icon component or default FileText icon if not found
 *
 * @example
 * const HeartIcon = getIconComponent('Heart');
 * <HeartIcon className="w-6 h-6" />
 */
export function getIconComponent(iconName: string): LucideIcon {
  // Type assertion is safe because we have a default fallback
  const icon = ICON_MAP[iconName as IconName];

  if (!icon) {
    console.warn(`Icon "${iconName}" not found in icon map, using FileText as fallback`);
    return FileText;
  }

  return icon;
}

/**
 * Check if an icon name is valid
 */
export function isValidIconName(iconName: string): iconName is IconName {
  return iconName in ICON_MAP;
}
