import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function HeaderComponent({ title }: { title: string }) {
  const insets = useSafeAreaInsets()
  return (
    <View
      style={{ paddingTop: insets.top }}
      className={`px-4 pb-1  bg-primary `}
    >
      <Text className='font-bold text-3xl text-white'>{title}</Text>
    </View>
  )
}
