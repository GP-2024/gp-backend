export type Post = {
  id: string;
  createdAt: Date;
  title: string;
  content: string;
  status: 'drafted' | 'published';
  liked: boolean;
};
