// src/store.ts
import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import authReducer from './AuthSlice';

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
});

// Type for the Redux state
export type RootState = ReturnType<typeof rootReducer>;

// Redux persist configuration
const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store with persisted reducer
export const store = createStore(persistedReducer);
export const persistor = persistStore(store);
