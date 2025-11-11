import CurrencyText from '@/components/CurrencyText'
import { Product } from '@/models'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import DateTimePicker from '@react-native-community/datetimepicker'
import { LinearGradient } from 'expo-linear-gradient'
import { Controller, useFormContext } from 'react-hook-form'
import { Text, TouchableOpacity, View } from 'react-native'
import ButtonComponent from '../ButtonComponent'

interface DeliveryStepProps {
  showDatepicker: boolean
  showTimepicker: boolean
  onShowDatepicker: (show: boolean) => void
  onShowTimepicker: (show: boolean) => void
  selectedItems: { product: Product; quantity: number }[]
  totalAmount: number
  onDeleteItem: (product: Product) => void
  onBack: () => void
  onSubmit: () => void
  isLoading: boolean
  clientName: string
  clientPhone: string
  deliveryDate: Date
  deliveryTime: Date
}

export default function DeliveryStep({
  showDatepicker,
  showTimepicker,
  onShowDatepicker,
  onShowTimepicker,
  selectedItems,
  totalAmount,
  onDeleteItem,
  onBack,
  onSubmit,
  isLoading,
  clientName,
  clientPhone,
  deliveryDate,
  deliveryTime,
}: DeliveryStepProps) {
  const { control } = useFormContext()

  return (
    <View className='gap-6'>
      {/* Fecha y Hora */}
      <View className='bg-white rounded-3xl shadow-2xl p-6 gap-6'>
        <View className='flex-row items-center gap-3'>
          <View className='bg-green-100 rounded-xl p-3'>
            <FontAwesome5 name='truck' size={24} color='#059669' />
          </View>
          <View className='flex-1'>
            <Text className='text-2xl font-extrabold text-gray-900'>
              Paso 3: Entrega
            </Text>
            <Text className='text-gray-600 text-sm'>
              Fecha y hora de entrega
            </Text>
          </View>
        </View>

        {/* Fecha */}
        <View>
          <View className='flex-row items-center gap-2 mb-2'>
            <FontAwesome5 name='calendar' size={14} color='#6b7280' />
            <Text className='text-gray-700 font-bold'>Fecha de Entrega *</Text>
          </View>
          <Controller
            name='deliveryDate'
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TouchableOpacity
                onPress={() => onShowDatepicker(true)}
                className='bg-gray-50 rounded-xl p-4 border border-gray-300'
              >
                <View className='flex-row items-center justify-between'>
                  <Text className='text-gray-900 font-semibold text-base'>
                    {new Date(value).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                  <FontAwesome5 name='chevron-down' size={16} color='#6b7280' />
                </View>
                {showDatepicker && (
                  <DateTimePicker
                    value={value}
                    mode='date'
                    is24Hour={true}
                    onChange={(_, date) => {
                      console.log(date)
                      console.log(_)

                      onChange(date)
                      onShowDatepicker(false)
                    }}
                  />
                )}
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Hora */}
        <View>
          <View className='flex-row items-center gap-2 mb-2'>
            <FontAwesome5 name='clock' size={14} color='#6b7280' />
            <Text className='text-gray-700 font-bold'>Hora de Entrega *</Text>
          </View>
          <Controller
            name='deliveryTime'
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TouchableOpacity
                onPress={() => onShowTimepicker(true)}
                className='bg-gray-50 rounded-xl p-4 border border-gray-300'
              >
                <View className='flex-row items-center justify-between'>
                  <Text className='text-gray-900 font-semibold text-base'>
                    {new Date(value).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                  <FontAwesome5 name='chevron-down' size={16} color='#6b7280' />
                </View>
                {showTimepicker && (
                  <DateTimePicker
                    value={value}
                    mode='time'
                    is24Hour={true}
                    onChange={(_, date) => {
                      onChange(date)
                      onShowTimepicker(false)
                    }}
                  />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </View>

      {/* Resumen Final */}
      <View className='bg-white rounded-3xl shadow-2xl p-6 gap-4'>
        <Text className='text-2xl font-extrabold text-gray-900 mb-2'>
          📋 Resumen del Pedido
        </Text>

        {/* Cliente */}
        <View className='bg-blue-50 rounded-xl p-4'>
          <Text className='text-blue-900 font-bold mb-2'>Cliente</Text>
          <View className='flex-row items-center gap-2'>
            <FontAwesome5 name='user' size={14} color='#2563eb' />
            <Text className='text-gray-800 font-semibold'>{clientName}</Text>
          </View>
          <View className='flex-row items-center gap-2 mt-1'>
            <FontAwesome5 name='phone' size={14} color='#2563eb' />
            <Text className='text-gray-700'>{clientPhone}</Text>
          </View>
        </View>

        {/* Productos */}
        <View className='bg-purple-50 rounded-xl p-4'>
          <Text className='text-purple-900 font-bold mb-3'>
            Productos ({selectedItems.length})
          </Text>
          {selectedItems.map((item) => (
            <View
              key={item.product.id}
              className='flex-row justify-between items-center mb-2 pb-2 border-b border-purple-200'
            >
              <View className='flex-1'>
                <Text className='text-gray-800 font-semibold'>
                  {item.product.title}
                </Text>
                <Text className='text-gray-600 text-sm'>
                  {item.quantity} ×{' '}
                  <CurrencyText text={item.product.price.toString()} />
                </Text>
              </View>
              <View className='flex-row items-center gap-3'>
                <CurrencyText
                  text={(item.product.price * item.quantity).toString()}
                  className='text-gray-900 font-bold'
                />
                <TouchableOpacity
                  onPress={() => onDeleteItem(item.product)}
                  className='bg-red-100 rounded-lg p-2'
                >
                  <FontAwesome5 name='trash' size={14} color='#dc2626' />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Entrega */}
        <View className='bg-green-50 rounded-xl p-4'>
          <Text className='text-green-900 font-bold mb-2'>Entrega</Text>
          <View className='flex-row items-center gap-2 mb-1'>
            <FontAwesome5 name='calendar' size={14} color='#059669' />
            <Text className='text-gray-800 font-semibold'>
              {new Date(deliveryDate).toLocaleDateString('es-ES')}
            </Text>
          </View>
          <View className='flex-row items-center gap-2'>
            <FontAwesome5 name='clock' size={14} color='#059669' />
            <Text className='text-gray-700'>
              {new Date(deliveryTime).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        </View>

        {/* Total */}
        <LinearGradient
          colors={['#1f2937', '#111827']}
          className='rounded-xl p-5 overflow-hidden'
        >
          <View>
            <Text className='text-white/80 text-sm mb-1'>Total a Pagar</Text>
            <CurrencyText
              text={totalAmount.toString()}
              className='text-white font-extrabold text-3xl'
            />
          </View>
        </LinearGradient>
      </View>

      {/* Botones finales */}
      <View className='flex-row  justify-between items-center '>
        <ButtonComponent onPress={onBack} className=' bg-card-neutral '>
          <View className='flex-row items-center justify-center gap-2'>
            <FontAwesome5 name='arrow-left' size={16} color='#374151' />
            <Text className='text-gray-700 font-bold'>Atrás</Text>
          </View>
        </ButtonComponent>

        <ButtonComponent
          onPress={onSubmit}
          disabled={isLoading}
          loading={isLoading}
          className='bg-card-success  '
        >
          <View className='flex-row items-center justify-center gap-3'>
            {isLoading ? (
              <>
                <FontAwesome5 name='spinner' size={18} color='white' />
                <Text className='text-white font-extrabold'>Creando...</Text>
              </>
            ) : (
              <>
                <FontAwesome5 name='check' size={18} color='white' />
                <Text className='text-white font-extrabold'>Crear Pedido</Text>
              </>
            )}
          </View>
        </ButtonComponent>
      </View>
    </View>
  )
}
