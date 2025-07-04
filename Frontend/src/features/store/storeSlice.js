// features/store/storeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bombs: [],
  defenseItems: [],
};

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    setStoreItems: (state, action) => {
      state.bombs = action.payload.bombs;
      state.defenseItems = action.payload.defenseItems;
    },
  },
});

export const { setStoreItems } = storeSlice.actions;
export default storeSlice.reducer;
