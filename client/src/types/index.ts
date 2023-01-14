export type TArticleMeta = {
  _id: string;
  title: string;
  topic: string;
  author: TAuthor;
  likes: string[];
  createdAt: Date;
  comment_count: number;
  like_count: number;
  id: string;
};

export type TArticle = TArticleMeta & { text: string };

export type TAuthor = {
  _id: string;
  avatar: string;
  role: 'user' | 'admin';
  username: string;
  token: string;
  createdAt: Date;
};

export type TState = {
  articles: TArticleMeta[];
  error: string;
  loading: boolean;
  user: TAuthor;
  getArticles(page?: number, limit?: number): Promise<void>;
  setUser(user: TAuthor): void;
};
