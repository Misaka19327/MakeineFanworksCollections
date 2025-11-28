
export type ContentType = 'story' | 'image';
export type StoryLength = 'Short' | 'Medium' | 'Long' | 'Landscape' | 'Portrait' | 'N/A';

export interface Author {
  name: string;
  avatar?: string;
}

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  author: Author;
  views: number;
  likes: number;
  tags: string[];
  category: string; // e.g., "Fantasy", "Sci-Fi", "Slice of Life"
  lengthCategory: StoryLength; 
  wordCount: number; // New field for statistics
  source: string;
  isTrusted: boolean;
  publishedAt: string;
  snippet?: string; // For stories
  imageUrl?: string; // For images
}

export interface FilterState {
  searchQuery: string;
  contentType: ContentType | 'all'; // New high-level filter
  selectedCategory: string | null;
  selectedTag: string | null;
  lengthFilter: StoryLength | 'All';
}
