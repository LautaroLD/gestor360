import InputForm from '@/components/InputForm'
import { Client } from '@/models'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { Text, TouchableOpacity, View } from 'react-native'
import ButtonComponent from '../ButtonComponent'

interface ClientStepProps {
  clientSelected: Client | null | undefined
  onSelectExisting: () => void
  onNext: () => void
  canProceed: boolean
}

export default function ClientStep({
  clientSelected,
  onSelectExisting,
  onNext,
  canProceed,
}: ClientStepProps) {
  return (
    <View className='bg-white rounded-3xl shadow-2xl p-6 gap-6'>
      <View className='flex-row items-center gap-3'>
        <View className='bg-blue-100 rounded-xl p-3'>
          <FontAwesome5 name='user' size={24} color='#2563eb' />
        </View>
        <View className='flex-1'>
          <Text className='text-2xl font-extrabold text-gray-900'>
            Paso 1: Cliente
          </Text>
          <Text className='text-gray-600 text-sm'>Información del cliente</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={onSelectExisting}
        className='bg-blue-50 rounded-2xl p-4 border-2 border-blue-200'
      >
        <View className='flex-row items-center justify-center gap-3'>
          <FontAwesome5 name='users' size={18} color='#2563eb' />
          <Text className='text-blue-700 font-bold text-base'>
            Seleccionar Cliente Existente
          </Text>
        </View>
      </TouchableOpacity>

      <View className='flex-row items-center gap-3'>
        <View className='flex-1 h-px bg-gray-300' />
        <Text className='text-gray-500 text-sm font-semibold'>
          O crear nuevo
        </Text>
        <View className='flex-1 h-px bg-gray-300' />
      </View>

      <View className='gap-5'>
        <View>
          <View className='flex-row items-center gap-2 mb-2'>
            <FontAwesome5 name='user' size={14} color='#6b7280' />
            <Text className='text-gray-700 font-bold'>
              Nombre del Cliente *
            </Text>
          </View>
          <InputForm
            item={{
              label: '',
              key: 'clientName',
              required: true,
              minLength: 2,
              placeholder: 'Ej: Juan Pérez',
            }}
          />
        </View>

        <View>
          <View className='flex-row items-center gap-2 mb-2'>
            <FontAwesome5 name='phone' size={14} color='#6b7280' />
            <Text className='text-gray-700 font-bold'>Teléfono *</Text>
          </View>
          <InputForm
            item={{
              label: '',
              key: 'clientPhone',
              type: 'phone-pad',
              required: true,
              placeholder: '+54 11 1234-5678',
            }}
          />
        </View>
      </View>

      {clientSelected && (
        <View className='bg-green-50 rounded-xl p-4 border border-green-200'>
          <View className='flex-row items-center gap-2'>
            <FontAwesome5 name='check-circle' size={16} color='#059669' />
            <Text className='text-green-800 font-bold'>
              Cliente seleccionado: {clientSelected.name}
            </Text>
          </View>
        </View>
      )}

      <ButtonComponent
        onPress={onNext}
        disabled={!canProceed}
        className={'bg-card-success'}
      >
        <View className='flex-row items-center justify-center gap-3'>
          <Text className='text-white font-extrabold text-lg'>
            Siguiente: Productos
          </Text>
          <FontAwesome5 name='arrow-right' size={20} color='white' />
        </View>
      </ButtonComponent>
    </View>
  )
}
