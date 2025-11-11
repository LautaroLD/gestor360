import ButtonComponent from '@/components/ButtonComponent'
import InputForm from '@/components/InputForm'
import ScrollLayout from '@/components/ScrollLayout'
import { Colors } from '@/constants/Colors'
import api from '@/services/config'
import { useStore } from '@/services/store'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Text, View } from 'react-native'

interface NewBusinessFormProps {
  name: string
  description: string
  address: string
  category: string
}

export default function NewBusiness() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user } = useStore((state) => state)
  const methods = useForm<NewBusinessFormProps>()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const registerBusiness = useMutation({
    mutationFn: async (data: NewBusinessFormProps) => {
      const newBusiness = await api.post('/business', {
        ...data,
        ownerId: user?.id,
      })
      return newBusiness
    },
    onSuccess: (data) => {
      if (data.status === 201) {
        router.back()
        queryClient.refetchQueries({ queryKey: ['business'] })
      }
    },
    onError: (error: any) => {
      setErrorMessage(error.response?.data?.message || error.message)
      console.log(error)
    },
  })

  const onSubmit = (data: NewBusinessFormProps) => {
    setErrorMessage(null)
    registerBusiness.mutate(data)
  }

  return (
    <ScrollLayout>
      <View className='gap-6'>
        {/* Header */}
        <LinearGradient
          colors={[Colors.primary, Colors.secondary]}
          className='rounded-3xl shadow-2xl p-6 overflow-hidden'
        >
          <View className='items-center'>
            <View className='bg-white/25 rounded-full p-6 mb-4'>
              <FontAwesome5 name='store' size={48} color='white' />
            </View>
            <Text className='text-white text-3xl font-extrabold mb-2 text-center'>
              Crear Nuevo Negocio
            </Text>
            <Text className='text-white/90 text-base font-medium text-center'>
              Completa la información básica de tu negocio
            </Text>
          </View>
        </LinearGradient>

        {/* Error message */}
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

        {/* Formulario */}
        <View className='bg-white rounded-3xl shadow-2xl p-6'>
          <FormProvider {...methods}>
            <View className='gap-6'>
              {/* Nombre del negocio */}
              <View>
                <View className='flex-row items-center gap-2 mb-3'>
                  <View className='bg-blue-100 rounded-xl p-2'>
                    <FontAwesome5 name='store' size={16} color='#2563eb' />
                  </View>
                  <Text className='text-gray-900 font-extrabold text-lg'>
                    Información Básica
                  </Text>
                </View>

                <View className='gap-5'>
                  <View>
                    <View className='flex-row items-center gap-2 mb-2'>
                      <FontAwesome5 name='tag' size={14} color='#6b7280' />
                      <Text className='text-gray-700 font-bold'>
                        Nombre del Negocio *
                      </Text>
                    </View>
                    <InputForm
                      item={{
                        key: 'name',
                        required: true,
                        minLength: 2,
                        placeholder: 'Ej: Mi Tienda Online',
                      }}
                    />
                  </View>

                  <View>
                    <View className='flex-row items-center gap-2 mb-2'>
                      <FontAwesome5
                        name='align-left'
                        size={14}
                        color='#6b7280'
                      />
                      <Text className='text-gray-700 font-bold'>
                        Descripción *
                      </Text>
                    </View>
                    <InputForm
                      item={{
                        key: 'description',
                        required: true,
                        placeholder: 'Describe tu negocio brevemente...',
                        // multiline: true,
                      }}
                    />
                    <Text className='text-gray-500 text-xs mt-1'>
                      Ayuda a tus clientes a conocer mejor tu negocio
                    </Text>
                  </View>
                </View>
              </View>

              {/* Ubicación */}
              <View>
                <View className='flex-row items-center gap-2 mb-3'>
                  <View className='bg-purple-100 rounded-xl p-2'>
                    <FontAwesome5
                      name='map-marker-alt'
                      size={16}
                      color='#7c3aed'
                    />
                  </View>
                  <Text className='text-gray-900 font-extrabold text-lg'>
                    Ubicación
                  </Text>
                </View>

                <View>
                  <View className='flex-row items-center gap-2 mb-2'>
                    <FontAwesome5 name='home' size={14} color='#6b7280' />
                    <Text className='text-gray-700 font-bold'>Dirección</Text>
                  </View>
                  <InputForm
                    item={{
                      key: 'address',
                      placeholder: 'Calle, número, ciudad...',
                    }}
                  />
                  <Text className='text-gray-500 text-xs mt-1'>
                    Opcional: Ayuda a tus clientes a encontrarte
                  </Text>
                </View>
              </View>

              {/* Categoría */}
              <View>
                <View className='flex-row items-center gap-2 mb-3'>
                  <View className='bg-amber-100 rounded-xl p-2'>
                    <FontAwesome5 name='th-large' size={16} color='#d97706' />
                  </View>
                  <Text className='text-gray-900 font-extrabold text-lg'>
                    Categoría
                  </Text>
                </View>

                <View>
                  <View className='flex-row items-center gap-2 mb-2'>
                    <FontAwesome5 name='list' size={14} color='#6b7280' />
                    <Text className='text-gray-700 font-bold'>
                      Categoría o Sector
                    </Text>
                  </View>
                  <InputForm
                    item={{
                      key: 'category',
                      placeholder: 'Ej: Restaurante, Tienda, Servicios...',
                    }}
                  />
                  <Text className='text-gray-500 text-xs mt-1'>
                    Opcional: Clasifica tu tipo de negocio
                  </Text>
                </View>
              </View>

              {/* Info importante */}
              <View className='bg-card-info/10 rounded-xl p-4 border border-card-info'>
                <View className='flex-row items-start gap-3'>
                  <FontAwesome5
                    name='info-circle'
                    size={16}
                    color={Colors.card.info}
                  />
                  <View className='flex-1'>
                    <Text className='text-card-info font-bold  mb-1'>
                      Información Importante
                    </Text>
                    <Text className='text-card-info text-sm leading-5'>
                      Los campos marcados con * son obligatorios. Podrás editar
                      esta información más tarde desde la configuración del
                      negocio.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </FormProvider>
        </View>

        {/* Botones de acción */}
        <View className='gap-3'>
          <ButtonComponent
            loading={registerBusiness.isPending}
            primary
            onPress={methods.handleSubmit(onSubmit)}
          >
            <Text>Guardar</Text>
            <ButtonComponent onPress={() => router.back()}></ButtonComponent>
            <Text>Cancelar</Text>
          </ButtonComponent>
        </View>

        {/* Preview */}
        <View className='bg-white rounded-2xl p-5 shadow-lg'>
          <View className='flex-row items-center gap-2 mb-4'>
            <FontAwesome5 name='eye' size={16} color='#6b7280' />
            <Text className='text-gray-900 font-extrabold text-base'>
              Vista Previa
            </Text>
          </View>
          <View className='bg-gray-50 rounded-xl p-4 border border-gray-200'>
            <Text className='text-gray-900 font-bold text-lg mb-2'>
              {methods.watch('name') || 'Nombre del negocio'}
            </Text>
            <Text className='text-gray-600 text-sm mb-3'>
              {methods.watch('description') || 'Descripción del negocio...'}
            </Text>
            {methods.watch('address') && (
              <View className='flex-row items-center gap-2 mb-2'>
                <FontAwesome5 name='map-marker-alt' size={12} color='#6b7280' />
                <Text className='text-gray-700 text-sm'>
                  {methods.watch('address')}
                </Text>
              </View>
            )}
            {methods.watch('category') && (
              <View className='bg-gray-200 px-3 py-1 rounded-lg self-start'>
                <Text className='text-gray-700 text-xs font-bold'>
                  {methods.watch('category')}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollLayout>
  )
}
