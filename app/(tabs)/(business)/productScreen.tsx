import { Product } from '@/models'
import api from '@/services/config'
import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import { Text, View } from 'react-native'

export default function ProductsScreen() {
  const { id } = useLocalSearchParams()
  const {
    data: product,
    isPending,
    error,
  } = useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      return (await api.get<Product>('/product/' + id)).data
    },
    enabled: !!id,
  })
  if (isPending) return <Text>Loading...</Text>
  if (error) return <Text>{error.message}</Text>
  return (
    <View>
      <Text>{product?.title}</Text>
      <Text>{product?.description}</Text>
      <Text>{product?.price}</Text>
      {product?.catalogs.map((c) => (
        <Text key={c.id}>{c.title}</Text>
      ))}
    </View>
  )
}
