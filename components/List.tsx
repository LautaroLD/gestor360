import { Catalog, Product } from '@/models'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { RelativePathString, useRouter } from 'expo-router'
import { Image, Pressable, ScrollView, Text } from 'react-native'
import CurrencyText from './CurrencyText'
interface Item extends Partial<Product>, Partial<Catalog> {}

export default function List({
  items,
  type,
}: {
  items: Item[]
  type: 'product' | 'catalog'
}) {
  const router = useRouter()
  return (
    <ScrollView
      horizontal
      className=' bg-slate-200 rounded-lg max-w-full'
      contentContainerClassName='gap-2 w-auto p-2'
    >
      {items.map((i) => (
        <Pressable
          key={i.id}
          className='px-3 py-1 border border-slate-400 rounded-lg bg-slate-50'
          onPress={() =>
            router.push(`/${type}Screen?id=${i.id}` as RelativePathString)
          }
        >
          {i.image ? (
            <Image source={{ uri: i.image }} />
          ) : (
            <FontAwesome5
              name='image'
              size={55}
              color='gray'
              className='m-auto'
            />
          )}
          <Text>{i.title}</Text>
          {i.price && <CurrencyText text={i.price.toString()} />}
          {i.products && i.products.length > 0 && (
            <Text>
              {i.products.length}{' '}
              {i.products.length === 1 ? 'producto' : 'productos'}
            </Text>
          )}
        </Pressable>
      ))}
    </ScrollView>
  )
}
