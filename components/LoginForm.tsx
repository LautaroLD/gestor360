import api from '@/services/config'
import { useStore } from '@/services/store'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { useMutation } from '@tanstack/react-query'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Text, TouchableOpacity, View } from 'react-native'
import ButtonComponent from './ButtonComponent'
import InputForm from './InputForm'

interface LoginFormProps {
  email: string
  password: string
}

const LoginForm = () => {
  const methods = useForm<LoginFormProps>()
  const [errorMessage, setErrorMessage] = React.useState<string | null>()
  const [showPassword, setShowPassword] = React.useState(false)
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

  const onSubmit = (data: LoginFormProps) => {
    setErrorMessage(null)
    loginUser.mutate(data)
  }

  return (
    <FormProvider {...methods}>
      <View className='gap-6'>
        {errorMessage && (
          <LinearGradient
            colors={['#fee2e2', '#fecaca']}
            className='p-4 rounded-2xl border-2 border-red-300'
          >
            <View className='flex-row items-center gap-3'>
              <View className='bg-red-500 rounded-full p-2'>
                <FontAwesome5 name='exclamation' size={16} color='white' />
              </View>
              <Text className='flex-1 text-red-800 font-semibold'>
                {errorMessage}
              </Text>
            </View>
          </LinearGradient>
        )}

        <View className='gap-5'>
          <View>
            <View className='flex-row items-center gap-2 mb-2'>
              <FontAwesome5 name='envelope' size={16} color='#6b7280' />
              <Text className='text-gray-700 font-bold'>Correo Electrónico</Text>
            </View>
            <InputForm
              item={{
                label: '',
                key: 'email',
                type: 'email-address',
                pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                required: true,
                errorMessage: 'El formato del correo es incorrecto.',
                placeholder: 'ejemplo@correo.com',
              }}
            />
          </View>

          <View>
            <View className='flex-row items-center justify-between mb-2'>
              <View className='flex-row items-center gap-2'>
                <FontAwesome5 name='lock' size={16} color='#6b7280' />
                <Text className='text-gray-700 font-bold'>Contraseña</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className='flex-row items-center gap-2'
              >
                <FontAwesome5
                  name={showPassword ? 'eye-slash' : 'eye'}
                  size={14}
                  color='#dc2626'
                />
                <Text className='text-red-600 font-semibold text-sm'>
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </Text>
              </TouchableOpacity>
            </View>
            <InputForm
              item={{
                label: '',
                key: 'password',
                secureTextEntry: !showPassword,
                required: true,
                placeholder: '••••••••',
              }}
            />
          </View>
        </View>

        {/* Olvidaste tu contraseña */}
        <TouchableOpacity className='items-end'>
          <Text className='text-red-600 font-bold text-sm'>
            ¿Olvidaste tu contraseña?
          </Text>
        </TouchableOpacity>

        {/* Botón de login */}
        <TouchableOpacity
          onPress={methods.handleSubmit(onSubmit)}
          disabled={loginUser.isPending}
          className='mt-2'
        >
          <LinearGradient
            colors={['#dc2626', '#b91c1c']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className='rounded-2xl shadow-xl p-5'
          >
            <View className='flex-row items-center justify-center gap-3'>
              {loginUser.isPending ? (
                <>
                  <FontAwesome5 name='spinner' size={20} color='white' />
                  <Text className='text-white font-extrabold text-lg'>
                    Iniciando sesión...
                  </Text>
                </>
              ) : (
                <>
                  <FontAwesome5 name='sign-in-alt' size={20} color='white' />
                  <Text className='text-white font-extrabold text-lg'>
                    Iniciar Sesión
                  </Text>
                </>
              )}
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Beneficios rápidos */}
        <View className='bg-gray-50 rounded-xl p-4 gap-2 mt-2'>
          <View className='flex-row items-center gap-2'>
            <FontAwesome5 name='check-circle' size={14} color='#10b981' />
            <Text className='text-gray-700 text-sm'>
              Acceso inmediato a tu panel
            </Text>
          </View>
          <View className='flex-row items-center gap-2'>
            <FontAwesome5 name='check-circle' size={14} color='#10b981' />
            <Text className='text-gray-700 text-sm'>
              Gestiona todos tus pedidos
            </Text>
          </View>
          <View className='flex-row items-center gap-2'>
            <FontAwesome5 name='check-circle' size={14} color='#10b981' />
            <Text className='text-gray-700 text-sm'>
              Estadísticas en tiempo real
            </Text>
          </View>
        </View>
      </View>
    </FormProvider>
  )
}

export default LoginForm
