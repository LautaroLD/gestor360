import LoginForm from '@/components/LoginForm'
import { Link } from 'expo-router'
import React from 'react'
import { Image, Text, View } from 'react-native'

const login = () => {
  return (
    <View className='flex-1 pt-10'>
      <View className='w-1/2 aspect-square mx-auto '>
        <Image
          source={require('../../assets/images/logo.png')}
          className=' w-full h-full'
        />
      </View>
      <View className='flex-1 gap-10'>
        <Text className='text-3xl font-bold text-center'>Iniciar sesión</Text>
        <LoginForm />
        <View className='flex-row justify-center gap-2 '>
          <Text>¿No tienes una cuenta?</Text>
          <Link href={'/register'}>
            <Text className='font-bold underline'>Regístrate</Text>
          </Link>
        </View>
      </View>
    </View>
  )
}

export default login
