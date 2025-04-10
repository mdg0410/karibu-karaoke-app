import mongoose from 'mongoose';
import { IMesa } from '../models/Mesa';
import { IMesaFilters, IMesaHistorial, IMesaResponse } from '../types/mesa';

/**
 * Transforma un documento de Mesa a un formato de respuesta API
 */
export const formatMesaResponse = (mesa: IMesa): IMesaResponse => {
  return {
    id: mesa._id.toString(),
    numero: mesa.numero,
    capacidad: mesa.capacidad,
    estado: mesa.estado,
    historial: mesa.historial?.map(h => ({
      usuarioId: h.usuarioId.toString(),
      fechaInicio: h.fechaInicio,
      fechaFin: h.fechaFin,
      estado: h.estado
    })),
    createdAt: mesa.createdAt,
    updatedAt: mesa.updatedAt
  };
};

/**
 * Formatea el historial de una mesa para respuesta de API
 */
export const formatearHistorial = (historial: any[]): IMesaHistorial[] => {
  return historial.map(item => ({
    usuarioId: item.usuarioId.toString(),
    fechaInicio: item.fechaInicio,
    fechaFin: item.fechaFin,
    estado: item.estado
  }));
};

/**
 * Valida si una capacidad de mesa es válida
 */
export const validarCapacidad = (capacidad: number): boolean => {
  return capacidad > 0 && capacidad <= 20; // Ejemplo de límite máximo
};

/**
 * Construye un objeto de filtro para consultas de MongoDB basado en los filtros proporcionados
 */
export const buildMesaFilterQuery = (filters: IMesaFilters): any => {
  const query: any = {};
  
  if (filters.estado) {
    query.estado = filters.estado;
  }
  
  if (filters.capacidadMin !== undefined || filters.capacidadMax !== undefined) {
    query.capacidad = {};
    
    if (filters.capacidadMin !== undefined) {
      query.capacidad.$gte = filters.capacidadMin;
    }
    
    if (filters.capacidadMax !== undefined) {
      query.capacidad.$lte = filters.capacidadMax;
    }
  }
  
  // Filtros para búsqueda en el historial
  if (filters.fechaDesde || filters.fechaHasta) {
    const historialQuery: any = {};
    
    if (filters.fechaDesde) {
      historialQuery['historial.fechaInicio'] = { $gte: filters.fechaDesde };
    }
    
    if (filters.fechaHasta) {
      historialQuery['historial.fechaFin'] = { $lte: filters.fechaHasta };
    }
    
    // Combinar con la consulta principal
    Object.assign(query, historialQuery);
  }
  
  return query;
};

/**
 * Verifica si una transición de estado es válida
 */
export const esTransicionEstadoValida = (estadoActual: string, nuevoEstado: string): boolean => {
  // Definir reglas de transición
  const transicionesValidas: Record<string, string[]> = {
    'disponible': ['ocupada', 'reservada'],
    'ocupada': ['disponible'],
    'reservada': ['disponible', 'ocupada']
  };
  
  return transicionesValidas[estadoActual]?.includes(nuevoEstado) || false;
};

/**
 * Calcula si una mesa está disponible en un rango de fechas
 */
export const verificarDisponibilidadEnRango = async (
  mesaId: string,
  fechaInicio: Date,
  fechaFin: Date
): Promise<boolean> => {
  // Aquí iría la lógica para verificar si la mesa tiene registros en el historial
  // que se solapen con el rango de fechas proporcionado
  
  // Ejemplo simplificado
  const Mesa = mongoose.model<IMesa>('Mesa');
  const mesa = await Mesa.findById(mesaId);
  
  if (!mesa) {
    return false;
  }
  
  // Si la mesa no está disponible actualmente
  if (mesa.estado !== 'disponible') {
    return false;
  }
  
  // Verificar solapamiento con registros existentes
  const tieneConflicto = mesa.historial.some(registro => {
    // Si el registro no tiene fechaFin (aún está en curso)
    if (!registro.fechaFin) {
      return true;
    }
    
    // Verificar si hay solapamiento entre los rangos
    return (
      (fechaInicio <= registro.fechaFin && fechaFin >= registro.fechaInicio)
    );
  });
  
  return !tieneConflicto;
}; 