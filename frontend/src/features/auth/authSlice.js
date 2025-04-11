import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, registrarCliente, verificarToken } from '../../api/authApi';
import { saveSession, clearSession, getSession } from '../../utils/localStorage';

// Estado inicial
const initialState = {
  user: getSession().user || null,
  token: getSession().token || null,
  isAuthenticated: !!getSession().token,
  loading: false,
  error: null
};

// Thunks asíncronos
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await login(credentials);
      // Guardar en localStorage
      saveSession({ 
        user: response.usuario || response.user, 
        token: response.token 
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Error al iniciar sesión');
    }
  }
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registrarCliente(userData);
      // Guardar en localStorage
      saveSession({ 
        user: response.usuario || response.user, 
        token: response.token 
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Error al registrar usuario');
    }
  }
);

export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    clearSession();
    dispatch(logoutUser());
    return true;
  }
);

export const checkAuthStatusThunk = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await verificarToken();
      return response;
    } catch (error) {
      clearSession();
      return rejectWithValue(error.message || 'Sesión expirada');
    }
  }
);

// Slice de autenticación
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: (state) => {
      clearSession();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.usuario || action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Registro
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.usuario || action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Verificar token
      .addCase(checkAuthStatusThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthStatusThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.usuario || action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(checkAuthStatusThunk.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  }
});

export const { logoutUser, clearError } = authSlice.actions;
export default authSlice.reducer;