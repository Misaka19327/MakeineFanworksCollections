import { ContentItem } from '../types';

// --- Mock Data (模拟数据库) ---
// 在真实应用中，这些数据通常存储在后端数据库（如 MongoDB, PostgreSQL）中
// 为了演示审核功能，确保这里有 isTrusted: false 的数据
const MOCK_DB: ContentItem[] = [
  {
    id: '1',
    type: 'story',
    title: 'The Clockmaker\'s Daughter',
    author: { name: 'Eleanor Vance' },
    views: 12500,
    likes: 3420,
    tags: ['steampunk', 'mystery', 'time-travel'],
    category: 'Sci-Fi',
    lengthCategory: 'Long',
    wordCount: 15400,
    source: 'IndiePress',
    isTrusted: true,
    publishedAt: '2023-10-15',
    snippet: 'The gears didn\'t just turn; they sang. Eliza knew the song of the brass heart better than her own heartbeat. When the visitor arrived in the rain, bearing a pocket watch that ran backwards, the song changed to a scream.',
  },
  {
    id: '2',
    type: 'image',
    title: 'Autumn in Kyoto',
    author: { name: 'Kenji Sato' },
    views: 8900,
    likes: 2100,
    tags: ['photography', 'nature', 'japan', 'travel'],
    category: 'Slice of Life',
    lengthCategory: 'Landscape',
    wordCount: 0,
    source: 'Unsplash',
    isTrusted: true,
    publishedAt: '2023-11-01',
    imageUrl: 'https://picsum.photos/id/1018/800/600',
  },
  {
    id: '3',
    type: 'story',
    title: 'Echoes of the Old World',
    author: { name: 'Marcus Thorne' },
    views: 450,
    likes: 120,
    tags: ['fantasy', 'magic', 'ruins'],
    category: 'Fantasy',
    lengthCategory: 'Short',
    wordCount: 2300,
    source: 'UserSubmission',
    isTrusted: false,
    publishedAt: '2023-12-05',
    snippet: 'Dust motes danced in the shaft of light piercing the crumbling temple roof. "Do you hear it?" Kael whispered. I heard nothing but the wind, yet Kael\'s eyes were wide with a terror I couldn\'t comprehend.',
  },
  {
    id: '4',
    type: 'story',
    title: 'Recipe for Disaster',
    author: { name: 'Julia Childish' },
    views: 32000,
    likes: 15000,
    tags: ['comedy', 'romance', 'cooking'],
    category: 'Romance',
    lengthCategory: 'Medium',
    wordCount: 7500,
    source: 'LitMag',
    isTrusted: true,
    publishedAt: '2023-09-20',
    snippet: 'Adding cayenne pepper instead of paprika was a mistake. Falling in love with the fire marshal who responded to the smoke alarm was a catastrophe waiting to happen.',
  },
  {
    id: '5',
    type: 'image',
    title: 'Cyberpunk Alley',
    author: { name: 'Neon Dreamer' },
    views: 5600,
    likes: 980,
    tags: ['digital-art', 'cyberpunk', 'neon'],
    category: 'Sci-Fi',
    lengthCategory: 'Portrait',
    wordCount: 0,
    source: 'DeviantArt',
    isTrusted: false,
    publishedAt: '2023-10-30',
    imageUrl: 'https://picsum.photos/id/1033/600/800',
  },
  {
    id: '6',
    type: 'story',
    title: 'The Silent Station',
    author: { name: 'H.P. Lovecrafty' },
    views: 6700,
    likes: 2300,
    tags: ['horror', 'space', 'isolation'],
    category: 'Horror',
    lengthCategory: 'Short',
    wordCount: 1200,
    source: 'CreepyPasta',
    isTrusted: true,
    publishedAt: '2023-11-15',
    snippet: 'Reviewing the flight logs, Commander Shepard realized the airlock had cycled open forty times during the night shift. He was the only one on board.',
  },
  {
    id: '7',
    type: 'story',
    title: 'Beneath the Floorboards',
    author: { name: 'Edgar A.' },
    views: 1500,
    likes: 300,
    tags: ['thriller', 'classic', 'psychological'],
    category: 'Mystery',
    lengthCategory: 'Medium',
    wordCount: 6800,
    source: 'PublicDomain',
    isTrusted: true,
    publishedAt: '2023-08-10',
    snippet: 'It was a low, dull, quick sound – much such a sound as a watch makes when enveloped in cotton. I gasped for breath, and yet the officers heard it not.',
  },
  {
    id: '8',
    type: 'image',
    title: 'Morning Mist',
    author: { name: 'Sarah Jenkins' },
    views: 1200,
    likes: 450,
    tags: ['landscape', 'peaceful', 'morning'],
    category: 'Slice of Life',
    lengthCategory: 'Landscape',
    wordCount: 0,
    source: 'Pexels',
    isTrusted: true,
    publishedAt: '2023-12-01',
    imageUrl: 'https://picsum.photos/id/1044/800/500',
  },
    {
    id: '9',
    type: 'story',
    title: 'The Last Archive',
    author: { name: 'Tech Scribe' },
    views: 200,
    likes: 20,
    tags: ['scifi', 'dystopian', 'data'],
    category: 'Sci-Fi',
    lengthCategory: 'Short',
    wordCount: 800,
    source: 'Blog',
    isTrusted: false,
    publishedAt: '2023-12-05',
    snippet: 'The servers hummed a requiem for the old internet. I was the last librarian, and my library was a single hard drive.',
  },
];

// --- API 响应接口定义 ---
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// --- 模拟 Fetch 函数 ---
// 该函数模拟了一个真实的 HTTP 请求过程：
// 1. 返回一个 Promise（异步操作）
// 2. 使用 setTimeout 模拟网络延迟
const fakeFetch = <T>(mockData: T, shouldFail = false): Promise<ApiResponse<T>> => {
  return new Promise((resolve, reject) => {
    const delay = Math.random() * 800 + 200; // 随机延迟 200ms 到 1000ms
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Network Error: Failed to fetch data'));
      } else {
        resolve({
          data: mockData,
          success: true,
        });
      }
    }, delay);
  });
};

// --- Service 层 ---
// 封装具体的数据获取逻辑，使 UI 组件不依赖于具体的 API 实现细节
export const ContentService = {
  // 获取所有内容
  getAll: async (): Promise<ContentItem[]> => {
    try {
      const response = await fakeFetch(MOCK_DB);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // 获取需要审核的内容 (isTrusted: false)
  getUntrusted: async (): Promise<ContentItem[]> => {
    try {
      const untrusted = MOCK_DB.filter(item => !item.isTrusted);
      const response = await fakeFetch(untrusted);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // 更新内容 (提交审核)
  // Partial<ContentItem> 表示我们只需要传递需要更新的字段，而不是整个对象
  updateItem: async (id: string, updates: Partial<ContentItem>): Promise<boolean> => {
     try {
       // 在内存数组中查找并更新 (模拟后端数据库更新)
       const index = MOCK_DB.findIndex(i => i.id === id);
       if (index !== -1) {
         MOCK_DB[index] = { ...MOCK_DB[index], ...updates, isTrusted: true };
         await fakeFetch(true); // 模拟网络请求
         return true;
       }
       return false;
     } catch (error) {
       console.error('API Error:', error);
       throw error;
     }
  },

  // 获取统计数据 (模拟)
  getStats: async (): Promise<{ items: number; words: number }> => {
    const items = MOCK_DB.length;
    const words = MOCK_DB.reduce((acc, i) => acc + (i.wordCount || 0), 0);
    const response = await fakeFetch({ items, words });
    return response.data;
  }
};