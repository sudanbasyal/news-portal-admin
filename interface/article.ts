export interface Article {
  id: number;
  title: string;
  image: string;
  content: string;
  viewCount: number;
  slug: string;
  status: "draft" | "published" | "archived";
  isBreaking: boolean;
  category: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  categoryId: number;
}

export interface ArticleResponse {
  data: Article[];
  length: number;
  map: (arg0: (article: any) => JSX.Element) => JSX.Element[];
  filter: (arg0: (article: any) => boolean) => any[];
}