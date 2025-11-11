import { Order } from '@/models'
import { Text, View } from 'react-native'
import CurrencyText from './CurrencyText'
import DateText from './DateText'

export default function OrderItem({ o }: { o: Order }) {
  return (
    <View
      key={o.id}
      className='p-4 bg-background-light rounded-xl w-full gap-2'
    >
      <View>
        <Text
          className={`absolute top-0 right-0 font-bold uppercase  border  px-2 rounded-bl-lg rounded-tr-lg
                        ${o.status === 'pending' && 'bg-yellow-100 border-yellow-700 text-yellow-700 '}
                        ${o.status === 'cancelled' && 'bg-red-100 border-red-700 text-red-700 '}
                        ${o.status === 'ready' && 'bg-green-100 border-green-700 text-green-700 '}
                        ${o.status === 'delivered' && 'bg-blue-100 border-blue-700 text-blue-700'}
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
          Pedido: <DateText date={o.createdAt} />
        </Text>
        <Text className='mx-2'>
          Entrega: <DateText date={o.deliveryDate} /> {o.deliveryTime}
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
