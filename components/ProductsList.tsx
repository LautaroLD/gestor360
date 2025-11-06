import { Product } from '@/models'
import { RelativePathString, useRouter } from 'expo-router'
import { Pressable, Text, View } from 'react-native'
import ButtonComponent from './ButtonComponent'
import ProductItem from './ProductItem'

export default function ProductsList({ list }: { list: Product[] }) {
  const router = useRouter()
  return (
    <View className=' p-3 bg-slate-300 rounded-lg  h-auto'>
      {!list.length && (
        <Text className='m-auto'>No tienes productos todavía</Text>
      )}
      {list.length && list.length > 0 && (
        <View className='flex-grow gap-2'>
          {list.map((p) => (
            <Pressable
              onPress={() =>
                router.push(`/productScreen?id=${p.id}` as RelativePathString)
              }
              key={p.id}
            >
              <ProductItem p={p} />
            </Pressable>
          ))}
        </View>
      )}
      <ButtonComponent
        className='mt-auto'
        onPress={() => router.push('/NewBusiness')}
      >
        Ver todos
      </ButtonComponent>
    </View>
  )
}
