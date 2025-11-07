import { Order } from '@/models'
import api from '@/services/config'
import { useQuery } from '@tanstack/react-query'
import { RelativePathString, useRouter } from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native'
import ButtonComponent from './ButtonComponent'
import OrderItem from './OrderItem'

export default function OrdersComponent({
  businessId,
}: {
  businessId: string
}) {
  const router = useRouter()
  const {
    data: businessData,
    isPending,
    error,
  } = useQuery({
    queryKey: ['orders', businessId],
    queryFn: async () => {
      return (await api.get<Order[]>('/orders/business/' + businessId)).data
    },
  })

  if (isPending) return <Text>Loading...</Text>
  if (error) return <Text>{error.message}</Text>
  return (
    <View className='gap-4 surface rounded-lg '>
      <View className='gap-2'>
        <ButtonComponent
          onPress={() => {
            router.push('/(tabs)/(orders)/newOrder')
          }}
          primary
        >
          + Nuevo pedido
        </ButtonComponent>
      </View>
      <View>
        <Text className='text-2xl font-bold'>Pedidos pendientes</Text>
        <View className='  rounded-lg gap-2 mt-2'>
          {businessData.filter((o) => o.status === 'pending')?.length === 0 && (
            <Text className='w-full text-center font-bold py-6'>
              No tienes pedidos pendientes
            </Text>
          )}

          {businessData
            .filter((o) => o.status === 'pending')
            ?.map((o) => {
              return (
                <TouchableOpacity
                  className='w-full'
                  key={o.id}
                  onPress={() => {
                    router.push(
                      ('/(tabs)/(orders)/orderScreen' +
                        '?id=' +
                        o.id) as RelativePathString
                    )
                  }}
                >
                  <OrderItem o={o} />
                </TouchableOpacity>
              )
            })}
        </View>
      </View>
    </View>
  )
}
