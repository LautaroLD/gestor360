import ScrollLayout from '@/components/ScrollLayout'
import { Stack } from 'expo-router'
import React from 'react'

export default function TabLayout() {
  return (
    <Stack
      screenLayout={({ children }) => {
        return <ScrollLayout>{children}</ScrollLayout>
      }}
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name='login' />
      <Stack.Screen name='register' />
    </Stack>
  )
}
