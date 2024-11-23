
import { Category, CategoryResponse } from '../../interface/category';
import { api } from '../api';

export const categoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<CategoryResponse,void >({
      query: () => ({
        url: '/category/all',
        method: 'GET',
      }),
    }),
    createCategory: builder.mutation<Category, {name:string}>({
      query: (categoryData) => ({
        url: '/category/create',
        method: 'POST',
        body:categoryData,
      }),
    }),
    getCategoryById: builder.query<CategoryResponse, number>({
      query: (id) => ({
        url: `/category/${id}`,
        method: 'GET',
      }),
    }),
    updateCategory: builder.mutation<Category, { id: number; name: string }>({
      query: ({ id, name }) => ({
        url: `/category/${id}`,
        method: 'PATCH',
        body: {name},
      }),
    }),
    deleteCategory: builder.mutation<Category, number>({
      query: (id) => ({
        url: `/category/${id}`,
        method: 'DELETE',
      }),
    })
  }),
  overrideExisting: false, // Set to true if you want to override existing endpoints
});

export const {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useGetCategoryByIdQuery,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation
} = categoryApi;
