
export type VoiceOption = 'female_solo' | 'male_solo' | 'duo_ff' | 'duo_hh' | 'duo_fh';
export type VoiceType = 'female' | 'male' | 'duo';
export type OrderStatus = 'new' | 'in_progress' | 'done' | 'delivered';
export type PlatformType = 'TikTok' | 'YouTube' | 'Instagram' | 'Facebook' | 'Discord' | 'Autre';
export type VocalLanguageStyle = 'native' | 'french_accented';

export interface Order {
  id: string;
  created_at: string;
  email: string;
  platform: PlatformType;
  platform_other?: string;
  handle: string;
  title: string;
  styles: string[];
  styles_other?: string;
  voice: VoiceOption | VoiceType;
  languages: string[];
  languages_other?: string;
  vocalLanguageStyle: VocalLanguageStyle;
  mood: string;
  mood_other?: string;
  energy: number;
  tempo: 'lent' | 'moyen' | 'rapide';
  subject: string;
  status: OrderStatus;
  ai_summary?: string;
  duo_config?: {
    voice1: { gender: 'female' | 'male'; languages: string[]; other: string };
    voice2: { gender: 'female' | 'male'; languages: string[]; other: string };
  };
}

export interface OrderFormData {
  email: string;
  platform: PlatformType;
  platform_other: string;
  handle: string;
  title: string;
  styles: string[];
  styles_other: string;
  voice: VoiceOption | VoiceType;
  languages: string[];
  languages_other: string;
  vocalLanguageStyle: VocalLanguageStyle;
  mood: string;
  mood_other: string;
  energy: number;
  tempo: 'lent' | 'moyen' | 'rapide';
  acceptTerms: boolean;
  subject: string;
  duo_config?: {
    voice1: { gender: 'female' | 'male'; languages: string[]; other: string };
    voice2: { gender: 'female' | 'male'; languages: string[]; other: string };
  };
}
