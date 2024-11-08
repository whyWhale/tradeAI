import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  holdCount: 0,
  buyCount: 0,
  sellCount: 0,
  totalCount: 0,
};

const decisionCountSlice = createSlice({
  name: 'count',
  initialState,
  reducers: {
    setCounts: (state, action) => {
      state.holdCount = action.payload.hold;
      state.buyCount = action.payload.buy;
      state.sellCount = action.payload.sell;
      state.totalCount = action.payload.hold + action.payload.buy + action.payload.sell;
    },
  },
});

export const { setCounts } = decisionCountSlice.actions;
export default decisionCountSlice.reducer;
