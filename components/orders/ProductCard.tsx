import CurrencyText from '@/components/CurrencyText'
import { Product } from '@/models'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { memo } from 'react'
import { Pressable, Text, View } from 'react-native'

interface ProductCardProps {
  product: Product
  quantity: number
  onAdd: () => void
  onRemove: () => void
}

const ProductCard = memo(function ProductCard({
  product,
  quantity,
  onAdd,
  onRemove,
}: ProductCardProps) {
  return (
    <View
      className={`rounded-2xl p-4 border-2 ${
        quantity > 0
          ? 'bg-purple-50 border-purple-300'
          : 'bg-white border-gray-200'
      }`}
    >
      <View className='flex-row items-start gap-3'>
        <View className='flex-1'>
          <Text className='font-extrabold text-gray-900 text-lg mb-1'>
            {product.title}
          </Text>
          {product.description && (
            <Text className='text-gray-600 text-sm mb-2'>
              {product.description}
            </Text>
          )}
          <View className='flex-row items-center gap-2'>
            <View className='bg-green-100 px-3 py-1 rounded-lg'>
              <CurrencyText
                text={product.price.toString()}
                className='text-green-700 font-bold'
              />
            </View>
            {quantity > 0 && (
              <View className='bg-purple-200 px-3 py-1 rounded-lg'>
                <Text className='text-purple-800 font-bold text-sm'>
                  En pedido: {quantity}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Controles */}
        <View className='flex-row items-center gap-3'>
          <Pressable
            onPress={onRemove}
            className='bg-gray-200 rounded-xl p-3 active:opacity-50'
            disabled={quantity === 0}
          >
            <FontAwesome5
              name='minus'
              size={16}
              color={quantity === 0 ? '#9ca3af' : '#374151'}
            />
          </Pressable>

          <View className='bg-gray-100 px-4 py-2 rounded-xl min-w-[40px] items-center'>
            <Text className='font-extrabold text-gray-900 text-lg'>
              {quantity}
            </Text>
          </View>

          <Pressable
            onPress={onAdd}
            className='bg-purple-600 rounded-xl p-3 active:opacity-50'
          >
            <FontAwesome5 name='plus' size={16} color='white' />
          </Pressable>
        </View>
      </View>
    </View>
  )
})

export default ProductCard
