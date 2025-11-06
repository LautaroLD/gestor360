import ButtonComponent from '@/components/ButtonComponent'
import List from '@/components/List'
import ScrollLayout from '@/components/ScrollLayout'
import { Business } from '@/models'
import api from '@/services/config'
import { useQuery } from '@tanstack/react-query'
import {
  RelativePathString,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from 'expo-router'
import { useLayoutEffect } from 'react'
import { Text, View } from 'react-native'

export default function BusinessScreen() {
  const navigation = useNavigation()

  const params = useLocalSearchParams()

  const router = useRouter()
  const {
    data: businessData,
    isPending,
    error,
  } = useQuery({
    queryKey: ['business', params?.id],
    queryFn: async () => {
      return await api.get<Business>('/business/' + params?.id)
    },
    enabled: !!params?.id,
  })
  useLayoutEffect(() => {
    navigation.setOptions({ title: businessData?.data.name })
  }, [navigation])
  if (isPending) return <Text>Loading...</Text>
  if (error) return <Text>{error.message}</Text>
  return (
    <ScrollLayout>
      <View className='gap-4'>
        <View>
          <Text className=' '>{businessData?.data.address}</Text>
          <Text className=' '>{businessData?.data.description}</Text>
          {!businessData?.data.categories.length && (
            <Text>No tienes categorías</Text>
          )}
          {businessData?.data.categories.map((c) => (
            <Text key={c.id}>{c.name}</Text>
          ))}
        </View>
        <View className='gap-4'>
          <Text className='text-2xl font-bold'>Productos</Text>
          <ButtonComponent
            primary
            onPress={() =>
              router.push(
                ('/NewProduct?businessId=' +
                  businessData?.data.id) as RelativePathString
              )
            }
          >
            + Agregar nuevo producto
          </ButtonComponent>
          {businessData?.data.products.length === 0 ? (
            <Text>No tienes productos todavía</Text>
          ) : (
            <View>
              <List
                items={businessData?.data.products.slice(0, 5)}
                type='product'
              />
              <ButtonComponent>Ver todos</ButtonComponent>
            </View>
          )}
        </View>
        <View className='gap-4'>
          <Text className='text-2xl font-bold'>Catálogos</Text>
          <ButtonComponent
            primary
            onPress={() =>
              router.push(
                ('/NewCatalog?businessId=' +
                  businessData?.data.id) as RelativePathString
              )
            }
          >
            + Agregar nuevo catalogo
          </ButtonComponent>
          {businessData?.data.catalogs.length === 0 ? (
            <Text>No tienes catálogos todavía</Text>
          ) : (
            <View>
              <List
                items={businessData?.data.catalogs.slice(0, 5)}
                type='catalog'
              />
              <ButtonComponent>Ver todos</ButtonComponent>
            </View>
          )}
        </View>
      </View>
    </ScrollLayout>
  )
}
