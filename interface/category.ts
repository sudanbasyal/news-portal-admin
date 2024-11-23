// export interface Category {
//     id: number;
//     name: string;
//   }
  
//   export interface CategoryResponse {
//     data: Category[];
//     message: string;
//     map: (arg0: (category: any) => JSX.Element) => JSX.Element[];
//     filter: (arg0: (category: any) => boolean) => any[];
//     length: number;
//   }
  
//   import { Comment } from "./comment";

export interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  
}


export interface CategoryResponse {

  data: Category[];

  length: number;

  map: (arg0: (category: any) => { type: string; id: any }) => { type: string; id: any }[];

  filter: (arg0: (category: any) => boolean) => any[];

}


export interface CategoryApiResponse{
  message:string
  data:Category,
}