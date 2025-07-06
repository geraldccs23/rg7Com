import React, { useState, useEffect } from 'react';
import { Settings, Users, Plus, Edit, Trash2, Shield, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { UserProfile, CreateUserData } from '../../types/auth';
import { getAllUsers, createUser, updateUser, deleteUser } from '../../lib/auth';
import { CreateUserModal } from './CreateUserModal';
import { EditUserModal } from './EditUserModal';

export function SettingsPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const usersData = await getAllUsers();
      setUsers(usersData);
    } catch (error) {
      showNotification('error', 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData: CreateUserData) => {
    try {
      const result = await createUser(userData);
      if (result.success) {
        showNotification('success', 'Usuario creado exitosamente');
        setShowCreateModal(false);
        await loadUsers();
      } else {
        showNotification('error', result.error || 'Error al crear usuario');
      }
    } catch (error) {
      showNotification('error', 'Error al crear usuario');
    }
  };

  const handleUpdateUser = async (userId: string, updates: Partial<UserProfile>) => {
    try {
      const result = await updateUser(userId, updates);
      if (result.success) {
        showNotification('success', 'Usuario actualizado exitosamente');
        setEditingUser(null);
        await loadUsers();
      } else {
        showNotification('error', result.error || 'Error al actualizar usuario');
      }
    } catch (error) {
      showNotification('error', 'Error al actualizar usuario');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      return;
    }

    try {
      const result = await deleteUser(userId);
      if (result.success) {
        showNotification('success', 'Usuario eliminado exitosamente');
        await loadUsers();
      } else {
        showNotification('error', result.error || 'Error al eliminar usuario');
      }
    } catch (error) {
      showNotification('error', 'Error al eliminar usuario');
    }
  };

  useEffect(() => {
    if (user?.role === 'super_admin') {
      loadUsers();
    }
  }, [user]);

  if (user?.role !== 'super_admin') {
    return (
      <div className="text-center py-12">
        <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Acceso Restringido
        </h3>
        <p className="text-gray-600">
          Solo los Super Administradores pueden acceder a esta sección
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Settings className="w-6 h-6 text-blue-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Configuración del Sistema</h2>
          </div>
        </div>
        <p className="text-gray-600 mt-2">
          Gestiona usuarios y configuraciones del sistema
        </p>
      </div>

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div className={`p-4 rounded-lg shadow-lg ${
            notification.type === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center">
              {notification.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              )}
              <p className={`text-sm font-medium ${
                notification.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {notification.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Users Management */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="w-5 h-5 text-blue-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Gestión de Usuarios</h3>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Usuario
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Cargando usuarios...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Creado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((userItem) => (
                    <tr key={userItem.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`rounded-full p-2 mr-3 ${
                            userItem.role === 'super_admin' ? 'bg-red-100' : 'bg-blue-100'
                          }`}>
                            {userItem.role === 'super_admin' ? (
                              <Shield className="w-4 h-4 text-red-600" />
                            ) : (
                              <User className="w-4 h-4 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {userItem.full_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {userItem.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          userItem.role === 'super_admin'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {userItem.role === 'super_admin' ? 'Super Admin' : 'Director'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          userItem.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {userItem.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(userItem.created_at).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingUser(userItem)}
                            className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {userItem.id !== user.id && (
                            <button
                              onClick={() => handleDeleteUser(userItem.id)}
                              className="text-red-600 hover:text-red-900 transition-colors duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateUser}
        />
      )}

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSubmit={(updates) => handleUpdateUser(editingUser.id, updates)}
        />
      )}
    </div>
  );
}