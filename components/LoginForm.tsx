import api from '@/services/config'
import { useStore } from '@/services/store'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Text, View } from 'react-native'
import ButtonComponent from './ButtonComponent'
import InputForm from './InputForm'
interface LoginFormProps {
  email: string
  password: string
}
const LoginForm = () => {
  const methods = useForm<LoginFormProps>()
  const [errorMessage, setErrorMessage] = React.useState<string | null>()
  const router = useRouter()
  const { login } = useStore((state) => state)
  const loginUser = useMutation({
    mutationFn: async (data: LoginFormProps) => {
      const newUser = await api.post('/users/login', data)

      return newUser
    },
    onSuccess: ({ data }) => {
      login({
        business: data.userData.Businesses,
        token: data.token,
        user: data.userData,
      })
    },
    onError: (error) => {
      setErrorMessage(error.message)
      console.log(error)
    },
  })
  const onSubmit = (data: LoginFormProps) => loginUser.mutate(data)
  return (
    <FormProvider {...methods}>
      {errorMessage && (
        <Text className='p-3 rounded-lg text-center text-red-300 bg-red-800'>
          {errorMessage}
        </Text>
      )}
      <View className='gap-10'>
        <InputForm
          item={{
            label: 'Correo',
            key: 'email',
            type: 'email-address',
            pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            required: true,
            errorMessage: 'El formato es incorrecto.',
          }}
        />
        <InputForm
          item={{
            label: 'Contraseña',
            key: 'password',
            secureTextEntry: true,
            required: true,
          }}
        />
        <ButtonComponent
          loading={loginUser.isPending}
          primary
          onPress={methods.handleSubmit(onSubmit)}
        >
          Iniciar sesión
        </ButtonComponent>
      </View>
    </FormProvider>
  )
}

export default LoginForm
