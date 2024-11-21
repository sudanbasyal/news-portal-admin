import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api"; // Import your RTK Query API
import dashboardSlice from "./features/dashboard"; // Import your slice
export const store = configureStore({
  reducer: {
    dashboard : dashboardSlice,
    // Add your API reducer here
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware), // Ensure api.middleware is added
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
