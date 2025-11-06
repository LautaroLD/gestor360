import ButtonComponent from '@/components/ButtonComponent'
import ButtonFilterOrders from '@/components/ButtonFilterOrders'
import OrderItem from '@/components/OrderItem'
import ScrollLayout from '@/components/ScrollLayout'
import { Order } from '@/models'
import api from '@/services/config'
import { useStore } from '@/services/store'
import { useQuery } from '@tanstack/react-query'
import { RelativePathString, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

export default function IndexOrders() {
  const { business } = useStore((state) => state)
  const [ordersFiltered, setOrdersFiltered] = useState<Order[]>([])
  const [type, setType] = useState<
    'all' | 'pending' | 'ready' | 'cancelled' | 'delivered'
  >('all')
  const router = useRouter()

  const {
    data: orders,
    isPending,
    isRefetching,
    error,
  } = useQuery({
    queryKey: ['orders', business?.id],
    queryFn: async () => {
      return (await api.get<Order[]>('/orders/business/' + business?.id)).data
    },
  })
  useEffect(() => {
    if (type === 'all') {
      setOrdersFiltered(orders || [])
    } else {
      setOrdersFiltered(orders?.filter((o) => o.status === type) || [])
    }
  }, [type, orders])

  if (isPending || isRefetching) {
    return <Text>Loading...</Text>
  }
  if (error) {
    return <Text>{error.message}</Text>
  }
  return (
    // <ScrollLayout>
    <View className='gap-4 flex-1 p-5'>
      <ButtonComponent
        onPress={() => {
          router.push('/(tabs)/(orders)/newOrder')
        }}
        primary
      >
        + Nuevo pedido
      </ButtonComponent>
      {!orders?.length && (
        <View className='p-4 bg-gray-200 rounded-lg'>
          <Text className='text-xl text-center'>No tienes pedidos</Text>
        </View>
      )}
      {orders.length > 0 && (
        <>
          <View>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal
              className=' bg-slate-200 rounded-lg max-w-full '
              contentContainerClassName='gap-2 w-auto p-2 '
            >
              <ButtonFilterOrders
                active={type === 'all'}
                text='Todos'
                setType={setType}
                type='all'
              />
              <ButtonFilterOrders
                active={type === 'pending'}
                text='Pendientes'
                setType={setType}
                type='pending'
              />
              <ButtonFilterOrders
                active={type === 'delivered'}
                text='Entregados'
                setType={setType}
                type='delivered'
              />
              <ButtonFilterOrders
                active={type === 'ready'}
                text='Preparados'
                setType={setType}
                type='ready'
              />
              <ButtonFilterOrders
                active={type === 'cancelled'}
                text='Cancelados'
                setType={setType}
                type='cancelled'
              />
            </ScrollView>
          </View>
          <>
            <ScrollLayout>
              {ordersFiltered?.map((o) => (
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
              ))}
            </ScrollLayout>
          </>
        </>
      )}
    </View>
    // </ScrollLayout>
  )
}
