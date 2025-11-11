import ButtonComponent from '@/components/ButtonComponent'
import ScrollLayout from '@/components/ScrollLayout'
import ClientModal from '@/components/orders/ClientModal'
import ClientStep from '@/components/orders/ClientStep'
import DeliveryStep from '@/components/orders/DeliveryStep'
import OrderHeader from '@/components/orders/OrderHeader'
import ProductsStep from '@/components/orders/ProductsStep'
import { Colors } from '@/constants/Colors'
import { Client, Product } from '@/models'
import api from '@/services/config'
import { useStore } from '@/services/store'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { ActivityIndicator, Text, View } from 'react-native'

interface NewOrderFormProps {
  clientName: string
  clientPhone: string
  clientId: string
  deliveryDate: Date
  deliveryTime: Date
  items: { product: Product; quantity: number }[]
}

export default function NewOrder() {
  // Estados
  const [step, setStep] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [clientSelected, setClientSelected] = useState<Client | null>()
  const [showTimepicker, setShowTimepicker] = useState(false)
  const [showDatepicker, setShowDatepicker] = useState(false)
  const [search, setSearch] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Hooks
  const { business } = useStore((state) => state)
  const queryClient = useQueryClient()
  const router = useRouter()

  // Form
  const methods = useForm<NewOrderFormProps>({
    defaultValues: {
      clientName: '',
      deliveryDate: new Date(),
      deliveryTime: new Date(),
      clientPhone: '',
      items: [],
    },
  })

  // Queries
  const { data: clients, isPending: clientsPending } = useQuery({
    queryKey: ['clients', business?.id],
    queryFn: async () => {
      const res = await api.get<Client[]>('/client/business/' + business?.id)
      return res
    },
  })

  const { data: products, isPending } = useQuery({
    queryKey: ['products', business?.id],
    queryFn: async () => {
      const res = await api.get<Product[]>('/product/business/' + business?.id)
      return res.data
    },
  })

  // Mutation
  const createOrder = useMutation({
    mutationFn: async (data: NewOrderFormProps) => {
      const newOrder = await api.post('/orders', {
        ...data,
        deliveryTime: data.deliveryTime.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'pending',
        client: {
          name: data.clientName,
          phone: data.clientPhone,
          id: data.clientId,
        },
        products: data.items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        businessId: business?.id,
      })
      return newOrder
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['orders'], exact: false })
      queryClient.refetchQueries({ queryKey: ['charts'], exact: false })
      clearForm()
    },
    onError: (error: any) => {
      setErrorMessage(error.response?.data?.message || error.message)
    },
  })

  // Handlers
  const addItemToOrder = (product: Product) => {
    const currentItems = methods.getValues('items')
    const existingItem = currentItems.find(
      (item) => item.product.id === product.id
    )

    if (existingItem) {
      const updatedItems = currentItems.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
      methods.setValue('items', updatedItems)
    } else {
      methods.setValue('items', [...currentItems, { product, quantity: 1 }])
    }
  }

  const removeItemFromOrder = (product: Product) => {
    const currentItems = methods.getValues('items')
    const existingItem = currentItems.find(
      (item) => item.product.id === product.id
    )

    if (existingItem?.quantity && existingItem.quantity > 1) {
      const updatedItems = currentItems.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      methods.setValue('items', updatedItems)
    } else {
      methods.setValue(
        'items',
        currentItems.filter((item) => item.product.id !== product.id)
      )
    }
  }

  const deleteItemFromOrder = (product: Product) => {
    const currentItems = methods.getValues('items')
    methods.setValue(
      'items',
      currentItems.filter((item) => item.product.id !== product.id)
    )
  }

  const onSubmit = (data: NewOrderFormProps) => {
    setErrorMessage(null)
    createOrder.mutate(data)
  }

  const nextStep = async () => {
    const isValid = await methods.trigger(['clientName', 'clientPhone'])
    if (isValid) setStep(step + 1)
  }

  const canProceed = () => {
    if (step === 1) {
      return !!(methods.watch('clientName') && methods.watch('clientPhone'))
    }
    if (step === 2) {
      return !!(methods.watch('items').length > 0)
    }
    return true
  }
  const clearForm = () => {
    setClientSelected(null)
    setStep(1)
    methods.reset()
    router.back()
  }
  // Effects
  useEffect(() => {
    if (clientSelected) {
      methods.setValue('clientName', clientSelected.name)
      methods.setValue('clientPhone', clientSelected.phone)
      methods.setValue('clientId', clientSelected.id)
    }
  }, [clientSelected])

  // Computed values
  const productsFiltered = useMemo(
    () =>
      products?.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      ) || [],
    [products, search]
  )

  const totalAmount = useMemo(
    () =>
      methods
        .watch('items')
        .reduce((acc, p) => acc + p.product.price * p.quantity, 0),
    [methods.watch('items')]
  )

  // Loading state
  if (isPending) {
    return (
      <View className='flex-1 justify-center items-center bg-gray-50'>
        <ActivityIndicator size='large' color='#dc2626' />
        <Text className='text-gray-600 mt-4'>Cargando productos...</Text>
      </View>
    )
  }

  return (
    <ScrollLayout>
      <View className='gap-6'>
        {/* Header con indicador de pasos */}
        <OrderHeader step={step} />

        {/* Error message */}
        {errorMessage && (
          <LinearGradient
            colors={['#fee2e2', '#fecaca']}
            className='p-4 rounded-2xl border-2 border-red-300'
          >
            <View className='flex-row items-center gap-3'>
              <View className='bg-red-500 rounded-full p-2'>
                <FontAwesome5 name='exclamation' size={16} color='white' />
              </View>
              <Text className='flex-1 text-red-800 font-semibold'>
                {errorMessage}
              </Text>
            </View>
          </LinearGradient>
        )}

        <FormProvider {...methods}>
          {/* Paso 1: Cliente */}
          {step === 1 && (
            <ClientStep
              clientSelected={clientSelected}
              onSelectExisting={() => setShowModal(true)}
              onNext={nextStep}
              canProceed={canProceed()}
            />
          )}

          {/* Paso 2: Productos */}
          {step === 2 && (
            <ProductsStep
              products={productsFiltered}
              selectedItems={methods.watch('items')}
              search={search}
              onSearchChange={setSearch}
              onAddProduct={addItemToOrder}
              onRemoveProduct={removeItemFromOrder}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
              canProceed={canProceed()}
              totalAmount={totalAmount}
            />
          )}

          {/* Paso 3: Entrega */}
          {step === 3 && (
            <DeliveryStep
              showDatepicker={showDatepicker}
              showTimepicker={showTimepicker}
              onShowDatepicker={setShowDatepicker}
              onShowTimepicker={setShowTimepicker}
              selectedItems={methods.watch('items')}
              totalAmount={totalAmount}
              onDeleteItem={deleteItemFromOrder}
              onBack={() => setStep(2)}
              onSubmit={methods.handleSubmit(onSubmit)}
              isLoading={createOrder.isPending}
              clientName={methods.watch('clientName')}
              clientPhone={methods.watch('clientPhone')}
              deliveryDate={methods.watch('deliveryDate')}
              deliveryTime={methods.watch('deliveryTime')}
            />
          )}
        </FormProvider>
        <ButtonComponent
          onPress={clearForm}
          className='border border-secondary'
        >
          <Text className='text-secondary font-bold'>Cancelar Pedido</Text>
          <FontAwesome5 name='trash' size={16} color={Colors.secondary} />
        </ButtonComponent>
        {/* Modal Clientes */}
        <ClientModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          clients={clients?.data || []}
          selectedClient={clientSelected}
          onSelectClient={setClientSelected}
          isLoading={clientsPending}
        />
      </View>
    </ScrollLayout>
  )
}
