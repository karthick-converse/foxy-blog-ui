import type { ReactionType } from "../types/reaction.type";

export interface Blog {
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: {
    url: string;
  };
  category?: {
    name: string;
  };
  author?: {
    name: string;
  };
  tags?: Array<{ name: string }>;
  createdAt: string;
}


export interface SingleBlog {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  coverImageUrl: string;
  galleryImageUrls?: string[];
  createdAt: string;
  category: {
    name: string;
  };
  author: {
    name: string;
  };
  stats: {
    views: number;
    reactions: {
      breakdown: Record<ReactionType, number>;
    };
  };
  relatedPosts: Array<{
    _id: string;
    slug: string;
    title: string;
    coverImageUrl: string;
    createdAt: string;
    category?: {
      name: string;
    };
  }>;
}


export interface BlogCard {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: {
    url: string;
  };
  category?: {
    name: string;
  };
  author?: {
    name: string;
  };
  tags?: Array<{
    _id?: string;
    id?: string;
    name: string;
  }>;
  stats?: {
    totalViews?: number;
    totalComments?: number;
    total?: number;
    breakdown?: Record<ReactionType, number>;
  };
  userReaction?: ReactionType | null;
}


export interface AdminBlog {
  _id: string;
  title: string;
  coverImageUrl: string;
  slug: string;
  status: string;
  createdAt: string;
  isDeleted: boolean;
  authorId: { name: string };
  categoryId: { name: string };
}