import RegisterForm from '@/components/RegisterForm'
import { Link } from 'expo-router'
import React from 'react'
import { Image, Text, View } from 'react-native'

const register = () => {
  return (
    <View className='flex-1 pt-10'>
      <View className='w-1/2 aspect-square mx-auto '>
        <Image
          source={require('../../assets/images/logo.png')}
          className=' w-full h-full'
        />
      </View>
      <View className='flex-1 gap-10'>
        <Text className='text-3xl font-bold text-center'>Regístrate</Text>
        <RegisterForm />
        <View className='flex-row justify-center gap-2'>
          <Text>¿Ya tienes una cuenta?</Text>
          <Link href={'/login'}>
            <Text className='font-bold und'>Iniciar sesión</Text>
          </Link>
        </View>
      </View>
    </View>
  )
}

export default register
