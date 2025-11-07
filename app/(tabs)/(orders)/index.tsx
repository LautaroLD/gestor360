import ButtonFilterOrders from '@/components/ButtonFilterOrders'
import OrderItem from '@/components/OrderItem'
import ScrollLayout from '@/components/ScrollLayout'
import { Order } from '@/models'
import api from '@/services/config'
import { useStore } from '@/services/store'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { useQuery } from '@tanstack/react-query'
import { RelativePathString, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

export default function IndexOrders() {
  const { business } = useStore((state) => state)
  const [search, setSearch] = useState('')
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
    refetch,
  } = useQuery({
    queryKey: ['orders', business?.id],
    queryFn: async () => {
      return (await api.get<Order[]>('/orders/business/' + business?.id)).data
    },
  })
  useEffect(() => {
    if (type === 'all') {
      setOrdersFiltered(
        orders?.filter((o) =>
          o.client.name.toLowerCase().includes(search.toLowerCase())
        ) || []
      )
    } else {
      setOrdersFiltered(
        orders?.filter(
          (o) =>
            o.status === type &&
            o.client.name.toLowerCase().includes(search.toLowerCase())
        ) || []
      )
    }
  }, [type, orders, search])
  if (isPending) {
    return <Text>Loading...</Text>
  }
  if (error) {
    return <Text>{error.message}</Text>
  }
  return (
    <View className='gap-4 flex-1 p-5'>
      {!orders?.length && (
        <View className='p-4 bg-surface rounded-lg'>
          <Text className='text-xl text-center'>No tienes pedidos</Text>
        </View>
      )}
      {orders.length > 0 && (
        <>
          <View>
            <View className='flex-row items-center max-w-full gap-6'>
              <TextInput
                placeholder='Buscar por nombre de cliente'
                className='p-4 bg-surface rounded-lg  flex-1'
                value={search}
                onChangeText={setSearch}
              />
              <TouchableOpacity
                onPress={() => refetch()}
                className={isRefetching ? 'animate-spin' : ''}
              >
                <FontAwesome5 name='sync' size={20} color='black' />
              </TouchableOpacity>
            </View>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal
              className=' max-w-full '
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
          {isRefetching ? (
            <View className='w-full items-center p-6'>
              <FontAwesome5
                name='spinner'
                size={30}
                color='black'
                className='animate-spin'
              />
            </View>
          ) : (
            <>
              {!ordersFiltered?.length && (
                <View className='p-4 bg-surface rounded-lg'>
                  <Text className='text-xl text-center'>No tienes pedidos</Text>
                </View>
              )}
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
          )}
        </>
      )}
    </View>
  )
}
