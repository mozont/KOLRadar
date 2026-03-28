import config from './data/config.json';

export interface Influencer {
  id: string;
  name: string;
  avatar: string;
  tags: string[];
  price: number;
  followers: number;
  region: string;
  type: string;
  intro: string;
  fitScore: number;
  matchingFilters: string[];
  posts: Post[];
  avgViews: string;
}

export interface Post {
  id: string;
  images: string[];
  image?: string; // For compatibility
  title?: string; // For compatibility
  text: string;
  content?: string; // For compatibility
  date?: string; // For compatibility
  features: string[];
  views: number;
  comments: number;
  likes: number;
  matchAnalysis: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  influencers: Influencer[];
  createdAt: string;
}

export interface RejectionRecord {
  id: string;
  influencerId: string;
  influencer: Influencer;
  reason: string;
  timestamp: string;
}

export const CITIES = config.cities as {
  hot: string[];
  provinces: { name: string; cities: string[] }[];
};
export const CONTENT_TYPES = config.contentTypes;

export interface TagNode {
  id: string;
  name: string;
  children?: TagNode[];
}

export const TAG_TREE: TagNode[] = config.tagTree;

export const MOCK_INFLUENCERS: Influencer[] = Array.from({ length: 48 }).map((_, i) => ({
  id: `inf-${i}`,
  name: `达人_${i + 1}`,
  avatar: `https://picsum.photos/seed/avatar-${i}/200/200`,
  tags: [['时尚穿搭', 'Z世代'], ['美妆护肤', '高复购率'], ['科技数码', '爆文率高']][Math.floor(Math.random() * 3)],
  price: [1500, 3000, 8000, 25000, 70000, 120000][Math.floor(Math.random() * 6)],
  followers: [200000, 750000, 1500000, 2500000, 4000000, 8000000, 20000000, 50000000][Math.floor(Math.random() * 8)],
  region: CITIES.hot[Math.floor(Math.random() * CITIES.hot.length)],
  type: ['时尚', '美妆', '搞笑', '剧情', '萌宠', '科技数码', '运动健身', '美食'][Math.floor(Math.random() * 8)],
  intro: "这是一位极具潜力的内容创作者，擅长通过细腻的镜头语言和独特的视角吸引观众。在垂直领域拥有极高的忠诚粉丝群。",
  fitScore: 85 + Math.floor(Math.random() * 15),
  matchingFilters: ['高互动率', '内容优质', '调性契合', '转化极佳'],
  avgViews: (10 + Math.floor(Math.random() * 90)) + 'W+',
  posts: Array.from({ length: 3 }).map((_, j) => {
    const images = Array.from({ length: 4 }).map((_, k) => `https://picsum.photos/seed/post-${i}-${j}-${k}/600/800`);
    return {
      id: `post-${i}-${j}`,
      images,
      image: images[0],
      title: ["这个好物真的绝了！", "今日份穿搭分享", "我的宝藏护肤品", "周末去哪儿玩？", "科技改变生活"][Math.floor(Math.random() * 5)],
      text: "今天分享一个超级好用的好物！用了之后感觉整个人的生活品质都提升了。强烈推荐给大家，绝对不踩雷！#好物分享 #生活美学 #日常",
      content: "今天分享一个超级好用的好物！用了之后感觉整个人的生活品质都提升了。强烈推荐给大家，绝对不踩雷！#好物分享 #生活美学 #日常",
      date: "2024-03-20",
      features: ['构图精美', '色彩明快', '产品突出', '氛围感强'],
      views: 10000 + Math.floor(Math.random() * 90000),
      comments: 100 + Math.floor(Math.random() * 900),
      likes: 500 + Math.floor(Math.random() * 4500),
      matchAnalysis: "该笔记内容与搜索词高度匹配。笔记中提到的生活品质提升与用户追求的高端生活方式相契合，视觉风格也符合目标受众的审美偏好。产品展示自然，种草属性强。"
    };
  })
}));
