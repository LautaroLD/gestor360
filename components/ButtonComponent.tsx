import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { Pressable, Text, TouchableOpacityProps, View } from 'react-native'
interface ButtonComponentProps extends TouchableOpacityProps {
  children?: React.ReactNode
  primary?: boolean
  loading?: boolean
  textColor?: string
}
const ButtonComponent = ({
  children,
  primary,
  loading,
  textColor,
  ...props
}: ButtonComponentProps) => {
  return (
    <Pressable {...props}>
      {({ pressed }) => (
        <View
          className={`${primary ? 'bg-primary' : 'bg-transparent '} p-3 justify-center rounded-lg items-center ${pressed ? 'opacity-60' : 'opacity-100'}`}
        >
          {loading && (
            <FontAwesome5
              size={23}
              name='spinner'
              color={primary ? 'white' : 'black'}
              className='animate-spin'
            />
          )}
          {!loading && (
            <Text
              className={` ${primary && 'text-white'} font-bold text-xl ${textColor ? `text-[${textColor}]` : 'text-black'} `}
            >
              {children}
            </Text>
          )}
        </View>
      )}
    </Pressable>
  )
}

export default ButtonComponent
