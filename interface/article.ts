import { Comment } from "./comment";

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
  comments: Comment[]; // Include comments here
}


export interface ArticleResponse {

  data: Article[];

  length: number;

  map: (arg0: (article: any) => { type: string; id: any }) => { type: string; id: any }[];

  filter: (arg0: (article: any) => boolean) => any[];

}


export interface ArticleApiResponse{
  message:string
  data:Article,
}