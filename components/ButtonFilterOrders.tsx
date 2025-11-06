import { Pressable, Text } from 'react-native'

export default function ButtonFilterOrders({
  type,
  active,
  setType,
  text,
}: {
  type: 'all' | 'pending' | 'ready' | 'cancelled' | 'delivered'
  active: boolean
  setType: (
    type: 'all' | 'pending' | 'ready' | 'cancelled' | 'delivered'
  ) => void
  text: string
}) {
  return (
    <Pressable
      onPress={() => setType(type)}
      className={`p-2 rounded-lg max-h-fit
        ${active ? 'bg-primary ' : 'bg-gray-100 '}
        `}
    >
      <Text className={`${active ? 'text-white' : 'text-black'}`}>{text}</Text>
    </Pressable>
  )
}
