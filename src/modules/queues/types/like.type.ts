export type postType = {
  id: string;
  updatedAt?: any;
  createdAt?: any;
  deletedAt?: any;
  title: string;
  content: string;
  status: string;
};

export type likeType = {
  createdBy: string;
  post: postType;
};
