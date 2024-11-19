import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api"; // Import your RTK Query API

export const store = configureStore({
  reducer: {
    // Add your API reducer here
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware), // Ensure api.middleware is added
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
