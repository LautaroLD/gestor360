import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { useRouter } from 'expo-router'
import { Text, View } from 'react-native'

export default function BackButtonComponent({
  children,
  text,
}: {
  children?: React.ReactNode
  text: string
}) {
  const router = useRouter()
  return (
    <View className='flex-row items-center  gap-4 bg-primary  top-0 left-0 w-full'>
      <FontAwesome5
        size={20}
        className='px-6 py-4'
        name='arrow-left'
        color='white'
        onPress={() => router.back()}
      />
      <Text className='text-xl text-white'>{text}</Text>
      {children}
    </View>
  )
}
