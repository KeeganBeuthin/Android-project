import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  emails: null, // Initial state for emails
  loading: false,
  error: null,
};

const inboxSlice = createSlice({
  name: 'inbox',
  initialState,
  reducers: {
    fetchEmailsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchEmailsSuccess: (state, action) => {
      state.loading = false;
      state.emails = action.payload;
    },
    fetchEmailsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchEmailsRequest,
  fetchEmailsSuccess,
  fetchEmailsFailure,
} = inboxSlice.actions;

export default inboxSlice.reducer