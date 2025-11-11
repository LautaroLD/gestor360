import CurrencyText from '@/components/CurrencyText'
import ProductCard from '@/components/orders/ProductCard'
import { Product } from '@/models'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { LinearGradient } from 'expo-linear-gradient'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import ButtonComponent from '../ButtonComponent'

interface ProductsStepProps {
  products: Product[]
  selectedItems: { product: Product; quantity: number }[]
  search: string
  onSearchChange: (text: string) => void
  onAddProduct: (product: Product) => void
  onRemoveProduct: (product: Product) => void
  onBack: () => void
  onNext: () => void
  canProceed: boolean
  totalAmount: number
}

export default function ProductsStep({
  products,
  selectedItems,
  search,
  onSearchChange,
  onAddProduct,
  onRemoveProduct,
  onBack,
  onNext,
  canProceed,
  totalAmount,
}: ProductsStepProps) {
  return (
    <View className='gap-6'>
      <View className='bg-white rounded-3xl shadow-2xl p-6 gap-6'>
        {/* Header */}
        <View className='flex-row items-center gap-3'>
          <View className='bg-purple-100 rounded-xl p-3'>
            <FontAwesome5 name='box' size={24} color='#7c3aed' />
          </View>
          <View className='flex-1'>
            <Text className='text-2xl font-extrabold text-gray-900'>
              Paso 2: Productos
            </Text>
            <Text className='text-gray-600 text-sm'>
              Selecciona los productos
            </Text>
          </View>
        </View>

        {/* Buscador */}
        <View className='bg-gray-50 rounded-2xl'>
          <View className='flex-row items-center px-4 py-2'>
            <FontAwesome5 name='search' size={18} color='#9ca3af' />
            <TextInput
              placeholder='Buscar producto...'
              value={search}
              onChangeText={onSearchChange}
              className='flex-1 ml-3 text-base text-gray-800'
              placeholderTextColor='#9ca3af'
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => onSearchChange('')}>
                <FontAwesome5 name='times-circle' size={18} color='#9ca3af' />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Lista productos */}
        <View className='gap-3'>
          {products.length === 0 && (
            <View className='bg-gray-100 rounded-xl p-8 items-center'>
              <FontAwesome5 name='box-open' size={48} color='#9ca3af' />
              <Text className='text-gray-600 font-semibold mt-4'>
                {search
                  ? 'No se encontraron productos'
                  : 'No hay productos disponibles'}
              </Text>
            </View>
          )}

          {products.map((product) => {
            const itemInOrder = selectedItems.find(
              (item) => item.product.id === product.id
            )
            const quantity = itemInOrder?.quantity || 0

            return (
              <ProductCard
                key={product.id}
                product={product}
                quantity={quantity}
                onAdd={() => onAddProduct(product)}
                onRemove={() => onRemoveProduct(product)}
              />
            )
          })}
        </View>
      </View>

      {/* Resumen flotante */}
      {selectedItems.length > 0 && (
        <LinearGradient
          colors={['#7c3aed', '#6d28d9']}
          className='rounded-2xl shadow-2xl p-5 overflow-hidden'
        >
          <View className='flex-row justify-between items-center mb-3'>
            <Text className='text-white font-extrabold text-lg'>
              Total del Pedido
            </Text>
            <View className='bg-white/20 px-3 py-1 rounded-lg'>
              <Text className='text-white font-bold'>
                {selectedItems.length} productos
              </Text>
            </View>
          </View>
          <View className='bg-white/20 rounded-xl p-3'>
            <CurrencyText
              text={totalAmount.toString()}
              className='text-white font-extrabold text-3xl text-center'
            />
          </View>
        </LinearGradient>
      )}

      {/* Botones navegación */}
      <View className='flex-row gap-3 justify-between items-center '>
        <ButtonComponent onPress={onBack} className='bg-card-neutral '>
          <View className='flex-row items-center justify-center gap-2'>
            <FontAwesome5 name='arrow-left' size={16} color='#374151' />
            <Text className='text-gray-700 font-bold'>Atrás</Text>
          </View>
        </ButtonComponent>

        <ButtonComponent
          onPress={onNext}
          disabled={!canProceed}
          className='bg-card-success'
          // className={`flex-1 ${!canProceed ? 'opacity-50' : ''}`}
        >
          <View className='flex-row items-center justify-center gap-2'>
            <Text className='text-white font-extrabold'>Siguiente</Text>
            <FontAwesome5 name='arrow-right' size={16} color='white' />
          </View>
        </ButtonComponent>
      </View>
    </View>
  )
}
