import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Article, ArticleResponse } from '../../interface/article';
import { api } from '../api';

export const articlesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllArticles: builder.query<ArticleResponse, void>({
      query: () => ({
        url: '/article/all',
        method: 'GET',
      }),
    }),
    getArticleById: builder.query<Article, number>({
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
    }),
    updateArticle: builder.mutation<Article, { id: number; articleData: FormData }>({
      query: ({ id, articleData }) => ({
        url: `/articleP/${id}`,
        method: 'PATCH',
        body: articleData,
      }),
    }),
    changeArticleStatus: builder.mutation<Article, { id: number; status: 'Draft' | 'Published' | 'Archived' }>({
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
