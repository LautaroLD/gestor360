import CurrencyText from '@/components/CurrencyText'
import ScrollLayout from '@/components/ScrollLayout'
import { chartData } from '@/models'
import api from '@/services/config'
import { useStore } from '@/services/store'
import { useQuery } from '@tanstack/react-query'
import { Text, View } from 'react-native'
import { PieChart } from 'react-native-gifted-charts'
const randomColor = (products: chartData[]) => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  if (products.some((item) => item.color === color)) {
    randomColor(products)
  }
  return color
}
export default function Charts() {
  const business = useStore((state) => state.business)

  const { data, isPending, error } = useQuery({
    queryKey: ['charts'],
    queryFn: async (): Promise<chartData[]> => {
      return (await api.get('/business/charts/' + business?.id)).data
    },
    enabled: !!business,
  })
  if (!business) {
    return (
      <View className='flex-1 bg-slate-200 items-center justify-center'>
        <Text className='text-2xl text-center'>
          Primero debes crear y seleccionar como activo un negocio
        </Text>
      </View>
    )
  }
  if (isPending) return <Text>Loading...</Text>
  if (error) return <Text>{error.message}</Text>
  const products = data
    .filter((item) => item.quantity > 0)
    .map((item) => ({ ...item, color: randomColor(data) }))
    .sort((a, b) => b.quantity - a.quantity)
  return (
    <ScrollLayout>
      <View className='items-center gap-5 border border-gray-300 p-2 bg-slate-200'>
        <Text className='font-bold text-2xl'>Productos mas vendidos</Text>
        <Text className='text-sm text-center text-slate-500'>
          solo se sumaran los productos de las ordenes entregadas
        </Text>
        <PieChart
          data={products.map((item) => ({
            color: item.color,
            tooltipText: item.title,
            value: item.quantity,
          }))}
        />
        <View>
          <Text>
            Total ingresos:{' '}
            <CurrencyText
              text={products
                .reduce((acc, item) => acc + item.price * item.quantity, 0)
                .toString()}
            />
          </Text>
        </View>
        <View className='gap-4 w-full border-t border-gray-300 pt-5'>
          <Text className='font-bold text-xl'>Detalles</Text>
          {products.map((item) => {
            return (
              <View
                key={item.id}
                className='border border-gray-300 p-3 gap-2 bg-slate-100'
              >
                <View className='flex-row gap-3'>
                  <View
                    className=' rounded-lg w-6 h-6'
                    style={{ backgroundColor: item.color }}
                  ></View>
                  <Text className='font-bold'>{item.title}</Text>
                </View>
                <Text>
                  Unidades vendidas:{' '}
                  <Text className='font-bold'>{item.quantity}</Text>
                </Text>
                <Text>
                  Ingresos generados:{' '}
                  <CurrencyText
                    text={(item.price * item.quantity).toString()}
                  />
                </Text>
              </View>
            )
          })}
        </View>
      </View>
    </ScrollLayout>
  )
}
