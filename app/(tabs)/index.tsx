import OrdersComponent from '@/components/OrdersComponent'
import ScrollLayout from '@/components/ScrollLayout'
import { Colors } from '@/constants/Colors'
import { useStore } from '@/services/store'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { LinearGradient } from 'expo-linear-gradient'
import { Link } from 'expo-router'
import { Text, View } from 'react-native'

export default function Index() {
  const { business } = useStore((state) => state)
  if (!business) {
    return (
      <View className='p-4 bg-slate-200 mx-4 my-auto rounded-lg'>
        <Text className='text-xl text-center'>
          Primero debes crear y seleccionar como activo un negocio en la sección{' '}
          <Link href='/(tabs)/(business)' className='font-bold underline'>
            Mis negocios
          </Link>
        </Text>
      </View>
    )
  }
  return (
    <ScrollLayout>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className='rounded-3xl shadow-2xl overflow-hidden p-5'
        colors={[Colors.primary, Colors.secondary]}
      >
        <View className='flex-row items-center gap-2'>
          <FontAwesome5 size={20} name='store' color='white' />
          <Text className='text-3xl font-bold text-text-light '>
            {business?.name}
          </Text>
        </View>
        <View className='flex-row items-center gap-2'>
          <FontAwesome5 size={20} name='map-marker-alt' color='white' />
          <Text className='text-text-light'>{business?.address}</Text>
        </View>
      </LinearGradient>
      <OrdersComponent businessId={business?.id as string} />
    </ScrollLayout>
  )
}
