import ButtonComponent from '@/components/ButtonComponent'
import ScrollLayout from '@/components/ScrollLayout'
import { useStore } from '@/services/store'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { LinearGradient } from 'expo-linear-gradient'
import { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

export default function Profile() {
  const { logout, user, business } = useStore((state) => state)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingField, setEditingField] = useState<
    'firstName' | 'lastName' | 'phone' | null
  >(null)
  const [editValue, setEditValue] = useState('')

  // Calcular estadísticas
  const stats = {
    totalBusinesses: user?.businesses?.length || 0,
    memberSince: user?.createdAt
      ? new Date(user.createdAt).toLocaleDateString('es-ES', {
          month: 'long',
          year: 'numeric',
        })
      : 'N/A',
  }

  const handleLogout = () => {
    Alert.alert(
      '🚪 Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: () => logout(),
        },
      ],
      { cancelable: true }
    )
  }

  const handleEditField = (field: 'firstName' | 'lastName' | 'phone') => {
    setEditingField(field)
    setEditValue(
      field === 'firstName'
        ? user?.firstName || ''
        : field === 'lastName'
          ? user?.lastName || ''
          : user?.phone || ''
    )
    setShowEditModal(true)
  }

  const handleSaveEdit = async () => {
    // Aquí iría la lógica para guardar en el backend
    Alert.alert('💾 Guardado', 'Los cambios se han guardado correctamente')
    setShowEditModal(false)
  }

  if (!user) {
    return (
      <View className='flex-1 justify-center items-center'>
        <ActivityIndicator size='large' color='#dc2626' />
      </View>
    )
  }

  return (
    <ScrollLayout>
      {/* Header con Avatar */}
      <View className='bg-primary rounded-lg'>
        <View className='p-8 items-center'>
          {/* Nombre */}
          <Text className='text-white text-3xl font-extrabold mb-2'>
            {user.firstName} {user.lastName}
          </Text>

          {/* Email */}
          <View className='flex-row items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-4'>
            <FontAwesome5 name='envelope' size={14} color='white' />
            <Text className='text-white font-semibold'>{user.email}</Text>
          </View>

          {/* Miembro desde */}
          <View className='flex-row items-center gap-2'>
            <FontAwesome5 name='calendar-check' size={12} color='white' />
            <Text className='text-white/90 text-sm'>
              Miembro desde {stats.memberSince}
            </Text>
          </View>
        </View>
      </View>

      {/* Negocio Activo */}
      {business && (
        <View className='mb-6'>
          <View className='flex-row items-center gap-2 mb-4'>
            <FontAwesome5 name='store' size={20} color='#dc2626' />
            <Text className='text-2xl font-extrabold text-gray-900'>
              Negocio Activo
            </Text>
          </View>

          <View className='bg-background-light rounded-lg'>
            <View className='p-5'>
              <View className='flex-row items-center gap-3 mb-3'>
                <View className='bg-red-600 rounded-xl p-3'>
                  <FontAwesome5 name='store' size={20} color='white' />
                </View>
                <View className='flex-1'>
                  <Text className='text-gray-900 text-xl font-extrabold'>
                    {business.name}
                  </Text>
                  {business.address && (
                    <View className='flex-row items-center gap-1 mt-1'>
                      <FontAwesome5
                        name='map-marker-alt'
                        size={12}
                        color='#6b7280'
                      />
                      <Text className='text-gray-600 text-sm'>
                        {business.address}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              {business.description && (
                <Text className='text-gray-700 text-sm leading-5'>
                  {business.description}
                </Text>
              )}
            </View>
          </View>
        </View>
      )}

      {/* Botón de Cerrar Sesión */}
      <ButtonComponent primary onPress={handleLogout}>
        <Text className=''>Cerrar Sesión</Text>
      </ButtonComponent>

      {/* Versión */}
      <View className='items-center mb-4'>
        <Text className='text-gray-400 text-sm'>Gestor360 v1.0.0</Text>
        <Text className='text-gray-400 text-xs mt-1'>
          © 2025 Todos los derechos reservados
        </Text>
      </View>

      {/* Modal de Edición */}
      <Modal
        visible={showEditModal}
        transparent
        animationType='fade'
        onRequestClose={() => setShowEditModal(false)}
      >
        <View className='flex-1 justify-center items-center bg-black/50 p-6'>
          <View className='bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden'>
            <LinearGradient colors={['#dc2626', '#b91c1c']} className='p-6'>
              <Text className='text-white text-2xl font-extrabold mb-1'>
                Editar{' '}
                {editingField === 'firstName'
                  ? 'Nombre'
                  : editingField === 'lastName'
                    ? 'Apellido'
                    : 'Teléfono'}
              </Text>
              <Text className='text-white/90 text-sm'>
                Actualiza tu información personal
              </Text>
            </LinearGradient>

            <View className='p-6'>
              <View className='mb-6'>
                <Text className='text-gray-700 font-bold mb-2'>
                  {editingField === 'firstName'
                    ? 'Nuevo Nombre'
                    : editingField === 'lastName'
                      ? 'Nuevo Apellido'
                      : 'Nuevo Teléfono'}
                </Text>
                <TextInput
                  value={editValue}
                  onChangeText={setEditValue}
                  placeholder={
                    editingField === 'firstName'
                      ? 'Ingresa tu nombre'
                      : editingField === 'lastName'
                        ? 'Ingresa tu apellido'
                        : 'Ingresa tu teléfono'
                  }
                  keyboardType={
                    editingField === 'phone' ? 'phone-pad' : 'default'
                  }
                  className='bg-gray-100 rounded-xl p-4 text-gray-900 font-semibold text-base'
                  placeholderTextColor='#9ca3af'
                />
              </View>

              <View className='flex-row gap-3'>
                <TouchableOpacity
                  onPress={() => setShowEditModal(false)}
                  className='flex-1 bg-gray-200 rounded-xl p-4 active:bg-gray-300'
                >
                  <Text className='text-gray-700 font-bold text-center text-base'>
                    Cancelar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSaveEdit}
                  className='flex-1 bg-red-600 rounded-xl p-4 active:bg-red-700'
                >
                  <Text className='text-white font-bold text-center text-base'>
                    Guardar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollLayout>
  )
}
