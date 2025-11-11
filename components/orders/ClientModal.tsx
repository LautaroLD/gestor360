import { Client } from '@/models'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { LinearGradient } from 'expo-linear-gradient'
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

interface ClientModalProps {
  visible: boolean
  onClose: () => void
  clients: Client[]
  selectedClient: Client | null | undefined
  onSelectClient: (client: Client) => void
  isLoading: boolean
}

export default function ClientModal({
  visible,
  onClose,
  clients,
  selectedClient,
  onSelectClient,
  isLoading,
}: ClientModalProps) {
  return (
    <Modal animationType='slide' visible={visible} onRequestClose={onClose}>
      <View className='flex-1 bg-gray-50'>
        <LinearGradient
          colors={['#3b82f6', '#2563eb']}
          className='p-8 rounded-b-[30px] '
        >
          <View className='flex-row items-center justify-between mb-4'>
            <Text className='text-white text-2xl font-extrabold'>
              Seleccionar Cliente
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className='bg-white/20 rounded-full px-4 py-2'
            >
              <FontAwesome5 name='times' size={20} color='white' />
            </TouchableOpacity>
          </View>
          <Text className='text-white/90 text-sm'>
            {clients.length || 0} clientes disponibles
          </Text>
        </LinearGradient>

        {isLoading ? (
          <View className='flex-1 justify-center items-center'>
            <ActivityIndicator size='large' color='#3b82f6' />
          </View>
        ) : clients.length === 0 ? (
          <View className='flex-1 justify-center items-center p-6'>
            <View className='bg-white rounded-3xl p-8 items-center shadow-lg'>
              <FontAwesome5 name='users-slash' size={60} color='#9ca3af' />
              <Text className='text-gray-800 font-bold text-xl mt-4 text-center'>
                No hay clientes registrados
              </Text>
              <Text className='text-gray-600 text-center mt-2'>
                Los clientes se crearán automáticamente al crear pedidos
              </Text>
            </View>
          </View>
        ) : (
          <FlatList
            data={clients}
            contentContainerStyle={{ padding: 16, gap: 12 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  onSelectClient(item)
                  onClose()
                }}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={
                    item.id === selectedClient?.id
                      ? ['#dbeafe', '#bfdbfe']
                      : ['#ffffff', '#f9fafb']
                  }
                  className={`rounded-2xl p-5 border-2 overflow-hidden ${
                    item.id === selectedClient?.id
                      ? 'border-blue-400'
                      : 'border-gray-200'
                  }`}
                >
                  <View className='flex-row items-center gap-3'>
                    <View
                      className={`rounded-full p-3 ${
                        item.id === selectedClient?.id
                          ? 'bg-blue-500'
                          : 'bg-gray-200'
                      }`}
                    >
                      <FontAwesome5
                        name='user'
                        size={20}
                        color={
                          item.id === selectedClient?.id ? 'white' : '#6b7280'
                        }
                      />
                    </View>
                    <View className='flex-1'>
                      <Text className='font-extrabold text-gray-900 text-lg mb-1'>
                        {item.name}
                      </Text>
                      <View className='flex-row items-center gap-2'>
                        <FontAwesome5 name='phone' size={12} color='#6b7280' />
                        <Text className='text-gray-700 font-medium'>
                          {item.phone}
                        </Text>
                      </View>
                      <View className='flex-row items-center gap-2 mt-1'>
                        <FontAwesome5
                          name='receipt'
                          size={12}
                          color='#6b7280'
                        />
                        <Text className='text-gray-600 text-sm'>
                          {item.orders?.length || 0} pedidos realizados
                        </Text>
                      </View>
                    </View>
                    {item.id === selectedClient?.id && (
                      <FontAwesome5
                        name='check-circle'
                        size={24}
                        color='#3b82f6'
                      />
                    )}
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
    </Modal>
  )
}
