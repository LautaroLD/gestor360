import ButtonComponent from '@/components/ButtonComponent'
import OrderItem from '@/components/OrderItem'
import { Order } from '@/models'
import api from '@/services/config'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { Text, View } from 'react-native'

export default function OrderScreen() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const params = useLocalSearchParams()
  const id = params.id as string
  const queryClient = useQueryClient()

  const {
    data: order,
    isPending,
    error,
  } = useQuery({
    queryKey: ['orders', id],
    queryFn: async () => {
      const res = await api.get<Order>('/orders/' + id)

      return res
    },
    enabled: !!id,
  })
  const deleteOrder = useMutation({
    mutationFn: async () => {
      return await api.delete('/orders/' + id)
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ['orders'],
        exact: false,
      })
      router.back()
    },
  })

  const updateOrderStatus = useMutation({
    mutationFn: async (status: string) => {
      return await api.patch('/orders/' + id, { status })
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ['orders'],
        exact: false,
      })
      queryClient.refetchQueries({ queryKey: ['charts'], exact: false })
    },
  })
  if (isPending) return <Text>Loading...</Text>
  if (error) return <Text>{error.message}</Text>

  return (
    <View className='flex-1 p-5 gap-4'>
      {open && (
        <View className='absolute inset-0 bg-black/50 z-10'>
          <View className='bg-slate-100 w-3/4  m-auto p-5 gap-5 rounded-lg'>
            <Text className='text-center text-2xl font-bold'>
              ¿Seguro que deseas eliminar el pedido?
            </Text>
            <ButtonComponent primary onPress={() => deleteOrder.mutate()}>
              Eliminar
            </ButtonComponent>
            <ButtonComponent onPress={() => setOpen(false)}>
              Cancelar
            </ButtonComponent>
          </View>
        </View>
      )}
      {/* <BackButtonComponent text='Detalles del pedido' /> */}
      <Text className='text-center underline'>{order?.data?.id}</Text>
      <OrderItem o={order?.data as Order} />
      {/* {order?.data.status === 'pending' && ( */}
      <View className='gap-2 border rounded-lg p-2'>
        <Text className='text-xl text-center'>Actualizar estado</Text>
        <View className=' gap-4 '>
          <ButtonComponent
            className='bg-green-200 border-green-600 rounded-lg'
            onPress={() => {
              updateOrderStatus.mutate('ready')
            }}
          >
            Preparado
          </ButtonComponent>
          <ButtonComponent
            className=' border-blue-600 bg-blue-200 rounded-lg'
            onPress={() => {
              updateOrderStatus.mutate('delivered')
            }}
          >
            Entregado
          </ButtonComponent>
          <ButtonComponent
            className='bg-red-200 border-red-600 rounded-lg'
            onPress={() => {
              updateOrderStatus.mutate('cancelled')
            }}
          >
            Cancelado
          </ButtonComponent>
          <ButtonComponent
            className='bg-slate-200 rounded-lg'
            onPress={() => {
              setOpen(true)
            }}
          >
            Eliminar
          </ButtonComponent>
        </View>
      </View>
    </View>
  )
}
