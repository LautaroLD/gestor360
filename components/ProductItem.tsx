import { Product } from '@/models'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { Text, View } from 'react-native'
import CurrencyText from './CurrencyText'

export default function ProductItem({ p }: { p: Product }) {
  return (
    <View className='bg-white p-3 rounded-lg flex-row gap-3 items-center'>
      <FontAwesome5 size={50} name='image' color='gray' />
      <View className='gap-1'>
        <Text className='font-bold'>{p.title}</Text>
        <Text className='text-sm'>{p.description}</Text>
      </View>
      <View className='ml-auto mb-auto'>
        <CurrencyText text={p.price.toString()} />
      </View>
    </View>
  )
}
