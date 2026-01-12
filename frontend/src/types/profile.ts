/**
 * Profile types for designer and supplier profiles
 */

export type ProfileType = 'designer' | 'supplier';

export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

/**
 * Base profile interface
 */
export interface Profile {
  id: number;
  user_id: number;
  type: ProfileType;
  business_name: string;
  location: string | null;
  bio: string | null;
  profile_image_path: string | null;
  profile_image_url: string | null;
  website_url: string | null;
  phone: string | null;
  style_focus: string[];
  target_demographics: string[];
  verification_status: VerificationStatus;
  is_verified: boolean;
  onboarding_completed_at: string | null;
  has_completed_onboarding: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Designer-specific profile
 */
export interface DesignerProfile extends Profile {
  type: 'designer';
}

/**
 * Supplier-specific profile
 */
export interface SupplierProfile extends Profile {
  type: 'supplier';
}

/**
 * Data for updating a profile
 */
export interface UpdateProfileData {
  business_name?: string;
  location?: string | null;
  bio?: string | null;
  website_url?: string | null;
  phone?: string | null;
  style_focus?: string[];
  target_demographics?: string[];
}

/**
 * Onboarding form data - all fields collected during onboarding
 */
export interface OnboardingFormData {
  // Step 1: Business Info
  business_name: string;
  location: string;

  // Step 2: About You
  bio: string;
  website_url: string;

  // Step 3: Style Preferences
  style_focus: string[];

  // Step 4: Target Audience
  target_demographics: string[];
}

/**
 * Style focus options for designers
 */
export const STYLE_FOCUS_OPTIONS = [
  { value: 'streetwear', label: 'Streetwear' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'bohemian', label: 'Bohemian' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'sustainable', label: 'Sustainable' },
  { value: 'athletic', label: 'Athletic' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'contemporary', label: 'Contemporary' },
  { value: 'avant-garde', label: 'Avant-Garde' },
  { value: 'classic', label: 'Classic' },
] as const;

/**
 * Target demographic options
 */
export const TARGET_AGE_GROUPS = [
  { value: '18-24', label: '18-24' },
  { value: '25-34', label: '25-34' },
  { value: '35-44', label: '35-44' },
  { value: '45+', label: '45+' },
] as const;

export const TARGET_GENDERS = [
  { value: 'women', label: 'Women' },
  { value: 'men', label: 'Men' },
  { value: 'unisex', label: 'Unisex' },
  { value: 'non-binary', label: 'Non-binary' },
] as const;

export const TARGET_PRICE_POINTS = [
  { value: 'budget', label: 'Budget' },
  { value: 'mid-range', label: 'Mid-range' },
  { value: 'premium', label: 'Premium' },
  { value: 'luxury', label: 'Luxury' },
] as const;
