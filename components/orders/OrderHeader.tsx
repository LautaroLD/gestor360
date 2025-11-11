import { LinearGradient } from 'expo-linear-gradient'
import { Text, View } from 'react-native'

interface OrderHeaderProps {
  step: number
}

export default function OrderHeader({ step }: OrderHeaderProps) {
  return (
    <LinearGradient
      colors={['#3b82f6', '#2563eb', '#1d4ed8']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className='rounded-3xl shadow-2xl p-6 overflow-hidden'
    >
      <View className='items-center mb-4'>
        <Text className='text-white text-3xl font-extrabold mb-2 text-center'>
          Nuevo Pedido
        </Text>
        <Text className='text-white/90 text-base font-medium text-center'>
          Completa la información del pedido
        </Text>
      </View>

      {/* Indicador de pasos */}
      <View className='flex-row gap-2'>
        {[1, 2, 3].map((s) => (
          <View
            key={s}
            className={`flex-1 h-2 rounded-full ${
              step >= s ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </View>
      <View className='flex-row justify-between mt-2'>
        <Text className='text-white/90 text-xs font-semibold'>Cliente</Text>
        <Text className='text-white/90 text-xs font-semibold'>Productos</Text>
        <Text className='text-white/90 text-xs font-semibold'>Entrega</Text>
      </View>
    </LinearGradient>
  )
}
