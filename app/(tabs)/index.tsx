import OrdersComponent from '@/components/OrdersComponent'
import ScrollLayout from '@/components/ScrollLayout'
import { useStore } from '@/services/store'
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
      <View>
        <Text className='text-3xl font-bold'>{business?.name}</Text>
        <Text>{business?.address}</Text>
      </View>
      <OrdersComponent businessId={business?.id as string} />
    </ScrollLayout>
  )
}
