import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMesas, getMesaById, validarMesa, updateMesa, crearMesa, cambiarEstadoMesa } from '../../api/mesaApi';
import { saveSession, getSession } from '../../utils/localStorage';

// Estado inicial
const initialState = {
  mesas: [],
  mesaActual: null,
  mesaId: getSession().mesaId || null,
  loading: false,
  error: null,
  mesaValidada: false
};

// Thunks asíncronos
export const fetchMesas = createAsyncThunk(
  'mesa/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMesas();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Error al obtener mesas');
    }
  }
);

export const fetchMesaById = createAsyncThunk(
  'mesa/fetchById',
  async (mesaId, { rejectWithValue }) => {
    try {
      const response = await getMesaById(mesaId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Error al obtener la mesa');
    }
  }
);

export const validarMesaThunk = createAsyncThunk(
  'mesa/validar',
  async (mesaIdentificador, { rejectWithValue }) => {
    try {
      console.log("Iniciando validarMesaThunk con:", mesaIdentificador);
      const response = await validarMesa(mesaIdentificador);
      console.log("Respuesta de validarMesa:", response);
      
      // Solo guardar en sesión si la mesa está disponible
      if (response.disponible) {
        saveSession({ mesaId: response.mesa.id });
      }
      return response;
    } catch (error) {
      console.error('Error en validarMesaThunk:', error);
      return rejectWithValue(
        error.message || 
        (error.response?.data?.message) || 
        'Error al validar la mesa'
      );
    }
  }
);

export const actualizarMesa = createAsyncThunk(
  'mesa/actualizar',
  async ({ mesaId, mesaData }, { rejectWithValue }) => {
    try {
      const response = await updateMesa(mesaId, mesaData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Error al actualizar la mesa');
    }
  }
);

export const actualizarEstadoMesa = createAsyncThunk(
  'mesa/actualizarEstado',
  async ({ mesaId, estado }, { rejectWithValue }) => {
    try {
      const response = await cambiarEstadoMesa(mesaId, estado);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Error al actualizar el estado de la mesa');
    }
  }
);

export const crearNuevaMesa = createAsyncThunk(
  'mesa/crear',
  async (mesaData, { rejectWithValue }) => {
    try {
      const response = await crearMesa(mesaData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Error al crear la mesa');
    }
  }
);

// Slice de mesas
const mesaSlice = createSlice({
  name: 'mesa',
  initialState,
  reducers: {
    setMesaId: (state, action) => {
      state.mesaId = action.payload;
      saveSession({ mesaId: action.payload });
    },
    clearMesaError: (state) => {
      state.error = null;
    },
    resetMesaValidacion: (state) => {
      state.mesaValidada = false;
    },
    clearMesaActual: (state) => {
      state.mesaActual = null;
      state.mesaId = null;
      const session = getSession();
      delete session.mesaId;
      saveSession(session);
    }
  },
  extraReducers: (builder) => {
    builder
      // Obtener todas las mesas
      .addCase(fetchMesas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMesas.fulfilled, (state, action) => {
        state.loading = false;
        state.mesas = action.payload;
      })
      .addCase(fetchMesas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Obtener mesa por ID
      .addCase(fetchMesaById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMesaById.fulfilled, (state, action) => {
        state.loading = false;
        state.mesaActual = action.payload;
      })
      .addCase(fetchMesaById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Validar mesa
      .addCase(validarMesaThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.mesaValidada = false;
      })
      .addCase(validarMesaThunk.fulfilled, (state, action) => {
        state.loading = false;
        console.log("validarMesaThunk.fulfilled:", action.payload);
        if (action.payload && action.payload.disponible) {
          state.mesaValidada = true;
          // Usar el ID real de la mesa (ObjectID), no el número
          state.mesaId = action.payload.mesa.id;
          state.mesaActual = action.payload.mesa;
        } else {
          state.mesaValidada = false;
          state.error = 'Esta mesa no está disponible. Por favor, selecciona otra.';
        }
      })
      .addCase(validarMesaThunk.rejected, (state, action) => {
        state.loading = false;
        console.log("validarMesaThunk.rejected:", action.payload);
        state.error = action.payload;
        state.mesaValidada = false;
      })
      
      // Actualizar mesa
      .addCase(actualizarMesa.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actualizarMesa.fulfilled, (state, action) => {
        state.loading = false;
        state.mesaActual = action.payload;
        
        // Actualizar también en la lista completa de mesas
        const index = state.mesas.findIndex(mesa => mesa.id === action.payload.id);
        if (index !== -1) {
          state.mesas[index] = action.payload;
        }
      })
      .addCase(actualizarMesa.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Actualizar estado de mesa
      .addCase(actualizarEstadoMesa.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actualizarEstadoMesa.fulfilled, (state, action) => {
        state.loading = false;
        state.mesaActual = action.payload;
        
        // Actualizar también en la lista completa de mesas
        const index = state.mesas.findIndex(mesa => mesa.id === action.payload.id);
        if (index !== -1) {
          state.mesas[index] = action.payload;
        }
      })
      .addCase(actualizarEstadoMesa.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Crear nueva mesa
      .addCase(crearNuevaMesa.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(crearNuevaMesa.fulfilled, (state, action) => {
        state.loading = false;
        state.mesas.push(action.payload);
      })
      .addCase(crearNuevaMesa.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setMesaId, clearMesaError, resetMesaValidacion, clearMesaActual } = mesaSlice.actions;
export default mesaSlice.reducer;