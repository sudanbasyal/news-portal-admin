import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DashboardState {
    selectedItem: number | null;
}

const initialState: DashboardState = {
    selectedItem: null,
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
      setSelectedItem: (state, action: PayloadAction<number>) => {
        state.selectedItem = action.payload;
      }  
    },
});

export const { setSelectedItem } = dashboardSlice.actions;

export default dashboardSlice.reducer;