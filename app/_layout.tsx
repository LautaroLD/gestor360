import ButtonComponent from '@/components/ButtonComponent'
import { useStore } from '@/services/store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import * as Updates from 'expo-updates'
import { useEffect, useState } from 'react'
import { Modal, Text, View } from 'react-native'
import 'react-native-reanimated'
import '../global.css'
const queryClient = new QueryClient()
export default function RootLayout() {
  const [open, setOpen] = useState(false)
  async function onFetchUpdateAsync() {
    try {
      const update = await Updates.checkForUpdateAsync()

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync()
        setOpen(true)
      }
    } catch (error) {
      alert(`Error fetching latest Expo update: ${error}`)
    }
  }
  useEffect(() => {
    if (!(process.env.EXPO_PUBLIC_ENVIRONMENT === 'DEV')) {
      onFetchUpdateAsync()
    }
  }, [])

  const token = useStore((state) => state.token)

  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          header: () => null,
        }}
      >
        <Stack.Protected guard={!token}>
          <Stack.Screen name='(auth)' />
        </Stack.Protected>
        <Stack.Protected guard={!!token}>
          <Stack.Screen name='(tabs)' />
        </Stack.Protected>
      </Stack>
      <Modal animationType='slide' visible={open}>
        <View className=' flex-1 justify-center items-center bg-slate-200 gap-5'>
          <Text className='text-2xl font-bold'>
            Hay una nueva actualización disponible
          </Text>
          <Text className='text-lg'>¿Deseas instalarla ahora?</Text>
          <ButtonComponent
            primary
            onPress={async () => await Updates.reloadAsync()}
          >
            Instalar
          </ButtonComponent>
          <ButtonComponent onPress={async () => setOpen(false)}>
            Cancelar
          </ButtonComponent>
        </View>
      </Modal>
    </QueryClientProvider>
  )
}
