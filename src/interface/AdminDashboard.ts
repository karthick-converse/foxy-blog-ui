export interface Blog {
  _id: string;
  title: string;
  status: string;
  createdAt: string;
  authorId?: {
    name: string;
  };
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  authProvider: string;
  isVerified: boolean;
  isBlocked: boolean;
  createdAt: string;
}


export interface Report {
  createdAt: string;
}

export interface ChartData {
  date: string;
  count: number;
}

export interface DashboardData {
  stats: {
    totalUsers: number;
    totalBlogs: number;
    publishedBlogs: number;
    draftBlogs: number;
    totalViews: number;
    totalReactions: number;
    totalComments: number;
  };
  recentBlogs: Blog[];
  recentUsers: User[];
  reports: Report[];
}