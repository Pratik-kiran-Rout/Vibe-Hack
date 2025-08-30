export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  bio?: string;
  avatar?: string;
  followers?: string[];
  following?: string[];
  readingList?: any[];
  newsletterSubscription?: boolean;
}

export interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    username: string;
    avatar?: string;
    bio?: string;
  };
  status: string;
  createdAt: string;
  views: number;
  likes: any[];
  comments: any[];
  readTime: number;
  tags: string[];
  category: string;
  featuredImage?: string;
  isDraft: boolean;
  series?: {
    name: string;
    part: number;
  };
  shares?: number;
}