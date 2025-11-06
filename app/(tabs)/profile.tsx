import ButtonComponent from '@/components/ButtonComponent'
import { useStore } from '@/services/store'
import { Text, View } from 'react-native'

export default function Profile() {
  const { logout, user } = useStore((state) => state)
  return (
    <View>
      <Text>profile</Text>
      <Text>{JSON.stringify(user)}</Text>
      <View className='w-1/3 mr-auto'>
        <ButtonComponent
          onPress={() => {
            logout()
          }}
          textColor='red'
        >
          Cerrar sesión
        </ButtonComponent>
      </View>
    </View>
  )
}
