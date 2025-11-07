import ButtonComponent from '@/components/ButtonComponent'
import List from '@/components/List'
import ScrollLayout from '@/components/ScrollLayout'
import { Business } from '@/models'
import api from '@/services/config'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
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
    data: business,
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
    navigation.setOptions({ title: business?.data.name })
  }, [navigation])
  if (isPending) return <Text>Loading...</Text>
  if (error) return <Text>{error.message}</Text>
  return (
    <ScrollLayout>
      <View className='bg-primary py-4 px-6 rounded-lg gap-2'>
        <View className='flex-row items-center gap-2'>
          <FontAwesome5 size={20} name='store' color='white' />
          <Text className='text-3xl font-bold text-surface '>
            {business?.data.name}
          </Text>
        </View>
        <View className='flex-row items-center gap-2'>
          <FontAwesome5 size={20} name='map-marker-alt' color='white' />
          <Text className='text-surface'>{business?.data.address}</Text>
        </View>
        <Text className='text-surface'>{business?.data.description}</Text>
      </View>
      <View className='gap-4'>
        <Text className='text-2xl font-bold'>Productos</Text>
        <ButtonComponent
          primary
          onPress={() =>
            router.push(
              ('/NewProduct?businessId=' +
                business?.data.id) as RelativePathString
            )
          }
        >
          + Agregar nuevo producto
        </ButtonComponent>
        {business?.data.products?.length === 0 ? (
          <Text>No tienes productos todavía</Text>
        ) : (
          <View>
            <List items={business?.data.products?.slice(0, 5)} type='product' />
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
                business?.data.id) as RelativePathString
            )
          }
        >
          + Agregar nuevo catalogo
        </ButtonComponent>
        {business?.data.catalogs?.length === 0 ? (
          <Text>No tienes catálogos todavía</Text>
        ) : (
          <View>
            <List items={business?.data.catalogs?.slice(0, 5)} type='catalog' />
            <ButtonComponent>Ver todos</ButtonComponent>
          </View>
        )}
      </View>
    </ScrollLayout>
  )
}
