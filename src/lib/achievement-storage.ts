
import { parseImageData } from "./utils";

export interface UserAchievement {
  id: number;
  name: string;
  description: string;  // Added description property
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  total?: number;
}

export interface UserStats {
  points: number;
  aiArtworksUploaded: number;
  handDrawnArtworksUploaded: number;
  totalArtworksUploaded: number;
  weeklyThemesParticipated: string[];
  aiGeneratorsUsed: string[];
  featuredArtworks: string[];
  lastUpdated: Date;
}

const STORAGE_KEY = 'lgs-art-achievements';
const STATS_KEY = 'lgs-art-stats';

const defaultStats: UserStats = {
  points: 0,
  aiArtworksUploaded: 0,
  handDrawnArtworksUploaded: 0,
  totalArtworksUploaded: 0,
  weeklyThemesParticipated: [],
  aiGeneratorsUsed: [],
  featuredArtworks: [],
  lastUpdated: new Date()
};

export const achievementStorage = {
  getAchievements: (): UserAchievement[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse stored achievements:', e);
      return [];
    }
  },

  saveAchievements: (achievements: UserAchievement[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements));
  },

  getStats: (): UserStats => {
    const stored = localStorage.getItem(STATS_KEY);
    if (!stored) return defaultStats;
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse stored stats:', e);
      return defaultStats;
    }
  },

  saveStats: (stats: UserStats): void => {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  },

  recordUpload: (imageData: any): void => {
    const stats = achievementStorage.getStats();
    const details = typeof imageData === 'string' ? parseImageData(imageData) : imageData;
    
    // Update upload counts
    stats.totalArtworksUploaded += 1;
    
    if (details.type === 'ai') {
      stats.aiArtworksUploaded += 1;
      
      // Track unique AI generators
      if (details.aiGenerator && !stats.aiGeneratorsUsed.includes(details.aiGenerator)) {
        stats.aiGeneratorsUsed.push(details.aiGenerator);
      }
    } else {
      stats.handDrawnArtworksUploaded += 1;
    }
    
    // Update weekly theme participation if applicable
    const currentWeekTheme = getCurrentWeekTheme();
    if (currentWeekTheme && !stats.weeklyThemesParticipated.includes(currentWeekTheme)) {
      stats.weeklyThemesParticipated.push(currentWeekTheme);
    }
    
    // Update points
    stats.points += 50; // Base points for any upload
    
    stats.lastUpdated = new Date();
    achievementStorage.saveStats(stats);
    
    // Check and update achievements
    achievementStorage.updateAchievements();
  },

  markAsFeatured: (imageId: string): void => {
    const stats = achievementStorage.getStats();
    if (!stats.featuredArtworks.includes(imageId)) {
      stats.featuredArtworks.push(imageId);
      stats.points += 100; // Bonus points for featured artwork
      stats.lastUpdated = new Date();
      achievementStorage.saveStats(stats);
      achievementStorage.updateAchievements();
    }
  },

  updateAchievements: (): UserAchievement[] => {
    const stats = achievementStorage.getStats();
    let achievements = achievementStorage.getAchievements();
    const now = new Date();
    
    // If no achievements initialized yet, create them
    if (achievements.length === 0) {
      achievements = initialAchievements.map(a => ({...a}));
    }
    
    // Check each achievement condition and update
    achievements = achievements.map(achievement => {
      const updated = {...achievement};
      
      if (!updated.unlocked) {
        // First AI Artwork Achievement
        if (achievement.id === 1 && stats.aiArtworksUploaded > 0) {
          updated.unlocked = true;
          updated.unlockedAt = now;
        }
        
        // Theme Master Achievement
        else if (achievement.id === 2) {
          updated.progress = stats.weeklyThemesParticipated.length;
          if (updated.progress >= (updated.total || 3)) {
            updated.unlocked = true;
            updated.unlockedAt = now;
          }
        }
        
        // Creative Explorer Achievement
        else if (achievement.id === 3) {
          updated.progress = stats.aiGeneratorsUsed.length;
          if (updated.progress >= (updated.total || 5)) {
            updated.unlocked = true;
            updated.unlockedAt = now;
          }
        }
        
        // Community Star Achievement
        else if (achievement.id === 4) {
          updated.progress = stats.featuredArtworks.length;
          if (updated.progress >= (updated.total || 3)) {
            updated.unlocked = true;
            updated.unlockedAt = now;
          }
        }
        
        // Artistic Influencer Achievement - implemented in a way that makes sense for session history
        else if (achievement.id === 5 && stats.totalArtworksUploaded >= 5) {
          updated.unlocked = true;
          updated.unlockedAt = now;
        }
      }
      
      return updated;
    });
    
    achievementStorage.saveAchievements(achievements);
    return achievements;
  },

  clearStorage: (): void => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STATS_KEY);
  }
};

// Helper function to get current week theme
const getCurrentWeekTheme = (): string | null => {
  // For demonstration, this would be dynamically fetched or stored
  // For now, we'll return a hardcoded theme name
  return "Dreamscapes: Reality Reimagined";
};

// Initial achievement definitions that match our UI
const initialAchievements: UserAchievement[] = [
  {
    id: 1,
    name: "First AI Artwork",
    description: "Create and submit your first AI-generated artwork",
    unlocked: false,
    progress: 0,
    total: 1
  },
  {
    id: 2,
    name: "Theme Master",
    description: "Submit artworks for 3 different weekly themes",
    unlocked: false,
    progress: 0,
    total: 3
  },
  {
    id: 3,
    name: "Creative Explorer",
    description: "Try 5 different AI art generators",
    unlocked: false,
    progress: 0,
    total: 5
  },
  {
    id: 4,
    name: "Community Star",
    description: "Have 3 of your artworks featured in the gallery",
    unlocked: false,
    progress: 0,
    total: 3
  },
  {
    id: 5,
    name: "Artistic Influencer",
    description: "Inspire 5 other students with your artwork",
    unlocked: false,
    progress: 0,
    total: 5
  }
];
