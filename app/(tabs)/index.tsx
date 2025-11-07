import OrdersComponent from '@/components/OrdersComponent'
import ScrollLayout from '@/components/ScrollLayout'
import { useStore } from '@/services/store'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
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
      <View className='bg-primary py-4 px-6 rounded-lg gap-2'>
        <View className='flex-row items-center gap-2'>
          <FontAwesome5 size={20} name='store' color='white' />
          <Text className='text-3xl font-bold text-surface '>
            {business?.name}
          </Text>
        </View>
        <View className='flex-row items-center gap-2'>
          <FontAwesome5 size={20} name='map-marker-alt' color='white' />
          <Text className='text-surface'>{business?.address}</Text>
        </View>
      </View>
      <OrdersComponent businessId={business?.id as string} />
    </ScrollLayout>
  )
}
