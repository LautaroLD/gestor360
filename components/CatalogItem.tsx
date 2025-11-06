import { Catalog } from '@/models'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { Text, View } from 'react-native'

export default function CatalogItem({ c }: { c: Catalog }) {
  return (
    <View className='bg-slate-100 p-3 rounded-lg flex-row items-center gap-3'>
      <FontAwesome5 size={50} name='images' color='gray' />
      <View className='gap-1'>
        <Text className='font-bold'>{c.title}</Text>
        <View className='flex-row flex-wrap max-w-[90%]'>
          {c.products.map((p) => (
            <Text className='text-sm' key={p.id}>
              {p.title},{' '}
            </Text>
          ))}
        </View>
      </View>
      <View className=' absolute right-3 top-0'>
        <Text className='font-bold'>
          {c.products.length}{' '}
          {c.products.length === 1 ? 'producto' : 'productos'}{' '}
        </Text>
      </View>
    </View>
  )
}
