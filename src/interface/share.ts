export interface ShareResponse {
  _id: string;
  sharedAt?: string;
  createdAt: string;
  platform: string;
  postId: {
    _id: string;
    slug: string;
    title: string;
    coverImageUrl: string;
  };
}


export interface ShareDropdownProps {
  slug: string;
  title: string;
}