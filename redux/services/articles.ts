import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Article, ArticleApiResponse, ArticleResponse } from '../../interface/article';
import { api } from '../api';


export const articlesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllArticles: builder.query<ArticleResponse, void>({
      query: () => ({
        url: '/article/all',
        method: 'GET',
      }),
      providesTags: [ { type: 'Article', id: 'LIST' }],
    }),
    getArticleById: builder.query<ArticleApiResponse, string>({
      query: (id) => ({
        url: `/article/${id}`,
        method: 'GET',
      }),
    }),
    createArticle: builder.mutation<Article,FormData>({
      query: (articleData) => ({
        url: '/article/create',
        method: 'POST',
        body: articleData,
      }),
      invalidatesTags: [{ type: 'Article', id: 'LIST' }],
    }),
    updateArticle: builder.mutation<Article, { id: string; articleData: FormData }>({
      query: ({ id, articleData }) =>  ({
          url: `/article/${id}`,
          method: 'PATCH',
          body: articleData,
        }),
        invalidatesTags:[ { type: 'Article', id: 'LIST' }],
      
    }),
    changeArticleStatus: builder.mutation<Article, { id: number; status: 'draft' | 'published' | 'archived' }>({
      query: ({ id, status }) => ({
        url: `/article/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
    }),
  }),
  overrideExisting: false, // Set to true if you want to override existing endpoints
});

export const {
  useGetAllArticlesQuery,
  useGetArticleByIdQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useChangeArticleStatusMutation,
} = articlesApi;
