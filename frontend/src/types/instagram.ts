/**
 * Instagram integration types
 */

/**
 * Instagram Connection interface
 */
export interface InstagramConnection {
  id: number;
  instagram_user_id: string;
  instagram_username: string;
  profile_picture_url: string | null;
  followers_count: number;
  token_expires_at: string;
  is_token_expired: boolean;
  is_token_expiring_soon: boolean;
  created_at: string;
}

/**
 * Instagram connection status response
 */
export interface InstagramStatusResponse {
  connected: boolean;
  data: InstagramConnection | null;
}

/**
 * Instagram auth URL response
 */
export interface InstagramAuthResponse {
  url: string;
}

/**
 * Mockup status type
 */
export type MockupStatus = 'pending' | 'processing' | 'completed' | 'failed';

/**
 * Mockup model type
 */
export type MockupModelType = 'male' | 'female' | 'unisex';

/**
 * Mockup pose type
 */
export type MockupPose = 'front' | 'side' | 'back' | 'action';

/**
 * Mockup background type
 */
export type MockupBackground = 'studio' | 'outdoor' | 'urban' | 'beach';

/**
 * Mockup interface
 */
export interface Mockup {
  id: number;
  design_id: number;
  design_variation_id: number | null;
  model_type: MockupModelType;
  pose: MockupPose;
  background: MockupBackground;
  file_path: string | null;
  file_url: string | null;
  status: MockupStatus;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Mockup generation options
 */
export interface MockupOptions {
  model_type: MockupModelType;
  pose: MockupPose;
  background: MockupBackground;
  design_variation_id?: number;
}

/**
 * Mockup option constants
 */
export const MOCKUP_MODEL_TYPES = [
  { value: 'female' as const, label: 'Female Model', icon: '👩' },
  { value: 'male' as const, label: 'Male Model', icon: '👨' },
  { value: 'unisex' as const, label: 'Gender Neutral', icon: '🧑' },
];

export const MOCKUP_POSES = [
  { value: 'front' as const, label: 'Front View', description: 'Model facing the camera' },
  { value: 'side' as const, label: 'Side View', description: 'Profile showing silhouette' },
  { value: 'back' as const, label: 'Back View', description: 'Showing the back of garment' },
  { value: 'action' as const, label: 'Action Shot', description: 'Dynamic walking pose' },
];

export const MOCKUP_BACKGROUNDS = [
  { value: 'studio' as const, label: 'Studio', description: 'Clean white background' },
  { value: 'outdoor' as const, label: 'Outdoor', description: 'Natural outdoor setting' },
  { value: 'urban' as const, label: 'Urban', description: 'City street backdrop' },
  { value: 'beach' as const, label: 'Beach', description: 'Coastal scenery' },
];
