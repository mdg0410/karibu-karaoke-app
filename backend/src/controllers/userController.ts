import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import { IUserFilters, IUserPaginationOptions } from '../types/user';
import {
  buildUserFilterQuery,
  formatUserResponse,
  encriptarPassword,
  compararPassword,
  generarAuthResponse
} from '../utils/userUtils';

// Registro de usuario
export const registro = async (req: Request, res: Response) => {
  try {
    const { nombre, email, password, telefono, rol = 'cliente' } = req.body;
    
    // Encriptar contraseña
    const passwordEncriptada = await encriptarPassword(password);
    
    // Crear nuevo usuario
    const nuevoUsuario = new User({
      nombre,
      email,
      password: passwordEncriptada,
      telefono,
      rol
    });
    
    // Guardar en la base de datos
    await nuevoUsuario.save();
    
    // Generar respuesta con token JWT
    const authResponse = generarAuthResponse(nuevoUsuario);
    
    return res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      ...authResponse
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al registrar el usuario',
      error: (error as Error).message
    });
  }
};

// Login de usuario
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuario por email
    const usuario = await User.findOne({ email });
    
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    // Verificar contraseña
    const passwordValida = await compararPassword(password, usuario.password);
    
    if (!passwordValida) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    // Generar respuesta con token JWT
    const authResponse = generarAuthResponse(usuario);
    
    return res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      ...authResponse
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: (error as Error).message
    });
  }
};

// Obtener perfil de usuario
export const getPerfil = async (req: Request, res: Response) => {
  try {
    // req.user está disponible gracias al middleware verificarToken
    const userId = (req as any).user.id;
    
    const usuario = await User.findById(userId).select('-password');
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    // Formatear respuesta
    const formattedUser = formatUserResponse(usuario);
    
    return res.status(200).json({
      success: true,
      usuario: formattedUser
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el perfil',
      error: (error as Error).message
    });
  }
};

// Obtener todos los usuarios con filtros y paginación
export const getUsuarios = async (req: Request, res: Response) => {
  try {
    // Extraer parámetros de consulta
    const filters: IUserFilters = {
      nombre: req.query.nombre as string,
      email: req.query.email as string,
      rol: req.query.rol as 'cliente' | 'trabajador' | 'admin',
      fechaDesde: req.query.fechaDesde ? new Date(req.query.fechaDesde as string) : undefined,
      fechaHasta: req.query.fechaHasta ? new Date(req.query.fechaHasta as string) : undefined
    };

    // Opciones de paginación
    const paginationOptions: IUserPaginationOptions = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      sortBy: req.query.sortBy as string || 'nombre',
      order: (req.query.order as 'asc' | 'desc') || 'asc'
    };

    // Construir query de filtros
    const filterQuery = buildUserFilterQuery(filters);
    
    // Ejecutar consulta con paginación
    const skip = (paginationOptions.page - 1) * paginationOptions.limit;
    
    // Ordenamiento
    const sortOption: any = {};
    sortOption[paginationOptions.sortBy || 'nombre'] = paginationOptions.order === 'asc' ? 1 : -1;
    
    // Obtener total de documentos para la paginación
    const total = await User.countDocuments(filterQuery);
    
    // Obtener usuarios con los filtros aplicados
    const usuarios = await User.find(filterQuery)
      .select('-password')
      .sort(sortOption)
      .skip(skip)
      .limit(paginationOptions.limit);
    
    // Calcular total de páginas
    const totalPages = Math.ceil(total / paginationOptions.limit);
    
    // Formatear respuesta
    const formattedUsuarios = usuarios.map(user => formatUserResponse(user));
    
    return res.status(200).json({
      success: true,
      usuarios: formattedUsuarios,
      pagination: {
        total,
        page: paginationOptions.page,
        limit: paginationOptions.limit,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los usuarios',
      error: (error as Error).message
    });
  }
};

// Obtener un usuario por ID
export const getUsuarioById = async (req: Request, res: Response) => {
  try {
    // Si el usuario ya fue encontrado por el middleware, usarlo
    const usuario = (req as any).usuarioEncontrado || await User.findById(req.params.id).select('-password');
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    // Formatear la respuesta
    const formattedUser = formatUserResponse(usuario);
    
    return res.status(200).json({
      success: true,
      usuario: formattedUser
    });
  } catch (error) {
    console.error('Error al obtener usuario por ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el usuario',
      error: (error as Error).message
    });
  }
};

// Actualizar un usuario
export const updateUsuario = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { nombre, email, telefono, rol, password } = req.body;
    
    // Buscar el usuario
    const usuario = await User.findById(userId);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    // Actualizar campos
    if (nombre) usuario.nombre = nombre;
    if (email) usuario.email = email;
    if (telefono) usuario.telefono = telefono;
    if (rol) usuario.rol = rol;
    
    // Si se proporciona una nueva contraseña, encriptarla
    if (password) {
      usuario.password = await encriptarPassword(password);
    }
    
    // Guardar cambios
    await usuario.save();
    
    // Formatear la respuesta
    const formattedUser = formatUserResponse(usuario);
    
    return res.status(200).json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      usuario: formattedUser
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el usuario',
      error: (error as Error).message
    });
  }
};

// Cambiar contraseña
export const cambiarPassword = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { currentPassword, newPassword } = req.body;
    
    // Buscar el usuario
    const usuario = await User.findById(userId);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    // Verificar la contraseña actual
    const passwordValida = await compararPassword(currentPassword, usuario.password);
    
    if (!passwordValida) {
      return res.status(401).json({
        success: false,
        message: 'La contraseña actual es incorrecta'
      });
    }
    
    // Encriptar y actualizar la nueva contraseña
    usuario.password = await encriptarPassword(newPassword);
    
    // Guardar cambios
    await usuario.save();
    
    return res.status(200).json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al cambiar la contraseña',
      error: (error as Error).message
    });
  }
};

// Eliminar un usuario
export const deleteUsuario = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    
    const resultado = await User.findByIdAndDelete(userId);
    
    if (!resultado) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar el usuario',
      error: (error as Error).message
    });
  }
}; 