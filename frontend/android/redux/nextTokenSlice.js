import { createSlice } from '@reduxjs/toolkit';

const nextTokenSlice = createSlice({
  name: 'nextToken',
  initialState: '', 
  reducers: {
    setNextPageToken: (state, action) => action.payload,
    clearNextPageToken: (state) => '',
  },
});

export const { setNextPageToken, clearNextPageToken } = nextTokenSlice.actions;

export default nextTokenSlice.reducer;