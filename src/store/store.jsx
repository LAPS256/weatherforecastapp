import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import weatherReducer from '../slices/weatherSlice';
import { combineReducers } from 'redux';
import { weatherApi } from '../services/weatherApi';
const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  weather: weatherReducer,
  [weatherApi.reducerPath]: weatherApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(weatherApi.middleware),
});

const persistor = persistStore(store);

export { store, persistor };
