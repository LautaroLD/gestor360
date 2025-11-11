import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { Pressable, TouchableOpacityProps } from 'react-native'
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
    <Pressable
      {...props}
      className={`rounded-2xl p-5 justify-center items-center gap-2 flex-row overflow-hidden active:opacity-50 disabled:opacity-50 ${props.className || ''} ${primary ? 'bg-primary' : ''} `}
    >
      {loading && (
        <FontAwesome5
          size={23}
          name='spinner'
          color={primary ? 'white' : 'black'}
          className='animate-spin'
        />
      )}
      {!loading && <>{children}</>}
    </Pressable>
  )
}

export default ButtonComponent
