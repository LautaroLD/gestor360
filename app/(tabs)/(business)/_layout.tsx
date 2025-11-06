import BackButtonComponent from '@/components/BackButtonComponent'
import { Stack } from 'expo-router'

export default function _layout() {
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
      <Stack.Screen name='index' />
      <Stack.Screen
        name='NewBusiness'
        options={{ title: 'Nuevo negocio', presentation: 'modal' }}
      />
      <Stack.Screen
        name='NewProduct'
        options={{ title: 'Nuevo producto', presentation: 'modal' }}
      />
      <Stack.Screen
        name='NewCatalog'
        options={{ title: 'Nuevo catalogo', presentation: 'modal' }}
      />
      <Stack.Screen name='businessScreen' />
      <Stack.Screen name='productScreen' />
      <Stack.Screen name='catalogScreen' />
    </Stack>
  )
}
