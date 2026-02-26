
export const ADMIN_EMAIL = 'pyronixlastar@gmail.com';
// Utilise la variable d'environnement (Secret GitHub) si disponible, sinon utilise le code par défaut.
export const ADMIN_PASS = (typeof process !== 'undefined' && process.env.ADMIN_PASS) || 'papafaitpipi24';

export const PLATFORMS = [
  'TikTok', 'YouTube', 'Instagram', 'Facebook', 'Discord', 'Autre'
];

export const MUSICAL_STYLES = [
  'Pop', 'Rock', 'Rap', 'R&B', 'Soul', 'Électro', 
  'House', 'Techno', 'Reggae', 'Dancehall', 'Afrobeat', 
  'Amapiano', 'Lo-fi', 'Synthwave', 'Trap', 'Drill',
  'Funk', 'Disco', 'Metal', 'Jazz', 'Blues', 'Gospel',
  'Reggaeton', 'Indie Pop', 'Phonk', 'Cloud Rap', 'Autre'
];

export const LANGUAGES = [
  'Français', 'Anglais', 'Espagnol', 'Arabe', 'Portugais', 'Italien', 
  'Allemand', 'Russe', 'Chinois', 'Japonais', 'Coréen', 'Turc', 'Autre'
];

export const MOODS = [
  'Joyeux', 'Mélancolique', 'Énergique', 'Mystérieux', 'Agressif', 'Romantique', 'Sombre', 'Épique', 'Autre'
];

export const TEMPOS = [
  { value: 'lent', label: 'Lent' },
  { value: 'moyen', label: 'Moyen' },
  { value: 'rapide', label: 'Rapide' }
];

export const DEMO_TRACKS = [
  {
    id: '1',
    title: "T'es pas seul",
    style: 'Deep Emotion',
    youtubeId: 'PLArkz_K4_Q',
    color: 'border-pyronix-orange shadow-[0_0_20px_rgba(255,94,0,0.2)]',
    accent: 'text-pyronix-orange',
    glow: 'group-hover:shadow-[0_0_40px_rgba(255,94,0,0.4)]'
  },
  {
    id: '2',
    title: "Je t'aime encore dans le vide",
    style: 'Énergie Pure',
    youtubeId: 'lZYYcAYRnuM',
    color: 'border-pyronix-cyan shadow-[0_0_20px_rgba(0,242,255,0.2)]',
    accent: 'text-pyronix-cyan',
    glow: 'group-hover:shadow-[0_0_40px_rgba(0,242,255,0.4)]'
  },
  {
    id: '3',
    title: "Jusqu'à l'aube",
    style: 'Vibe Nocturne',
    youtubeId: 'mH35SU_dzDg',
    color: 'border-pyronix-magenta shadow-[0_0_20px_rgba(255,0,225,0.2)]',
    accent: 'text-pyronix-magenta',
    glow: 'group-hover:shadow-[0_0_40px_rgba(255,0,225,0.4)]'
  }
];
