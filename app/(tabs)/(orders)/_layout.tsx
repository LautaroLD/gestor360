import BackButtonComponent from '@/components/BackButtonComponent'
import { Stack } from 'expo-router'

export default function Layout() {
  return (
    <Stack
      initialRouteName='index'
      screenOptions={{ headerShown: false }}
      screenLayout={({ children, options, navigation }) => (
        <>
          {navigation.canGoBack() && options.title && (
            <BackButtonComponent text={options.title as string} />
          )}
          {children}
        </>
      )}
    >
      <Stack.Screen
        name='index'
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='newOrder'
        options={{
          title: 'Nuevo pedido',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name='orderScreen'
        options={{
          title: 'Detalle del pedido',
          presentation: 'modal',
        }}
      />
    </Stack>
  )
}
