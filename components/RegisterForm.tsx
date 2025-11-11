import api from '@/services/config'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { useMutation } from '@tanstack/react-query'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Text, TouchableOpacity, View } from 'react-native'
import InputForm from './InputForm'

interface RegisterFormProps {
  firstName: string
  lastName: string
  email: string
  password: string
  phone: string
  birthday?: Date
}

const RegisterForm = () => {
  const router = useRouter()
  const methods = useForm<RegisterFormProps>()
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [step, setStep] = useState(1)

  const registerUser = useMutation({
    mutationFn: async (data: RegisterFormProps) => {
      const newUser = await api.post('/users', data)
      return newUser
    },
    onSuccess: (data) => {
      if (data.status === 201) {
        router.replace('/login')
      }
    },
    onError: (error: any) => {
      setErrorMessage(error.response?.data?.message || error.message)
      console.log(error)
    },
  })

  const onSubmit = (data: RegisterFormProps) => {
    setErrorMessage(null)
    registerUser.mutate(data)
  }

  const nextStep = async () => {
    const isValid = await methods.trigger(['firstName', 'lastName'])
    if (isValid) setStep(2)
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

        {/* Indicador de pasos */}
        <View className='flex-row gap-2 mb-2'>
          <View
            className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-purple-600' : 'bg-gray-200'}`}
          />
          <View
            className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-purple-600' : 'bg-gray-200'}`}
          />
        </View>

        {step === 1 && (
          <>
            <View>
              <View className='flex-row items-center gap-2 mb-4'>
                <View className='bg-purple-100 rounded-full p-2'>
                  <FontAwesome5 name='user' size={16} color='#7c3aed' />
                </View>
                <Text className='text-2xl font-extrabold text-gray-900'>
                  Paso 1: Información Personal
                </Text>
              </View>

              <View className='gap-5'>
                <View>
                  <View className='flex-row items-center gap-2 mb-2'>
                    <FontAwesome5 name='user' size={14} color='#6b7280' />
                    <Text className='text-gray-700 font-bold'>Nombre</Text>
                  </View>
                  <InputForm
                    item={{
                      label: '',
                      key: 'firstName',
                      required: true,
                      minLength: 2,
                      placeholder: 'Tu nombre',
                    }}
                  />
                </View>

                <View>
                  <View className='flex-row items-center gap-2 mb-2'>
                    <FontAwesome5 name='user-tag' size={14} color='#6b7280' />
                    <Text className='text-gray-700 font-bold'>Apellido</Text>
                  </View>
                  <InputForm
                    item={{
                      label: '',
                      key: 'lastName',
                      required: true,
                      minLength: 2,
                      placeholder: 'Tu apellido',
                    }}
                  />
                </View>

                <View className='flex-row gap-3'>
                  <View className='flex-1'>
                    <View className='flex-row items-center gap-2 mb-2'>
                      <FontAwesome5 name='phone' size={14} color='#6b7280' />
                      <Text className='text-gray-700 font-bold'>Teléfono</Text>
                    </View>
                    <InputForm
                      item={{
                        label: '',
                        key: 'phone',
                        type: 'phone-pad',
                        placeholder: '+54 11 1234-5678',
                      }}
                    />
                  </View>
                  <View className='flex-1'>
                    <View className='flex-row items-center gap-2 mb-2'>
                      <FontAwesome5 name='birthday-cake' size={14} color='#6b7280' />
                      <Text className='text-gray-700 font-bold text-sm'>
                        Nacimiento
                      </Text>
                    </View>
                    <InputForm
                      item={{
                        label: '',
                        key: 'birthday',
                        type: 'number-pad',
                        placeholder: 'DD/MM/AAAA',
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>

            <TouchableOpacity onPress={nextStep}>
              <LinearGradient
                colors={['#8b5cf6', '#7c3aed']}
                className='rounded-2xl shadow-xl p-5'
              >
                <View className='flex-row items-center justify-center gap-3'>
                  <Text className='text-white font-extrabold text-lg'>
                    Siguiente
                  </Text>
                  <FontAwesome5 name='arrow-right' size={20} color='white' />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}

        {step === 2 && (
          <>
            <View>
              <View className='flex-row items-center gap-2 mb-4'>
                <View className='bg-purple-100 rounded-full p-2'>
                  <FontAwesome5 name='lock' size={16} color='#7c3aed' />
                </View>
                <Text className='text-2xl font-extrabold text-gray-900'>
                  Paso 2: Credenciales
                </Text>
              </View>

              <View className='gap-5'>
                <View>
                  <View className='flex-row items-center gap-2 mb-2'>
                    <FontAwesome5 name='envelope' size={14} color='#6b7280' />
                    <Text className='text-gray-700 font-bold'>
                      Correo Electrónico
                    </Text>
                  </View>
                  <InputForm
                    item={{
                      label: '',
                      key: 'email',
                      type: 'email-address',
                      pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      required: true,
                      placeholder: 'ejemplo@correo.com',
                      errorMessage: 'Formato de correo incorrecto',
                    }}
                  />
                </View>

                <View>
                  <View className='flex-row items-center justify-between mb-2'>
                    <View className='flex-row items-center gap-2'>
                      <FontAwesome5 name='lock' size={14} color='#6b7280' />
                      <Text className='text-gray-700 font-bold'>Contraseña</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      className='flex-row items-center gap-2'
                    >
                      <FontAwesome5
                        name={showPassword ? 'eye-slash' : 'eye'}
                        size={14}
                        color='#7c3aed'
                      />
                      <Text className='text-purple-600 font-semibold text-sm'>
                        {showPassword ? 'Ocultar' : 'Mostrar'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <InputForm
                    item={{
                      label: '',
                      key: 'password',
                      secureTextEntry: !showPassword,
                      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
                      errorMessage:
                        'Mínimo 6 caracteres, una mayúscula, una minúscula y un número.',
                      required: true,
                      placeholder: '••••••••',
                    }}
                  />
                  
                  {/* Requisitos de contraseña */}
                  <View className='bg-gray-50 rounded-xl p-3 gap-1 mt-2'>
                    <Text className='text-gray-700 font-semibold text-xs mb-1'>
                      Tu contraseña debe tener:
                    </Text>
                    <View className='flex-row items-center gap-2'>
                      <FontAwesome5 name='check-circle' size={10} color='#6b7280' />
                      <Text className='text-gray-600 text-xs'>
                        Mínimo 6 caracteres
                      </Text>
                    </View>
                    <View className='flex-row items-center gap-2'>
                      <FontAwesome5 name='check-circle' size={10} color='#6b7280' />
                      <Text className='text-gray-600 text-xs'>
                        Una letra mayúscula
                      </Text>
                    </View>
                    <View className='flex-row items-center gap-2'>
                      <FontAwesome5 name='check-circle' size={10} color='#6b7280' />
                      <Text className='text-gray-600 text-xs'>
                        Una letra minúscula
                      </Text>
                    </View>
                    <View className='flex-row items-center gap-2'>
                      <FontAwesome5 name='check-circle' size={10} color='#6b7280' />
                      <Text className='text-gray-600 text-xs'>Un número</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View className='flex-row gap-3'>
              <TouchableOpacity
                onPress={() => setStep(1)}
                className='flex-1 bg-gray-200 rounded-2xl p-5'
              >
                <View className='flex-row items-center justify-center gap-2'>
                  <FontAwesome5 name='arrow-left' size={16} color='#374151' />
                  <Text className='text-gray-700 font-bold text-base'>
                    Atrás
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={methods.handleSubmit(onSubmit)}
                disabled={registerUser.isPending}
                className='flex-1'
              >
                <LinearGradient
                  colors={['#8b5cf6', '#7c3aed']}
                  className='rounded-2xl shadow-xl p-5'
                >
                  <View className='flex-row items-center justify-center gap-3'>
                    {registerUser.isPending ? (
                      <>
                        <FontAwesome5 name='spinner' size={18} color='white' />
                        <Text className='text-white font-extrabold text-base'>
                          Creando...
                        </Text>
                      </>
                    ) : (
                      <>
                        <FontAwesome5 name='user-check' size={18} color='white' />
                        <Text className='text-white font-extrabold text-base'>
                          Registrarse
                        </Text>
                      </>
                    )}
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </FormProvider>
  )
}

export default RegisterForm
