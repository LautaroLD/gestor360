import ButtonComponent from '@/components/ButtonComponent'
import { Business } from '@/models'
import api from '@/services/config'
import { useStore } from '@/services/store'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { useQuery } from '@tanstack/react-query'
import { RelativePathString, useRouter } from 'expo-router'
import { Pressable, Text, View } from 'react-native'

export default function BusinessScreen() {
  const {
    user,
    setBusiness,
    business: selectedBusiness,
  } = useStore((state) => state)
  const router = useRouter()
  const {
    data: business,
    isPending,
    error,
  } = useQuery({
    queryKey: ['business'],
    queryFn: async () => {
      return await api.get<Business[]>('/business/user/' + user?.id)
    },
  })
  if (error) {
    return <Text>error</Text>
  }
  if (isPending) {
    return <Text>Loading...</Text>
  }

  return (
    <View className='p-5 gap-4 flex-1'>
      <ButtonComponent primary onPress={() => router.push('/NewBusiness')}>
        + Crear nuevo negocio
      </ButtonComponent>

      {business.data.map((business) => {
        return (
          <View
            key={business.id}
            className={`${selectedBusiness?.id === business.id ? ' border-primary border-4' : ''}  border rounded-lg bg-white flex-row p-3 gap-3  items-center`}
          >
            <Pressable
              className={`${selectedBusiness?.id === business.id ? ' bg-primary' : 'bg-white'}     border   p-5 rounded-full`}
              onPress={() => {
                setBusiness(business)
              }}
            />
            <View>
              <Text className='font-bold text-xl'>{business.name}</Text>
              <Text>{business.description}</Text>
            </View>
            <Pressable
              className='p-5 ml-auto'
              onPress={() => {
                const url = `/businessScreen?id=${business.id}`
                router.push(url as RelativePathString)
              }}
            >
              <FontAwesome5 name='chevron-right' size={25} color='gray' />
            </Pressable>
          </View>
        )
      })}
    </View>
  )
}
