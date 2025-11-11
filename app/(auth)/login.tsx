import LoginForm from '@/components/LoginForm'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { LinearGradient } from 'expo-linear-gradient'
import { Link } from 'expo-router'
import React from 'react'
import { Image, ScrollView, Text, View } from 'react-native'

const login = () => {
  return (
    <ScrollView className='flex-1 bg-gray-50'>
      <LinearGradient
        colors={['#dc2626', '#b91c1c', '#991b1b']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className='pt-16 pb-8 px-6 rounded-b-[40px]'
      >
        <View className='items-center mb-6'>
          <View className='bg-white/20 rounded-full p-6 mb-4 shadow-2xl'>
            <View className='bg-white rounded-full p-8'>
              <Image
                source={require('../../assets/images/logo.png')}
                className='w-24 h-24'
                resizeMode='contain'
              />
            </View>
          </View>
          <Text className='text-white text-4xl font-extrabold mb-2'>
            ¡Bienvenido!
          </Text>
          <Text className='text-white/90 text-lg font-medium'>
            Inicia sesión para continuar
          </Text>
        </View>

        {/* Iconos decorativos */}
        <View className='flex-row justify-around mt-4 opacity-30'>
          <FontAwesome5 name='store' size={24} color='white' />
          <FontAwesome5 name='chart-line' size={24} color='white' />
          <FontAwesome5 name='users' size={24} color='white' />
          <FontAwesome5 name='box' size={24} color='white' />
        </View>
      </LinearGradient>

      <View className='px-6 pt-8 pb-12'>
        {/* Card del formulario */}
        <View className='bg-white rounded-3xl shadow-2xl p-6 mb-6'>
          <View className='flex-row items-center gap-3 mb-6'>
            <View className='bg-red-100 rounded-xl p-3'>
              <FontAwesome5 name='user-circle' size={24} color='#dc2626' />
            </View>
            <Text className='text-2xl font-extrabold text-gray-900'>
              Iniciar Sesión
            </Text>
          </View>

          <LoginForm />
        </View>

        {/* Link a registro */}
        <View className='bg-white rounded-2xl shadow-lg p-5'>
          <View className='flex-row items-center justify-center gap-2'>
            <Text className='text-gray-600 text-base'>
              ¿No tienes una cuenta?
            </Text>
            <Link href={'/register'}>
              <View className='bg-red-600 px-4 py-2 rounded-xl'>
                <Text className='font-bold text-white'>Regístrate Aquí</Text>
              </View>
            </Link>
          </View>
        </View>

        {/* Features */}
        <View className='mt-8 gap-4'>
          <View className='flex-row items-center gap-3 bg-white rounded-2xl p-4 shadow-md'>
            <View className='bg-blue-100 rounded-xl p-3'>
              <FontAwesome5 name='shield-alt' size={20} color='#2563eb' />
            </View>
            <View className='flex-1'>
              <Text className='font-bold text-gray-900 text-base'>
                Seguro y Confiable
              </Text>
              <Text className='text-gray-600 text-sm'>
                Tus datos están protegidos
              </Text>
            </View>
          </View>

          <View className='flex-row items-center gap-3 bg-white rounded-2xl p-4 shadow-md'>
            <View className='bg-green-100 rounded-xl p-3'>
              <FontAwesome5 name='clock' size={20} color='#059669' />
            </View>
            <View className='flex-1'>
              <Text className='font-bold text-gray-900 text-base'>
                Acceso Rápido
              </Text>
              <Text className='text-gray-600 text-sm'>
                Gestiona tus pedidos al instante
              </Text>
            </View>
          </View>

          <View className='flex-row items-center gap-3 bg-white rounded-2xl p-4 shadow-md'>
            <View className='bg-purple-100 rounded-xl p-3'>
              <FontAwesome5 name='mobile-alt' size={20} color='#7c3aed' />
            </View>
            <View className='flex-1'>
              <Text className='font-bold text-gray-900 text-base'>
                En Cualquier Lugar
              </Text>
              <Text className='text-gray-600 text-sm'>
                Accede desde tu móvil o tablet
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View className='mt-8 items-center'>
          <Text className='text-gray-400 text-sm'>Gestor360 v1.0.0</Text>
          <Text className='text-gray-400 text-xs mt-1'>
            © 2025 Todos los derechos reservados
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}

export default login
