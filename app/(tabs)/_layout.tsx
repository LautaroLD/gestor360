import { Colors } from '@/constants/Colors'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { Tabs } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function TabLayout() {
  const insets = useSafeAreaInsets()
  return (
    <Tabs
      initialRouteName='index'
      screenOptions={{
        headerStatusBarHeight: insets.top,
        headerTintColor: Colors.light.neutral,
        headerStyle: {
          backgroundColor: Colors.light.primary,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.light.primary,
        tabBarActiveBackgroundColor: Colors.light.neutral,
        tabBarInactiveTintColor: Colors.light.neutral,

        tabBarStyle: {
          backgroundColor: Colors.light.primary,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Inicio',
          // header: () => {
          //   return <HeaderComponent title='Inicio' />
          // },
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name='home' color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name='(orders)'
        options={{
          title: 'Mis pedidos',
          // header: () => {
          //   return <HeaderComponent title='Mis pedidos' />
          // },
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name='receipt' color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name='(business)'
        options={{
          title: 'Mis negocios',
          // header: () => {
          //   return <HeaderComponent title='Mis negocios' />
          // },
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name='store' color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name='charts'
        options={{
          title: 'Estadísticas',
          // header: () => {
          //   return <HeaderComponent title='Ajustes' />
          // },
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name='chart-bar' color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name='profile'
        options={{
          title: 'Perfil',
          // header: () => {
          //   return <HeaderComponent title='Perfil' />
          // },
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name='user-circle' color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  )
}
