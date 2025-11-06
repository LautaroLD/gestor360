import { Controller, useFormContext } from 'react-hook-form'
import { KeyboardTypeOptions, Text, TextInput, View } from 'react-native'

const InputForm = ({
  item,
}: {
  item: {
    label: string
    key: string
    type?: KeyboardTypeOptions
    secureTextEntry?: boolean
    pattern?: RegExp
    minLength?: number
    maxLength?: number
    errorMessage?: string
    required?: boolean
  }
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()
  return (
    <View className='flex-1'>
      <Controller
        control={control}
        rules={{
          required: {
            value: item.required || false,
            message: 'Este campo es requerido.',
          },
          minLength: item.minLength
            ? {
                value: item.minLength,
                message:
                  item.errorMessage ||
                  `Se esperaba un mínimo de ${item.minLength} caracteres.`,
              }
            : undefined,
          maxLength: item.maxLength
            ? {
                value: item.maxLength,
                message:
                  item.errorMessage ||
                  `Se esperaba un máximo de ${item.maxLength} caracteres.`,
              }
            : undefined,
          pattern: item.pattern
            ? {
                value: item.pattern,
                message: item.errorMessage || 'El formato es incorrecto.',
              }
            : undefined,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <Text className='font-bold text-gray-500 pl-2'>
              {item.label} {`${!item.required ? '(opcional)' : ''}`}
            </Text>
            <TextInput
              textContentType='dateTime'
              secureTextEntry={item.secureTextEntry ? true : false}
              keyboardType={item.type}
              className='border-b border-b-black px-2'
              placeholder={item.label}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          </>
        )}
        name={item.key}
      />
      {errors[item.key] && (
        <Text className='text-red-600 font-bold'>
          {errors[item.key]?.message as string}
        </Text>
      )}
    </View>
  )
}

export default InputForm
