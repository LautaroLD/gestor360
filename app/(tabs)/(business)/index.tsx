import ButtonComponent from '@/components/ButtonComponent'
import TextComponent from '@/components/TextComponent'
import { Colors } from '@/constants/Colors'
import { Business } from '@/models'
import api from '@/services/config'
import { useStore } from '@/services/store'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { useQuery } from '@tanstack/react-query'
import { LinearGradient } from 'expo-linear-gradient'
import { RelativePathString, useRouter } from 'expo-router'
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

export default function BusinessScreen() {
  const {
    user,
    setBusiness,
    business: selectedBusiness,
  } = useStore((state) => state)
  const router = useRouter()

  const {
    data: business,
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey: ['business'],
    queryFn: async () => {
      return await api.get<Business[]>('/business/user/' + user?.id)
    },
  })

  if (isPending) {
    return (
      <View className='flex-1 justify-center items-center bg-gray-50'>
        <View className='bg-white rounded-3xl p-8 shadow-xl'>
          <ActivityIndicator size='large' color='#dc2626' />
          <Text className='text-gray-600 mt-4 font-medium text-center'>
            Cargando negocios...
          </Text>
        </View>
      </View>
    )
  }

  if (error) {
    return (
      <View className='flex-1 justify-center items-center p-6 bg-gray-50'>
        <View className='bg-red-50 p-8 rounded-3xl border border-red-200 shadow-lg'>
          <View className='items-center mb-4'>
            <View className='bg-red-100 rounded-full p-4'>
              <FontAwesome5
                name='exclamation-triangle'
                size={40}
                color='#dc2626'
              />
            </View>
          </View>
          <Text className='text-red-800 text-center font-bold text-xl mb-2'>
            Error al cargar
          </Text>
          <Text className='text-red-600 text-center text-sm mb-6'>
            No pudimos cargar tus negocios
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            className='bg-red-600 p-4 rounded-xl'
          >
            <View className='flex-row items-center justify-center gap-2'>
              <FontAwesome5 name='redo' size={16} color='white' />
              <Text className='text-white font-bold'>Reintentar</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <ScrollView className='flex-1 bg-gray-50'>
      <View className='p-6 gap-6'>
        {/* Header */}
        <LinearGradient
          colors={[Colors.primary, Colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className='rounded-3xl shadow-2xl p-6 overflow-hidden'
        >
          <View className='flex-row items-center gap-3 mb-4'>
            <View className='bg-white/25 rounded-2xl p-3'>
              <FontAwesome5 name='store' size={28} color='white' />
            </View>
            <View className='flex-1'>
              <Text className='text-white text-3xl font-extrabold'>
                Mis Negocios
              </Text>
              <Text className='text-white/90 text-sm font-medium mt-0.5'>
                Gestiona tus negocios activos
              </Text>
            </View>
          </View>
          <View className='bg-white/20 rounded-xl px-3 py-2'>
            <Text className='text-white text-xs text-center font-semibold'>
              {business?.data.length || 0}{' '}
              {business?.data.length === 1
                ? 'negocio registrado'
                : 'negocios registrados'}
            </Text>
          </View>
        </LinearGradient>

        {/* Info card si tiene negocio seleccionado */}
        {selectedBusiness && (
          <View className='bg-card-info/30 rounded-2xl p-5 border-2 border-card-info'>
            <View className='flex-row items-center gap-3 mb-2'>
              <View className='bg-card-info rounded-full p-2'>
                <FontAwesome5 name='check' size={14} color='white' />
              </View>
              <Text className=' font-extrabold text-base'>Negocio Activo</Text>
            </View>
            <Text className=' font-bold text-lg ml-9'>
              {selectedBusiness.name}
            </Text>
            <Text className=' text-sm ml-9'>
              Este es tu negocio actualmente seleccionado
            </Text>
          </View>
        )}

        {/* Lista de negocios */}
        {business && business.data.length > 0 ? (
          <View className='gap-4'>
            <View className='flex-row items-center justify-between'>
              <Text className='text-2xl font-extrabold text-gray-900'>
                Todos los Negocios
              </Text>
              <ButtonComponent onPress={() => router.push('/NewBusiness')}>
                <FontAwesome5
                  name='plus'
                  size={24}
                  color={Colors.primary}
                  className='mr-2'
                />
              </ButtonComponent>
            </View>

            {business.data.map((biz, index) => {
              const isSelected = selectedBusiness?.id === biz.id

              return (
                <View key={biz.id}>
                  <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className='rounded-3xl shadow-2xl overflow-hidden'
                    colors={
                      isSelected
                        ? [Colors.primary, Colors.secondary]
                        : ['#ffffff', '#f9fafb']
                    }
                  >
                    <View className='p-5'>
                      {/* Header del negocio */}
                      <View className='flex-row items-start gap-3 mb-4'>
                        {/* Radio button personalizado */}
                        <Pressable
                          onPress={() => setBusiness(biz)}
                          className={` rounded-full border-2 bg-white w-8 h-8 ${isSelected ? 'border-primary' : 'border-gray-300'} items-center justify-center `}
                        >
                          {isSelected && (
                            <FontAwesome5
                              name='check'
                              size={16}
                              color={Colors.primary}
                            />
                          )}
                        </Pressable>

                        {/* Info del negocio */}
                        <View className='flex-1'>
                          <View className='flex-row items-center gap-2 mb-2'>
                            <TextComponent
                              color={isSelected ? 'white' : 'gray-700'}
                              className='font-extrabold  text-xl flex-1'
                            >
                              {biz.name}
                            </TextComponent>
                          </View>

                          {/* Detalles */}
                          <View className='gap-2'>
                            <View className='flex-row items-center gap-2'>
                              <FontAwesome5
                                name='box'
                                size={12}
                                color={isSelected ? 'white' : '#6b7280'}
                              />
                              <TextComponent
                                color={isSelected ? 'white' : 'gray-700'}
                                className=' text-sm'
                              >
                                {biz.products?.length || 0} productos
                              </TextComponent>
                            </View>

                            <View className='flex-row items-center gap-2'>
                              <FontAwesome5
                                name='receipt'
                                size={12}
                                color={isSelected ? 'white' : '#6b7280'}
                              />
                              <TextComponent
                                color={isSelected ? 'white' : 'gray-700'}
                                className=' text-sm'
                              >
                                {biz.orders?.length || 0} pedidos
                              </TextComponent>
                            </View>
                          </View>

                          {isSelected && (
                            <View className='bg-red-100 rounded-lg px-3 py-1.5 mt-3 self-start'>
                              <View className='flex-row items-center gap-2'>
                                <FontAwesome5
                                  name='check-circle'
                                  size={12}
                                  color={Colors.primary}
                                />
                                <Text className='text-primary font-bold text-xs'>
                                  NEGOCIO ACTIVO
                                </Text>
                              </View>
                            </View>
                          )}
                        </View>

                        {/* Botón de detalles */}
                        <ButtonComponent
                          onPress={() => {
                            const url = `/businessScreen?id=${biz.id}`
                            router.push(url as RelativePathString)
                          }}
                        >
                          <TextComponent
                            color={isSelected ? 'white' : 'gray-700'}
                            className='font-bold underline'
                          >
                            Detalles
                          </TextComponent>
                        </ButtonComponent>
                      </View>
                    </View>
                  </LinearGradient>
                </View>
              )
            })}
          </View>
        ) : (
          <LinearGradient
            colors={['#f9fafb', '#f3f4f6']}
            className='rounded-3xl p-10 items-center shadow-lg'
          >
            <View className='bg-white rounded-full p-8 mb-6 shadow-md'>
              <FontAwesome5 name='store-slash' size={60} color='#9ca3af' />
            </View>
            <Text className='text-gray-800 font-extrabold text-2xl mb-3 text-center'>
              No tienes negocios
            </Text>
            <Text className='text-gray-600 text-center text-base leading-6 mb-6'>
              Crea tu primer negocio para comenzar a gestionar pedidos y
              productos
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/NewBusiness')}
              className='bg-purple-600 px-6 py-3 rounded-xl'
            >
              <View className='flex-row items-center gap-2'>
                <FontAwesome5 name='plus' size={16} color='white' />
                <Text className='text-white font-bold'>Crear Negocio</Text>
              </View>
            </TouchableOpacity>
          </LinearGradient>
        )}

        {/* Tips */}
        <View className='bg-white rounded-2xl p-5 shadow-lg'>
          <View className='flex-row items-center gap-2 mb-4'>
            <FontAwesome5 name='lightbulb' size={18} color='#f59e0b' />
            <Text className='text-gray-900 font-extrabold text-lg'>
              Tips para tu Negocio
            </Text>
          </View>
          <View className='gap-3'>
            <View className='flex-row gap-3'>
              <Text className='text-amber-500 font-bold'>•</Text>
              <Text className='text-gray-700 text-sm flex-1 leading-5'>
                Mantén actualizada la información de tu negocio
              </Text>
            </View>
            <View className='flex-row gap-3'>
              <Text className='text-amber-500 font-bold'>•</Text>
              <Text className='text-gray-700 text-sm flex-1 leading-5'>
                Agrega productos con descripciones claras
              </Text>
            </View>
            <View className='flex-row gap-3'>
              <Text className='text-amber-500 font-bold'>•</Text>
              <Text className='text-gray-700 text-sm flex-1 leading-5'>
                Responde rápido a los pedidos para mejorar la experiencia
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
