/**
 * Design types for the design upload system
 */

export type DesignStatus = 'draft' | 'active' | 'archived';
export type AIAnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type DesignCategory =
  | 'tops'
  | 'bottoms'
  | 'dresses'
  | 'outerwear'
  | 'accessories'
  | 'footwear'
  | 'activewear'
  | 'swimwear';

export type DesignSeason =
  | 'spring_summer'
  | 'fall_winter'
  | 'resort'
  | 'pre_fall'
  | 'year_round';

/**
 * Design interface
 */
export interface Design {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  category: DesignCategory;
  category_label: string;
  season: DesignSeason | null;
  season_label: string | null;
  target_demographic: string | null;
  file_path: string;
  file_url: string;
  file_type: string;
  original_filename: string;
  file_size: number;
  file_size_formatted: string;
  ai_analysis_status: AIAnalysisStatus;
  ai_analysis_result: AIAnalysisResult | null;
  trend_score: number | null;
  status: DesignStatus;
  variations_count?: number;
  variations?: DesignVariation[];
  created_at: string;
  updated_at: string;
}

/**
 * Design Variation interface
 */
export interface DesignVariation {
  id: number;
  design_id: number;
  variation_number: number;
  description: string;
  file_path: string | null;
  file_url: string | null;
  ai_suggestions: AIVariationSuggestions | null;
  created_at: string;
  updated_at: string;
}

/**
 * AI Analysis Result
 */
export interface AIAnalysisResult {
  // Style Analysis
  keywords: string[];
  style_tags: string[];

  // Color Analysis
  color_palette: string[];
  dominant_color: string;
  color_mood: string;

  // Material Suggestions
  suggested_materials: string[];

  // Market Analysis
  market_fit_score: number;
  market_fit_explanation: string;
  target_audience: string;

  // Trend Analysis
  trend_alignment: string;
  trend_score: number;

  // Seasonal
  seasonal_relevance: string[];

  // Production Notes
  production_complexity: 'low' | 'medium' | 'high';
  estimated_price_point: 'budget' | 'mid-range' | 'premium' | 'luxury';
}

/**
 * AI Variation Suggestions
 */
export interface AIVariationSuggestions {
  color_changes: string[];
  material_changes: string[];
  style_modifications: string[];
  target_market_shift: string;
  rationale: string;
  estimated_appeal_increase: number;
}

/**
 * Design upload form data
 */
export interface CreateDesignData {
  title: string;
  description?: string;
  category: DesignCategory;
  season?: DesignSeason;
  target_demographic?: string;
  design_file: File;
  status?: 'draft' | 'active';
}

/**
 * Design update data
 */
export interface UpdateDesignData {
  title?: string;
  description?: string | null;
  category?: DesignCategory;
  season?: DesignSeason | null;
  target_demographic?: string | null;
  status?: DesignStatus;
}

/**
 * Design list filters
 */
export interface DesignFilters {
  status?: DesignStatus;
  category?: DesignCategory;
  search?: string;
  per_page?: number;
  page?: number;
}

/**
 * Design statistics
 */
export interface DesignStats {
  total_designs: number;
  active_designs: number;
  draft_designs: number;
  pending_analysis: number;
}

/**
 * Extended designer dashboard stats
 */
export interface DesignerDashboardStats {
  // Design counts
  total_designs: number;
  published_designs: number;
  draft_designs: number;

  // Validation counts
  total_validations: number;
  pending_validations: number;
  completed_validations: number;

  // Other
  saved_suppliers: number;
  total_views: number;
  views_change: number; // percentage change from last period
}

/**
 * Designer activity types
 */
export type DesignerActivityType =
  | 'design_created'
  | 'design_published'
  | 'validation_started'
  | 'validation_completed'
  | 'supplier_saved';

/**
 * Designer activity item
 */
export interface DesignerActivity {
  id: number;
  type: DesignerActivityType;
  design?: {
    id: number;
    title: string;
    file_url?: string;
  };
  validation?: {
    id: number;
    validation_score?: number | null;
  };
  supplier?: {
    id: number;
    business_name: string;
  };
  created_at: string;
}

/**
 * Constants for design options
 */
export const DESIGN_CATEGORIES = [
  { value: 'tops', label: 'Tops' },
  { value: 'bottoms', label: 'Bottoms' },
  { value: 'dresses', label: 'Dresses' },
  { value: 'outerwear', label: 'Outerwear' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'footwear', label: 'Footwear' },
  { value: 'activewear', label: 'Activewear' },
  { value: 'swimwear', label: 'Swimwear' },
] as const;

export const DESIGN_SEASONS = [
  { value: 'spring_summer', label: 'Spring/Summer' },
  { value: 'fall_winter', label: 'Fall/Winter' },
  { value: 'resort', label: 'Resort' },
  { value: 'pre_fall', label: 'Pre-Fall' },
  { value: 'year_round', label: 'Year-Round' },
] as const;

export const DESIGN_STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
] as const;

/**
 * Accepted file types for design upload
 */
export const ACCEPTED_FILE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'application/pdf': ['.pdf'],
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
