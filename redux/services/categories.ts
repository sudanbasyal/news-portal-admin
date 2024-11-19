
import { CategoryResponse } from '../../interface/category';
import { api } from '../api';

export const articlesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<CategoryResponse,void >({
      query: () => ({
        url: '/category/all',
        method: 'GET',
      }),
    }),
    
  }),
  overrideExisting: false, // Set to true if you want to override existing endpoints
});

export const {
    useGetCategoriesQuery,

} = articlesApi;
