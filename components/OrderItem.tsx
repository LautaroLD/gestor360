import { Order } from '@/models'
import { Text, View } from 'react-native'
import CurrencyText from './CurrencyText'

export default function OrderItem({ o }: { o: Order }) {
  return (
    <View key={o.id} className='p-4 bg-gray-200 rounded-lg w-full gap-2'>
      <View>
        <Text
          className={`absolute top-0 right-0 font-bold uppercase  border  px-2 rounded-bl-lg rounded-tr-lg
                        ${o.status === 'pending' && 'bg-yellow-200 border-yellow-600 text-yellow-600 '}
                        ${o.status === 'cancelled' && 'bg-red-200 border-red-600 text-red-600 '}
                        ${o.status === 'ready' && 'bg-green-200 border-green-600 text-green-600 '}
                        ${o.status === 'delivered' && 'bg-blue-200 border-blue-600 text-blue-600'}
                        `}
        >
          {o.status === 'pending' && 'Pendiente'}
          {o.status === 'ready' && 'Preparado'}
          {o.status === 'cancelled' && 'Cancelado'}
          {o.status === 'delivered' && 'Entregado'}
        </Text>
        <Text className='font-bold'>Cliente</Text>
        <View className='mx-2'>
          <Text>Nombre: {o.client.name}</Text>
          <Text>Teléfono: {o.client.phone}</Text>
        </View>
      </View>
      <View>
        <Text className='font-bold'>Fecha</Text>
        <Text className='mx-2'>
          Pedido: {new Date(o.createdAt).toLocaleDateString()}
        </Text>
        <Text className='mx-2'>
          Entrega: {o.deliveryDate} {o.deliveryTime}
        </Text>
      </View>
      <View>
        <Text className='font-bold'>Items:</Text>
        {o.orderProduct.map((p) => (
          <View
            key={p.productId}
            className='flex-row justify-between mx-2 border-b border-dotted border-gray-400'
          >
            <Text>
              {p.product.title} x {p.quantity}
            </Text>
            <CurrencyText text={p.product.price.toString()} />
          </View>
        ))}
      </View>
      <View className='flex-row justify-between mx-2'>
        <Text className='font-bold'>Total:</Text>
        <CurrencyText text={o.total.toString()} />
      </View>
    </View>
  )
}
