import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import useAuth from '../../hooks/useAuth';
import useMesa from '../../hooks/useMesa';
import { getUsuarios, crearUsuario } from '../../api/userApi';
import Alert from '../../components/common/Alert';
import Loader from '../../components/common/Loader';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('mesas');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [newMesaForm, setNewMesaForm] = useState({
    numero: '',
    capacidad: '',
    estado: 'disponible'
  });
  const [newUserForm, setNewUserForm] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'trabajador',
    celular: ''
  });
  
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { 
    mesas, 
    obtenerMesas, 
    actualizarDatosMesa, 
    crearNuevaMesa,
    loading: mesaLoading 
  } = useMesa();

  useEffect(() => {
    // Verificar si el usuario está autenticado como admin
    if (!isAuthenticated || !user) {
      navigate('/admin/login');
      return;
    }

    if (user.rol !== 'admin') {
      navigate('/');
      return;
    }

    // Cargar lista de mesas
    obtenerMesas().catch(err => {
      setError('Error al cargar las mesas');
    });

    // Cargar lista de usuarios
    fetchUsuarios();
  }, [isAuthenticated, user, navigate]);

  const fetchUsuarios = async () => {
    setLoadingUsuarios(true);
    try {
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (err) {
      setError('Error al cargar usuarios');
    } finally {
      setLoadingUsuarios(false);
    }
  };

  const handleCambiarEstadoMesa = async (mesaId, nuevoEstado) => {
    try {
      await actualizarDatosMesa(mesaId, { estado: nuevoEstado });
      setSuccess(`Mesa ${mesaId} actualizada a: ${nuevoEstado}`);
      
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(`Error al actualizar la mesa ${mesaId}`);
    }
  };

  const handleNewMesaChange = (e) => {
    const { name, value } = e.target;
    setNewMesaForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUserForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateMesa = async (e) => {
    e.preventDefault();
    
    if (!newMesaForm.numero || !newMesaForm.capacidad) {
      setError('Todos los campos son obligatorios');
      return;
    }
    
    try {
      await crearNuevaMesa({
        numero: newMesaForm.numero,
        capacidad: parseInt(newMesaForm.capacidad),
        estado: newMesaForm.estado
      });
      
      setSuccess('Mesa creada correctamente');
      setNewMesaForm({
        numero: '',
        capacidad: '',
        estado: 'disponible'
      });
      
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError('Error al crear la mesa');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    if (!newUserForm.nombre || !newUserForm.email || !newUserForm.password || !newUserForm.rol) {
      setError('Los campos nombre, email, contraseña y rol son obligatorios');
      return;
    }
    
    try {
      await crearUsuario(newUserForm);
      
      setSuccess('Usuario creado correctamente');
      setNewUserForm({
        nombre: '',
        email: '',
        password: '',
        rol: 'trabajador',
        celular: ''
      });
      
      fetchUsuarios();
      setShowNewUserForm(false);
      
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError('Error al crear el usuario');
    }
  };

  if (authLoading || mesaLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <Loader text="Cargando información..." />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6 bg-karaoke-gray p-5 rounded-xl shadow-neumorph">
          <div className="flex flex-wrap justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-primary">Panel de Administración</h2>
              <p className="text-primary-light mt-1">
                Admin: <span className="font-semibold">{user?.nombre}</span>
              </p>
            </div>
          </div>
        </div>

        {error && (
          <Alert 
            type="error" 
            message={error} 
            className="mb-4"
            onClose={() => setError('')}
          />
        )}

        {success && (
          <Alert 
            type="success" 
            message={success} 
            className="mb-4"
            onClose={() => setSuccess('')}
          />
        )}

        <div className="mb-6">
          <div className="flex border-b border-karaoke-darkgray">
            <button
              className={`px-4 py-2 ${activeTab === 'mesas' ? 'text-primary border-b-2 border-primary' : 'text-primary-light'}`}
              onClick={() => setActiveTab('mesas')}
            >
              Gestión de Mesas
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'usuarios' ? 'text-primary border-b-2 border-primary' : 'text-primary-light'}`}
              onClick={() => setActiveTab('usuarios')}
            >
              Gestión de Usuarios
            </button>
          </div>
        </div>

        {activeTab === 'mesas' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-primary">Listado de Mesas</h3>
              <button
                onClick={() => setNewMesaForm({
                  numero: '',
                  capacidad: '',
                  estado: 'disponible'
                })}
                className="px-4 py-2 bg-karaoke-darkgray text-primary font-semibold rounded-lg shadow-neumorph hover:shadow-neumorph-inset transition-all duration-300"
              >
                Nueva Mesa
              </button>
            </div>

            <div className="mb-6 bg-karaoke-gray p-4 rounded-xl shadow-neumorph">
              <form onSubmit={handleCreateMesa} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="numero" className="block text-sm font-medium text-primary-light mb-1">
                    Número de Mesa
                  </label>
                  <input
                    type="text"
                    id="numero"
                    name="numero"
                    value={newMesaForm.numero}
                    onChange={handleNewMesaChange}
                    className="w-full px-3 py-2 bg-karaoke-darkgray text-white rounded-lg shadow-neumorph-inset focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                    placeholder="Ej. M001"
                  />
                </div>
                <div>
                  <label htmlFor="capacidad" className="block text-sm font-medium text-primary-light mb-1">
                    Capacidad
                  </label>
                  <input
                    type="number"
                    id="capacidad"
                    name="capacidad"
                    value={newMesaForm.capacidad}
                    onChange={handleNewMesaChange}
                    className="w-full px-3 py-2 bg-karaoke-darkgray text-white rounded-lg shadow-neumorph-inset focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                    placeholder="Número de personas"
                  />
                </div>
                <div>
                  <label htmlFor="estado" className="block text-sm font-medium text-primary-light mb-1">
                    Estado
                  </label>
                  <select
                    id="estado"
                    name="estado"
                    value={newMesaForm.estado}
                    onChange={handleNewMesaChange}
                    className="w-full px-3 py-2 bg-karaoke-darkgray text-white rounded-lg shadow-neumorph-inset focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                  >
                    <option value="disponible">Disponible</option>
                    <option value="ocupada">Ocupada</option>
                    <option value="mantenimiento">Mantenimiento</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-karaoke-darkgray text-primary font-semibold rounded-lg shadow-neumorph hover:shadow-neumorph-inset transition-all duration-300"
                  >
                    Crear Mesa
                  </button>
                </div>
              </form>
            </div>
            
            <div className="overflow-x-auto bg-karaoke-gray rounded-xl shadow-neumorph">
              <table className="min-w-full divide-y divide-karaoke-darkgray">
                <thead className="bg-karaoke-darkgray">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                      Número
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                      Estado
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                      Capacidad
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-karaoke-gray divide-y divide-karaoke-darkgray">
                  {mesas && mesas.length > 0 ? (
                    mesas.map((mesa) => (
                      <tr key={mesa.id} className="hover:bg-karaoke-darkgray/30">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {mesa.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {mesa.numero}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${mesa.estado === 'disponible' ? 'bg-green-100 text-green-800' : 
                              mesa.estado === 'ocupada' ? 'bg-red-100 text-red-800' : 
                              mesa.estado === 'mantenimiento' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-gray-100 text-gray-800'}`}>
                            {mesa.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {mesa.capacidad}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {mesa.estado !== 'disponible' && (
                              <button
                                onClick={() => handleCambiarEstadoMesa(mesa.id, 'disponible')}
                                className="text-green-400 hover:text-green-600 transition-colors"
                              >
                                Disponible
                              </button>
                            )}
                            {mesa.estado !== 'ocupada' && (
                              <button
                                onClick={() => handleCambiarEstadoMesa(mesa.id, 'ocupada')}
                                className="text-red-400 hover:text-red-600 transition-colors"
                              >
                                Ocupada
                              </button>
                            )}
                            {mesa.estado !== 'mantenimiento' && (
                              <button
                                onClick={() => handleCambiarEstadoMesa(mesa.id, 'mantenimiento')}
                                className="text-yellow-400 hover:text-yellow-600 transition-colors"
                              >
                                Mantenimiento
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-white">
                        No hay mesas disponibles
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'usuarios' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-primary">Usuarios del Sistema</h3>
              <button
                onClick={() => setShowNewUserForm(!showNewUserForm)}
                className="px-4 py-2 bg-karaoke-darkgray text-primary font-semibold rounded-lg shadow-neumorph hover:shadow-neumorph-inset transition-all duration-300"
              >
                {showNewUserForm ? 'Cancelar' : 'Nuevo Usuario'}
              </button>
            </div>

            {showNewUserForm && (
              <div className="mb-6 bg-karaoke-gray p-4 rounded-xl shadow-neumorph">
                <h4 className="text-lg font-semibold text-primary mb-4">Crear Nuevo Usuario</h4>
                <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-primary-light mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={newUserForm.nombre}
                      onChange={handleNewUserChange}
                      className="w-full px-3 py-2 bg-karaoke-darkgray text-white rounded-lg shadow-neumorph-inset focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                      placeholder="Nombre completo"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-primary-light mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={newUserForm.email}
                      onChange={handleNewUserChange}
                      className="w-full px-3 py-2 bg-karaoke-darkgray text-white rounded-lg shadow-neumorph-inset focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-primary-light mb-1">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={newUserForm.password}
                      onChange={handleNewUserChange}
                      className="w-full px-3 py-2 bg-karaoke-darkgray text-white rounded-lg shadow-neumorph-inset focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label htmlFor="rol" className="block text-sm font-medium text-primary-light mb-1">
                      Rol
                    </label>
                    <select
                      id="rol"
                      name="rol"
                      value={newUserForm.rol}
                      onChange={handleNewUserChange}
                      className="w-full px-3 py-2 bg-karaoke-darkgray text-white rounded-lg shadow-neumorph-inset focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                    >
                      <option value="trabajador">Trabajador</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="celular" className="block text-sm font-medium text-primary-light mb-1">
                      Celular (opcional)
                    </label>
                    <input
                      type="tel"
                      id="celular"
                      name="celular"
                      value={newUserForm.celular}
                      onChange={handleNewUserChange}
                      className="w-full px-3 py-2 bg-karaoke-darkgray text-white rounded-lg shadow-neumorph-inset focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                      placeholder="9 dígitos"
                      maxLength={9}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-karaoke-darkgray text-primary font-semibold rounded-lg shadow-neumorph hover:shadow-neumorph-inset transition-all duration-300"
                    >
                      Crear Usuario
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {loadingUsuarios ? (
              <div className="text-center py-8">
                <Loader text="Cargando usuarios..." />
              </div>
            ) : (
              <div className="overflow-x-auto bg-karaoke-gray rounded-xl shadow-neumorph">
                <table className="min-w-full divide-y divide-karaoke-darkgray">
                  <thead className="bg-karaoke-darkgray">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                        Nombre
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                        Rol
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                        Celular
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-karaoke-gray divide-y divide-karaoke-darkgray">
                    {usuarios && usuarios.length > 0 ? (
                      usuarios.map((usuario) => (
                        <tr key={usuario.id} className="hover:bg-karaoke-darkgray/30">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                            {usuario.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                            {usuario.nombre}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                            {usuario.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${usuario.rol === 'admin' ? 'bg-purple-100 text-purple-800' : 
                                usuario.rol === 'trabajador' ? 'bg-blue-100 text-blue-800' : 
                                'bg-gray-100 text-gray-800'}`}>
                              {usuario.rol}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                            {usuario.celular || '-'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-white">
                          No hay usuarios registrados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPanel;