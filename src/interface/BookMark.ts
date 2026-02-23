export interface BookmarkItem {
  _id: string;
  post: {
    _id: string;
    title: string;
    coverImageUrl: string;
  };
  createdAt: string;
}

export interface BookmarkResponse {
  _id: string;
  postId: {
    _id: string;
    title: string;
    coverImageUrl: string;
  };
  createdAt: string;
}