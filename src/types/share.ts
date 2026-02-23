export type SocialKey =
  | "twitter"
  | "github"
  | "linkedin"
  | "youtube"
  | "facebook"
  | "instagram";


export type Share = {
  _id: string;
  sharedAt: string;
  platform: string;
  post: {
    _id: string;
    slug: string;
    title: string;
    coverImageUrl: string;
  };
};
