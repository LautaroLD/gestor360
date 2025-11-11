import RegisterForm from '@/components/RegisterForm'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { LinearGradient } from 'expo-linear-gradient'
import { Link } from 'expo-router'
import React from 'react'
import { Image, ScrollView, Text, View } from 'react-native'

const register = () => {
  return (
    <ScrollView className='flex-1 bg-gray-50'>
      <LinearGradient
        colors={['#8b5cf6', '#7c3aed', '#6d28d9']}
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
            ¡Únete Ahora!
          </Text>
          <Text className='text-white/90 text-lg font-medium text-center'>
            Crea tu cuenta y comienza a gestionar tu negocio
          </Text>
        </View>

        {/* Iconos decorativos */}
        <View className='flex-row justify-around mt-4 opacity-30'>
          <FontAwesome5 name='rocket' size={24} color='white' />
          <FontAwesome5 name='star' size={24} color='white' />
          <FontAwesome5 name='trophy' size={24} color='white' />
          <FontAwesome5 name='crown' size={24} color='white' />
        </View>
      </LinearGradient>

      <View className='px-6 pt-8 pb-12'>
        {/* Card del formulario */}
        <View className='bg-white rounded-3xl shadow-2xl p-6 mb-6'>
          <View className='flex-row items-center gap-3 mb-6'>
            <View className='bg-purple-100 rounded-xl p-3'>
              <FontAwesome5 name='user-plus' size={24} color='#7c3aed' />
            </View>
            <Text className='text-2xl font-extrabold text-gray-900'>
              Crear Cuenta
            </Text>
          </View>

          <RegisterForm />
        </View>

        {/* Link a login */}
        <View className='bg-white rounded-2xl shadow-lg p-5 mb-6'>
          <View className='flex-row items-center justify-center gap-2 flex-wrap'>
            <Text className='text-gray-600 text-base'>
              ¿Ya tienes una cuenta?
            </Text>
            <Link href={'/login'}>
              <View className='bg-purple-600 px-4 py-2 rounded-xl'>
                <Text className='font-bold text-white'>Inicia Sesión</Text>
              </View>
            </Link>
          </View>
        </View>

        {/* Beneficios */}
        <View className='mb-6'>
          <Text className='text-2xl font-extrabold text-gray-900 mb-4 text-center'>
            ¿Por qué Gestor360?
          </Text>
          <View className='gap-4'>
            <LinearGradient
              colors={['#fef3c7', '#fde68a']}
              className='rounded-2xl p-5 shadow-lg'
            >
              <View className='flex-row items-center gap-3 mb-2'>
                <View className='bg-yellow-500 rounded-full p-2'>
                  <FontAwesome5 name='check' size={16} color='white' />
                </View>
                <Text className='font-extrabold text-gray-900 text-lg flex-1'>
                  Gestión Completa
                </Text>
              </View>
              <Text className='text-gray-700 text-sm ml-11'>
                Administra pedidos, productos, clientes y más desde un solo lugar
              </Text>
            </LinearGradient>

            <LinearGradient
              colors={['#dbeafe', '#bfdbfe']}
              className='rounded-2xl p-5 shadow-lg'
            >
              <View className='flex-row items-center gap-3 mb-2'>
                <View className='bg-blue-500 rounded-full p-2'>
                  <FontAwesome5 name='chart-line' size={16} color='white' />
                </View>
                <Text className='font-extrabold text-gray-900 text-lg flex-1'>
                  Estadísticas en Tiempo Real
                </Text>
              </View>
              <Text className='text-gray-700 text-sm ml-11'>
                Visualiza el rendimiento de tu negocio con gráficos y reportes
              </Text>
            </LinearGradient>

            <LinearGradient
              colors={['#d1fae5', '#a7f3d0']}
              className='rounded-2xl p-5 shadow-lg'
            >
              <View className='flex-row items-center gap-3 mb-2'>
                <View className='bg-green-500 rounded-full p-2'>
                  <FontAwesome5 name='mobile-alt' size={16} color='white' />
                </View>
                <Text className='font-extrabold text-gray-900 text-lg flex-1'>
                  Multiplataforma
                </Text>
              </View>
              <Text className='text-gray-700 text-sm ml-11'>
                Accede desde cualquier dispositivo: móvil, tablet o web
              </Text>
            </LinearGradient>

            <LinearGradient
              colors={['#fce7f3', '#fbcfe8']}
              className='rounded-2xl p-5 shadow-lg'
            >
              <View className='flex-row items-center gap-3 mb-2'>
                <View className='bg-pink-500 rounded-full p-2'>
                  <FontAwesome5 name='infinity' size={16} color='white' />
                </View>
                <Text className='font-extrabold text-gray-900 text-lg flex-1'>
                  Negocios Ilimitados
                </Text>
              </View>
              <Text className='text-gray-700 text-sm ml-11'>
                Gestiona múltiples negocios desde una sola cuenta
              </Text>
            </LinearGradient>
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

export default register
