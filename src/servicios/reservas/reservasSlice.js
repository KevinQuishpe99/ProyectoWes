import { createSlice } from '@reduxjs/toolkit';

const reservasSlice = createSlice({
  name: 'reservas',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
});

export default reservasSlice.reducer; 
