// Supplier Types for AgileSourcing

export interface Supplier {
  id: number;
  user_id: number;
  company_name: string;
  description: string | null;
  logo_url: string | null;
  banner_url?: string | null;
  location: string;
  website_url: string | null;
  phone: string | null;
  service_type: ServiceType;
  service_type_label: string;
  minimum_order_quantity: number | null;
  lead_time_days: number | null;
  production_capacity: number | null;
  response_time_hours: number | null;
  specialties: string[];
  is_verified: boolean;
  is_featured: boolean;
  has_completed_onboarding: boolean;
  certifications: SupplierCertification[];
  certification_types: CertificationType[];
  catalog_items?: ProductCatalogItem[];
  catalog_count?: number;
  match_score?: number;
  rating?: number | null;
  review_count?: number;
  created_at: string;
  updated_at: string;
}

export interface SupplierCertification {
  id: number;
  supplier_id: number;
  certification_type: CertificationType;
  certification_label: string;
  certificate_url: string | null;
  certificate_number: string | null;
  issued_date: string | null;
  expiry_date: string | null;
  is_verified: boolean;
  verified_at: string | null;
  is_expired: boolean;
  is_expiring_soon: boolean;
  created_at: string;
}

export interface ProductCatalogItem {
  id: number;
  supplier_id: number;
  name: string;
  description: string | null;
  category: string;
  images: string[];
  primary_image: string | null;
  specifications: Record<string, string>;
  price_range_min: number | null;
  price_range_max: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ServiceType = 'fabric' | 'cmt' | 'full_production';

export type CertificationType =
  | 'GOTS'
  | 'OEKO_TEX'
  | 'FAIR_TRADE'
  | 'ISO_9001'
  | 'ISO_14001'
  | 'WRAP'
  | 'BSCI'
  | 'SA8000';

export interface SupplierSearchFilters {
  query?: string;
  service_type?: ServiceType;
  certifications?: CertificationType[];
  location?: string;
  min_moq?: number;
  max_moq?: number;
  is_verified?: boolean;
  sort_by?: 'relevance' | 'rating' | 'lead_time' | 'moq' | 'newest';
  per_page?: number;
  page?: number;
}

export interface SupplierProfileFormData {
  business_name: string;
  bio?: string;
  location: string;
  website_url?: string;
  phone?: string;
  service_type: ServiceType;
  specialties?: string[];
  minimum_order_quantity?: number;
  lead_time_days?: number;
  production_capacity?: number;
  response_time_hours?: number;
}

export interface CertificationFormData {
  certification_type: CertificationType;
  certificate_file: File;
  issued_date: string;
  expiry_date: string;
  certificate_number?: string;
}

export interface CatalogItemFormData {
  name: string;
  description?: string;
  category: string;
  images?: File[];
  specifications?: Record<string, string>;
  price_range_min?: number;
  price_range_max?: number;
  is_active?: boolean;
}

export interface StatTrend {
  value: number;
  isPositive: boolean;
}

export interface SupplierStats {
  profile_completion: number;
  profile_completion_percentage?: number;
  profile_views?: number;
  profile_views_trend?: StatTrend;
  inquiries_received?: number;
  inquiries_trend?: StatTrend;
  certifications_count: number;
  catalog_items_count: number;
  saved_by_count: number;
  saved_count?: number;
  saved_trend?: StatTrend;
  missing_fields?: string[];
  is_verified: boolean;
  is_featured: boolean;
}

/**
 * Extended supplier dashboard stats from API
 */
export interface SupplierDashboardStats {
  // Profile views
  profile_views: number;
  profile_views_change: number;

  // Inquiries
  inquiries_received: number;
  inquiries_change: number;

  // Saved by designers
  saved_by_designers: number;
  saved_change: number;

  // Profile
  profile_completion: number;

  // Response metrics
  response_rate: number;
  avg_response_time: number; // in hours

  // Additional from existing stats endpoint
  certifications_count?: number;
  catalog_items_count?: number;
  is_verified?: boolean;
  is_featured?: boolean;
}

/**
 * Supplier activity types
 */
export type SupplierActivityType =
  | 'profile_view'
  | 'inquiry_received'
  | 'saved_by_designer'
  | 'certification_verified';

/**
 * Supplier activity item
 */
export interface SupplierActivity {
  id: number;
  type: SupplierActivityType;
  viewer?: {
    id: number;
    name: string;
  };
  created_at: string;
}

/**
 * Views timeline data for charts
 */
export interface ViewsTimelineData {
  date: string;
  views: number;
}

// Constants
export const SERVICE_TYPES = [
  { value: 'fabric' as const, label: 'Fabric Supplier', description: 'Raw materials and textiles' },
  { value: 'cmt' as const, label: 'CMT (Cut, Make, Trim)', description: 'Manufacturing services' },
  { value: 'full_production' as const, label: 'Full Production', description: 'End-to-end manufacturing' },
] as const;

export const CERTIFICATION_TYPES = [
  { value: 'GOTS' as const, label: 'GOTS', description: 'Global Organic Textile Standard', color: 'emerald' },
  { value: 'OEKO_TEX' as const, label: 'OEKO-TEX', description: 'Standard 100 certification', color: 'blue' },
  { value: 'FAIR_TRADE' as const, label: 'Fair Trade', description: 'Fair Trade certified', color: 'amber' },
  { value: 'ISO_9001' as const, label: 'ISO 9001', description: 'Quality management systems', color: 'indigo' },
  { value: 'ISO_14001' as const, label: 'ISO 14001', description: 'Environmental management', color: 'green' },
  { value: 'WRAP' as const, label: 'WRAP', description: 'Worldwide Responsible Accredited Production', color: 'purple' },
  { value: 'BSCI' as const, label: 'BSCI', description: 'Business Social Compliance Initiative', color: 'rose' },
  { value: 'SA8000' as const, label: 'SA8000', description: 'Social Accountability certification', color: 'cyan' },
] as const;

export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'newest', label: 'Newest First' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'lead_time', label: 'Fastest Lead Time' },
  { value: 'moq', label: 'Lowest MOQ' },
] as const;

// Helper functions
export function getServiceTypeLabel(type: ServiceType): string {
  const found = SERVICE_TYPES.find((t) => t.value === type);
  return found?.label || type;
}

export function getCertificationLabel(type: CertificationType): string {
  const found = CERTIFICATION_TYPES.find((t) => t.value === type);
  return found?.label || type;
}

export function getCertificationDescription(type: CertificationType): string {
  const found = CERTIFICATION_TYPES.find((t) => t.value === type);
  return found?.description || '';
}

export function getCertificationColor(type: CertificationType): string {
  const found = CERTIFICATION_TYPES.find((t) => t.value === type);
  return found?.color || 'gray';
}

export function formatMOQ(moq: number | null): string {
  if (!moq) return 'No minimum';
  if (moq >= 1000) return `${(moq / 1000).toFixed(0)}k units`;
  return `${moq} units`;
}

export function formatLeadTime(days: number | null): string {
  if (!days) return 'Varies';
  if (days === 1) return '1 day';
  if (days < 7) return `${days} days`;
  if (days === 7) return '1 week';
  if (days < 30) return `${Math.ceil(days / 7)} weeks`;
  return `${Math.ceil(days / 30)} months`;
}
