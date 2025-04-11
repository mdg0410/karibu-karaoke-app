import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import mesaReducer from '../features/mesas/mesaSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    mesa: mesaReducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
    })
});

export default store;
