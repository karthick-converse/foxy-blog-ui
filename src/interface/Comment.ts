export interface CommentType {
  _id: string;
  authorId: {
    _id: string;
    name: string;
  };
  body: string;
  status: string;
  createdAt: string;
  replays: CommentType[];
}

export interface CommentItemProps {
  comment: CommentType;
  depth?: number;
  blogId: string;
}
