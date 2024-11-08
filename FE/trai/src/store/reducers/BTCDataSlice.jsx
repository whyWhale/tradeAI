import { createSlice } from '@reduxjs/toolkit';

const BTCDataSlice = createSlice({
    name: 'BTCData',
    initialState: null,
    reducers: {
      updateBTCData: (state, action) => action.payload,
    },
  });
  
  export const { updateBTCData } = BTCDataSlice.actions;
  export default BTCDataSlice.reducer;
