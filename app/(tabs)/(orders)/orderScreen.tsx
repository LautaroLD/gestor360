import ButtonComponent from '@/components/ButtonComponent'
import CurrencyText from '@/components/CurrencyText'
import DateText from '@/components/DateText'
import { FormatCurrency, FormatDate } from '@/hooks/useFormat'
import { Order } from '@/models'
import api from '@/services/config'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { LinearGradient } from 'expo-linear-gradient'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  ColorValue,
  Modal,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

export default function OrderScreen() {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const router = useRouter()
  const params = useLocalSearchParams()
  const id = params.id as string
  const queryClient = useQueryClient()

  const {
    data: order,
    isPending,
    error,
    refetch,
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
      queryClient.refetchQueries({ queryKey: ['orders'], exact: false })
      queryClient.refetchQueries({ queryKey: ['charts'], exact: false })
      router.back()
    },
  })

  const updateOrderStatus = useMutation({
    mutationFn: async (status: string) => {
      return await api.patch('/orders/' + id, { status })
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['orders'], exact: false })
      queryClient.refetchQueries({ queryKey: ['charts'], exact: false })
    },
  })

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          bg: ['#fef3c7', '#fde68a'] as readonly [
            ColorValue,
            ColorValue,
            ...ColorValue[],
          ],
          label: 'Pendiente',
          icon: 'clock',
          color: '#f59e0b',
        }
      case 'ready':
        return {
          bg: ['#d1fae5', '#a7f3d0'] as readonly [
            ColorValue,
            ColorValue,
            ...ColorValue[],
          ],
          label: 'Listo',
          icon: 'check-circle',
          color: '#10b981',
        }
      case 'delivered':
        return {
          bg: ['#dbeafe', '#bfdbfe'] as readonly [
            ColorValue,
            ColorValue,
            ...ColorValue[],
          ],
          label: 'Entregado',
          icon: 'shipping-fast',
          color: '#3b82f6',
        }
      case 'cancelled':
        return {
          bg: ['#fee2e2', '#fecaca'] as readonly [
            ColorValue,
            ColorValue,
            ...ColorValue[],
          ],
          label: 'Cancelado',
          icon: 'times-circle',
          color: '#ef4444',
        }
      default:
        return {
          bg: ['#f3f4f6', '#e5e7eb'] as readonly [
            ColorValue,
            ColorValue,
            ...ColorValue[],
          ],
          label: status,
          icon: 'info-circle',
          color: '#6b7280',
        }
    }
  }

  const handleShare = async () => {
    if (!order?.data) return

    const message = `
📦 *Pedido #${order.data.id.slice(0, 8)}*

👤 Cliente: ${order.data.client.name}
📞 Teléfono: ${order.data.client.phone}

📅 Entrega: ${FormatDate(order.data.deliveryDate)} - ${order.data.deliveryTime}

🛍️ *Productos:*
${order.data.orderProduct
  .map(
    (p) =>
      `- ${p.quantity}x ${p.product.title} - ${FormatCurrency(p.product.price)}`
  )
  .join('\n')}

💰 *Total: ${FormatCurrency(order.data.total)}*

Estado: ${getStatusConfig(order.data.status).label}
    `.trim()

    try {
      await Share.share({ message })
    } catch (error) {
      console.error(error)
    }
  }

  if (isPending) {
    return (
      <View className='flex-1 justify-center items-center bg-gray-50'>
        <ActivityIndicator size='large' color='#dc2626' />
        <Text className='text-gray-600 mt-4'>Cargando pedido...</Text>
      </View>
    )
  }

  if (error || !order?.data) {
    return (
      <View className='flex-1 justify-center items-center p-6 bg-gray-50'>
        <View className='bg-red-50 p-8 rounded-3xl border border-red-200 shadow-lg'>
          <View className='items-center mb-4'>
            <View className='bg-red-100 rounded-full p-4'>
              <FontAwesome5
                name='exclamation-triangle'
                size={40}
                color='#dc2626'
              />
            </View>
          </View>
          <Text className='text-red-800 text-center font-bold text-xl mb-2'>
            Error al cargar
          </Text>
          <Text className='text-red-600 text-center text-sm mb-6'>
            No se pudo cargar el pedido
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            className='bg-red-600 p-4 rounded-xl'
          >
            <View className='flex-row items-center justify-center gap-2'>
              <FontAwesome5 name='redo' size={16} color='white' />
              <Text className='text-white font-bold'>Reintentar</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const statusConfig = getStatusConfig(order.data.status)
  const itemsCount = order.data.orderProduct.reduce(
    (sum, p) => sum + p.quantity,
    0
  )
  console.log(order.data.deliveryDate)
  console.log(order.data.createdAt)

  return (
    <ScrollView className='flex-1 bg-gray-50'>
      <View className='p-6 gap-6'>
        {/* Header con Estado */}
        <LinearGradient
          colors={statusConfig.bg}
          className='rounded-3xl shadow-2xl p-6 overflow-hidden'
        >
          <View className='flex-row items-center justify-between mb-4'>
            <View className='flex-1'>
              <Text className='text-gray-600 text-sm font-semibold mb-1'>
                Pedido
              </Text>
              <Text className='text-gray-900 text-2xl font-extrabold'>
                #{order.data.id.slice(0, 8)}
              </Text>
            </View>
            <View
              className='rounded-2xl px-4 py-2 shadow-lg'
              style={{ backgroundColor: statusConfig.color }}
            >
              <View className='flex-row items-center gap-2'>
                <FontAwesome5
                  name={statusConfig.icon}
                  size={18}
                  color='white'
                />
                <Text className='text-white font-extrabold text-base'>
                  {statusConfig.label}
                </Text>
              </View>
            </View>
          </View>

          {/* Acciones rápidas */}
          <View className='flex-row gap-2'>
            <TouchableOpacity
              onPress={handleShare}
              className='flex-1 bg-white/80 rounded-xl p-3'
            >
              <View className='flex-row items-center justify-center gap-2'>
                <FontAwesome5 name='share-alt' size={14} color='#374151' />
                <Text className='text-gray-800 font-bold text-sm'>
                  Compartir
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className='flex-1 bg-white/80 rounded-xl p-3'>
              <View className='flex-row items-center justify-center gap-2'>
                <FontAwesome5 name='print' size={14} color='#374151' />
                <Text className='text-gray-800 font-bold text-sm'>
                  Imprimir
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Información del Cliente */}
        <View className='bg-white rounded-3xl shadow-lg p-6'>
          <View className='flex-row items-center gap-3 mb-4'>
            <View className='bg-blue-100 rounded-xl p-3'>
              <FontAwesome5 name='user' size={20} color='#2563eb' />
            </View>
            <Text className='text-2xl font-extrabold text-gray-900'>
              Cliente
            </Text>
          </View>

          <View className='gap-3'>
            <View className='flex-row items-center gap-3 bg-gray-50 rounded-xl p-4'>
              <FontAwesome5 name='user' size={16} color='#6b7280' />
              <View className='flex-1'>
                <Text className='text-gray-600 text-xs font-semibold mb-0.5'>
                  Nombre
                </Text>
                <Text className='text-gray-900 font-bold text-lg'>
                  {order.data.client.name}
                </Text>
              </View>
            </View>

            <View className='flex-row items-center gap-3 bg-gray-50 rounded-xl p-4'>
              <FontAwesome5 name='phone' size={16} color='#6b7280' />
              <View className='flex-1'>
                <Text className='text-gray-600 text-xs font-semibold mb-0.5'>
                  Teléfono
                </Text>
                <Text className='text-gray-900 font-bold text-lg'>
                  {order.data.client.phone}
                </Text>
              </View>
              <TouchableOpacity className='bg-green-500 rounded-lg p-2'>
                <FontAwesome5 name='phone' size={16} color='white' />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Fecha de Entrega */}
        <View className='bg-white rounded-3xl shadow-lg p-6'>
          <View className='flex-row items-center gap-3 mb-4'>
            <View className='bg-green-100 rounded-xl p-3'>
              <FontAwesome5 name='truck' size={20} color='#059669' />
            </View>
            <Text className='text-2xl font-extrabold text-gray-900'>
              Entrega
            </Text>
          </View>

          <View className='gap-3'>
            <View className='flex-row items-center gap-3 bg-gray-50 rounded-xl p-4'>
              <FontAwesome5 name='calendar' size={16} color='#6b7280' />
              <View className='flex-1'>
                <Text className='text-gray-600 text-sm font-semibold mb-0.5'>
                  Fecha
                </Text>
                <DateText
                  className='font-bold'
                  date={order.data.deliveryDate}
                  longDate
                />
              </View>
            </View>

            <View className='flex-row items-center gap-3 bg-gray-50 rounded-xl p-4'>
              <FontAwesome5 name='clock' size={16} color='#6b7280' />
              <View className='flex-1'>
                <Text className='text-gray-600 text-sm font-semibold mb-0.5'>
                  Hora
                </Text>
                <Text className=' font-bold text-lg'>
                  {order.data.deliveryTime}
                </Text>
              </View>
            </View>

            <View className='flex-row items-center gap-3 bg-gray-50 rounded-xl p-4'>
              <FontAwesome5 name='calendar-plus' size={16} color='#6b7280' />
              <View className='flex-1'>
                <Text className='text-gray-600 text-sm font-semibold mb-0.5'>
                  Creado
                </Text>
                <DateText
                  className='font-bold'
                  date={order.data.createdAt}
                  longDate
                />
              </View>
            </View>
          </View>
        </View>

        {/* Productos */}
        <View className='bg-white rounded-3xl shadow-lg p-6'>
          <View className='flex-row items-center justify-between mb-4'>
            <View className='flex-row items-center gap-3'>
              <View className='bg-purple-100 rounded-xl p-3'>
                <FontAwesome5 name='box' size={20} color='#7c3aed' />
              </View>
              <Text className='text-2xl font-extrabold text-gray-900'>
                Productos
              </Text>
            </View>
            <View className='bg-purple-100 px-3 py-1 rounded-lg'>
              <Text className='text-purple-700 font-bold'>
                {itemsCount} items
              </Text>
            </View>
          </View>

          <View className='gap-3'>
            {order.data.orderProduct.map((p, index) => (
              <View key={p.id}>
                {index > 0 && <View className='h-px bg-gray-200 my-2' />}
                <View className='flex-row justify-between items-start gap-3'>
                  <View className='flex-1'>
                    <Text className='text-gray-900 font-extrabold text-lg mb-1'>
                      {p.product.title}
                    </Text>
                    {p.product.description && (
                      <Text className='text-gray-600 text-sm mb-2'>
                        {p.product.description}
                      </Text>
                    )}
                    <View className='flex-row items-center gap-3'>
                      <View className='bg-gray-200 px-3 py-1 rounded-lg'>
                        <Text className='text-gray-800 font-bold text-sm'>
                          Cant: {p.quantity}
                        </Text>
                      </View>
                      <View className='bg-green-100 px-3 py-1 rounded-lg'>
                        <CurrencyText
                          text={p.product.price.toString()}
                          className='text-green-700 font-bold text-sm'
                        />
                      </View>
                    </View>
                  </View>
                  <View className='items-end'>
                    <Text className='text-gray-600 text-xs mb-1'>Subtotal</Text>
                    <CurrencyText
                      text={(p.product.price * p.quantity).toString()}
                      className='text-gray-900 font-extrabold text-xl'
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Total */}
        <LinearGradient
          colors={['#1f2937', '#111827']}
          className='rounded-3xl p-6 shadow-2xl overflow-hidden'
        >
          <View className='flex-row justify-between items-center'>
            <View>
              <Text className='text-white/80 text-sm font-semibold mb-1'>
                Total del Pedido
              </Text>
              <CurrencyText
                text={order.data.total.toString()}
                className='text-white font-extrabold text-4xl'
              />
            </View>
            <View className='bg-white/20 rounded-2xl p-4'>
              <FontAwesome5 name='dollar-sign' size={36} color='white' />
            </View>
          </View>
        </LinearGradient>

        {/* Cambiar Estado */}
        <View className='bg-white rounded-3xl shadow-lg p-6'>
          <View className='flex-row items-center gap-3 mb-4'>
            <View className='bg-orange-100 rounded-xl p-3'>
              <FontAwesome5 name='exchange-alt' size={20} color='#f59e0b' />
            </View>
            <Text className='text-2xl font-extrabold text-gray-900'>
              Cambiar Estado
            </Text>
          </View>

          <View className='gap-3 w-full'>
            {order.data.status !== 'ready' && (
              <LinearGradient
                colors={['#10b981', '#059669']}
                className='rounded-2xl  shadow-lg overflow-hidden '
              >
                <ButtonComponent
                  onPress={() => updateOrderStatus.mutate('ready')}
                  disabled={updateOrderStatus.isPending}
                  loading={updateOrderStatus.isPending}
                >
                  <View className='flex-row items-center justify-center gap-3'>
                    <FontAwesome5 name='check-circle' size={20} color='white' />
                    <Text className='text-white font-extrabold text-lg'>
                      Marcar como Listo
                    </Text>
                  </View>
                </ButtonComponent>
              </LinearGradient>
            )}

            {order.data.status !== 'delivered' && (
              <LinearGradient
                colors={['#3b82f6', '#2563eb']}
                className='rounded-2xl overflow-hidden shadow-lg'
              >
                <ButtonComponent
                  onPress={() => updateOrderStatus.mutate('delivered')}
                  disabled={updateOrderStatus.isPending}
                  loading={updateOrderStatus.isPending}
                >
                  <View className='flex-row items-center justify-center gap-3'>
                    <FontAwesome5
                      name='shipping-fast'
                      size={20}
                      color='white'
                    />
                    <Text className='text-white font-extrabold text-lg'>
                      Marcar como Entregado
                    </Text>
                  </View>
                </ButtonComponent>
              </LinearGradient>
            )}

            {order.data.status !== 'pending' && (
              <ButtonComponent
                onPress={() => updateOrderStatus.mutate('pending')}
                disabled={updateOrderStatus.isPending}
                className='bg-yellow-500'
                loading={updateOrderStatus.isPending}
              >
                <View className='flex-row items-center justify-center gap-3'>
                  <FontAwesome5 name='clock' size={20} color='white' />
                  <Text className='text-white font-extrabold text-lg'>
                    Volver a Pendiente
                  </Text>
                </View>
              </ButtonComponent>
            )}

            {order.data.status !== 'cancelled' && (
              <ButtonComponent
                onPress={() => {
                  Alert.alert(
                    '❌ Cancelar Pedido',
                    '¿Estás seguro que deseas cancelar este pedido?',
                    [
                      { text: 'No', style: 'cancel' },
                      {
                        text: 'Sí, Cancelar',
                        style: 'destructive',
                        onPress: () => updateOrderStatus.mutate('cancelled'),
                      },
                    ]
                  )
                }}
                disabled={updateOrderStatus.isPending}
                loading={updateOrderStatus.isPending}
                primary
              >
                <View className='flex-row items-center justify-center gap-3'>
                  <FontAwesome5 name='times-circle' size={20} color='white' />
                  <Text className='text-white font-extrabold text-lg'>
                    Cancelar Pedido
                  </Text>
                </View>
              </ButtonComponent>
            )}
          </View>
        </View>

        {/* Eliminar */}
        <ButtonComponent
          disabled={deleteOrder.isPending}
          loading={deleteOrder.isPending}
          onPress={() => setShowDeleteModal(true)}
          className='bg-gray-200'
        >
          <View className='flex-row items-center justify-center gap-3'>
            <FontAwesome5 name='trash' size={20} color='#ef4444' />
            <Text className='text-red-600 font-extrabold text-lg'>
              Eliminar Pedido
            </Text>
          </View>
        </ButtonComponent>
      </View>

      {/* Modal de confirmación de eliminación */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType='fade'
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View className='flex-1 justify-center items-center bg-black/50 p-6'>
          <View className='bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden'>
            <LinearGradient colors={['#ef4444', '#dc2626']} className='p-6'>
              <View className='items-center'>
                <View className='bg-white/20 rounded-full p-4 mb-3'>
                  <FontAwesome5
                    name='exclamation-triangle'
                    size={40}
                    color='white'
                  />
                </View>
                <Text className='text-white text-2xl font-extrabold mb-2'>
                  Eliminar Pedido
                </Text>
                <Text className='text-white/90 text-center'>
                  Esta acción no se puede deshacer
                </Text>
              </View>
            </LinearGradient>

            <View className='p-6'>
              <Text className='text-gray-700 text-center mb-6 text-base'>
                ¿Estás seguro que deseas eliminar este pedido permanentemente?
              </Text>

              <View className='gap-3'>
                <TouchableOpacity
                  onPress={() => {
                    setShowDeleteModal(false)
                    deleteOrder.mutate()
                  }}
                  disabled={deleteOrder.isPending}
                  className='bg-red-600 rounded-2xl p-4'
                >
                  <Text className='text-white font-bold text-center text-lg'>
                    {deleteOrder.isPending ? 'Eliminando...' : 'Sí, Eliminar'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setShowDeleteModal(false)}
                  className='bg-gray-200 rounded-2xl p-4'
                >
                  <Text className='text-gray-700 font-bold text-center text-lg'>
                    Cancelar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}
