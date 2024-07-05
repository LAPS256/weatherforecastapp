import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  weatherData: null,
  fiveDaysData: null,
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setWeatherData: (state, action) => {
      state.weatherData = action.payload;
    },
    setFiveDaysData: (state, action) => {
      state.fiveDaysData = action.payload;
    },
  },
});

export const { setWeatherData, setFiveDaysData } = weatherSlice.actions;
export default weatherSlice.reducer;
