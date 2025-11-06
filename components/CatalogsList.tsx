import { Catalog } from '@/models'
import { useRouter } from 'expo-router'
import { Pressable, Text, View } from 'react-native'
import ButtonComponent from './ButtonComponent'
import CatalogItem from './CatalogItem'

export default function CatalogsList({ list }: { list: Catalog[] }) {
  const router = useRouter()
  return (
    <View className=' p-3 bg-slate-300 rounded-lg h-auto'>
      {!list.length && (
        <Text className='m-auto'>No tienes catálogos todavía</Text>
      )}
      {list.length && list.length > 0 && (
        <View className='flex-grow gap-2'>
          <Text className=' font-bold'>Últimos catálogos agregados</Text>
          {list.map((c) => (
            <Pressable
              onPress={() => router.push(`/catalogScreen?id=${c.id}`)}
              key={c.id}
            >
              <CatalogItem c={c} />
            </Pressable>
          ))}
        </View>
      )}
      <ButtonComponent
        className='mt-auto'
        onPress={() => router.push('/NewBusiness')}
      >
        Ver todos
      </ButtonComponent>
    </View>
  )
}
