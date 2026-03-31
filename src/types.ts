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

export interface ImageAnalysis {
  noteId: string;
  description: string;
  labels: string[];
  face: string;
  skinCondition: string;
  hasBeforeAfter: boolean;
  hasProduct: boolean;
  productDetail: string;
  contentForm: string;
  visualStyle: string;
}

export interface CommentReply {
  commentId: string;
  userId: string;
  nickName: string;
  content: string;
  date: string;
  location: string;
  likeCount: string;
}

export interface NoteComment {
  commentId: string;
  userId: string;
  nickName: string;
  content: string;
  date: string;
  location: string;
  likeCount: string;
  replies: CommentReply[];
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
  imageAnalysis?: ImageAnalysis;
  noteComments?: NoteComment[];
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

export type ContactStatus = 'waiting_follow' | 'contacting' | 'no_reply' | 'accepted' | 'declined' | 'need_human' | 'completed';

export interface ChatMessage {
  sender: 'service' | 'influencer' | 'system';
  content: string;
  time: string;
}

export interface ContactRecord {
  id: string;
  influencer: Influencer;
  projectName: string;
  status: ContactStatus;
  messages: ChatMessage[];
}

export type DMStatus = 'pending' | 'sending' | 'sent' | 'replied' | 'no_reply';

export interface DMRecord {
  id: string;
  influencer: Influencer;
  projectName: string;
  post: Post;
  comment: string;
  status: DMStatus;
}

export type ScriptCategory = 'greeting' | 'project_intro' | 'no_reply_followup' | 'declined' | 'accepted' | 'price_rejected';

export interface ScriptTemplates {
  greeting: string;
  project_intro: string;
  no_reply_followup: string;
  declined: string;
  accepted: string;
  price_rejected: string;
}

export const CITIES = config.cities as {
  hot: string[];
  provinces: { name: string; cities: string[] }[];
};
export const INFLUENCER_TYPES = (config as any).influencerTypes as string[];

export interface TagChild {
  label: string;
  checked: boolean;
  prompt?: string;
}

export interface TagGroup {
  label: string;
  children: TagChild[];
}

export const TAG_TREE: TagGroup[] = (config as any).tagTree;

// 真实数据（从爬取的小红书数据转换）
export { REAL_INFLUENCERS } from './data/realInfluencers';

// 保留 MOCK 作为 fallback，指向真实数据
import { REAL_INFLUENCERS as _REAL } from './data/realInfluencers';
export const MOCK_INFLUENCERS: Influencer[] = _REAL;
