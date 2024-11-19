export interface Category {
    id: number;
    name: string;
  }
  
  export interface CategoryResponse {
    data: Category[];
    message: string;
    map: (arg0: (category: any) => JSX.Element) => JSX.Element[];
    filter: (arg0: (category: any) => boolean) => any[];
    length: number;
  }
  