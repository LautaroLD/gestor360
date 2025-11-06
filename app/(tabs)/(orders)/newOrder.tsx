import ButtonComponent from '@/components/ButtonComponent'
import CurrencyText from '@/components/CurrencyText'
import InputForm from '@/components/InputForm'
import ScrollLayout from '@/components/ScrollLayout'
import { Client, Product } from '@/models'
import api from '@/services/config'
import { useStore } from '@/services/store'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { FlatList, Modal, Pressable, Text, View } from 'react-native'
interface NewOrderFormProps {
  clientName: string
  clientPhone: string
  clientId: string
  deliveryDate: Date
  deliveryTime: Date
  items: { product: Product; quantity: number }[]
}
export default function NewOrder() {
  const [showModal, setShowModal] = useState(false)
  const [clientSelected, setClientSelected] = useState<Client | null>()
  const [showTimepicker, setShowTimepicker] = useState(false)
  const [showDatepicker, setShowDatepicker] = useState(false)
  const { business } = useStore((state) => state)
  const queryClient = useQueryClient()
  const router = useRouter()
  const methods = useForm<NewOrderFormProps>({
    defaultValues: {
      clientName: '',
      deliveryDate: new Date(),
      deliveryTime: new Date(),
      clientPhone: '',
      items: [],
    },
  })
  const {
    data: clients,
    isPending: clientsPending,
    error: clientsError,
  } = useQuery({
    queryKey: ['clients', business?.id],
    queryFn: async () => {
      const res = await api.get<Client[]>('/client/business/' + business?.id)

      return res
    },
  })
  const {
    data: products,
    isPending,
    error,
  } = useQuery({
    queryKey: ['products', business?.id],
    queryFn: async () => {
      const res = await api.get<Product[]>('/product/business/' + business?.id)

      return res
    },
  })
  const createOrder = useMutation({
    mutationFn: async (data: NewOrderFormProps) => {
      const newOrder = await api.post('/orders', {
        ...data,
        deliveryDate: data.deliveryDate.toLocaleDateString('en-GB'),
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
      queryClient.refetchQueries({
        queryKey: ['orders'],
        exact: false,
      })
      queryClient.refetchQueries({ queryKey: ['charts'], exact: false })

      router.back()
    },
    onError: (error) => console.log(error),
  })
  const onSubmit = (data: NewOrderFormProps) => createOrder.mutate(data)

  const addItemToOrder = (product: Product) => {
    const currentItems = methods.getValues('items')
    const existingItem = currentItems.find(
      (item) => item.product.id === product.id
    )

    if (existingItem) {
      const updatedItems = currentItems.map((item) => {
        if (item.product.id === product.id) {
          return { ...item, quantity: item.quantity + 1 }
        }
        return item
      })
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
      const updatedItems = currentItems.map((item) => {
        if (item.product.id === product.id) {
          return { ...item, quantity: item.quantity - 1 }
        }
        return item
      })
      methods.setValue('items', updatedItems)
    } else {
      methods.setValue('items', [
        ...currentItems.filter((item) => item.product.id !== product.id),
      ])
    }
  }
  useEffect(() => {
    if (clientSelected) {
      methods.setValue('clientName', clientSelected.name)
      methods.setValue('clientPhone', clientSelected.phone)
      methods.setValue('clientId', clientSelected.id)
    }
  }, [clientSelected])
  if (isPending) return <Text>Loading...</Text>
  if (error) return <Text>{error.message}</Text>
  return (
    <ScrollLayout>
      <View className='w-2/3'>
        <ButtonComponent primary onPress={() => setShowModal(true)}>
          <Text className='text-base'>Seleccionar cliente existente</Text>
        </ButtonComponent>
      </View>
      <Modal
        animationType='slide'
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        {clients && clients.data.length === 0 && (
          <Text className='text-center p-4'>No hay clientes</Text>
        )}
        {clients && clients.data.length > 0 && (
          <FlatList
            data={clients?.data}
            className='bg-slate-100'
            contentContainerClassName='gap-4 p-4 '
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  setClientSelected(item)
                  setShowModal(false)
                }}
                className={`border rounded-lg bg-slate-50 gap-2 p-2 ${item.id === clientSelected?.id ? 'border-primary' : 'border-gray-300'}`}
              >
                <Text className='font-bold'>{item.name}</Text>
                <Text>
                  Teléfono: <Text className='font-bold'>({item.phone})</Text>
                </Text>
              </Pressable>
            )}
          />
        )}
      </Modal>

      <View className='gap-10 '>
        <FormProvider {...methods}>
          <View className='flex-row gap-4'>
            <InputForm
              item={{
                label: 'Nombre',
                key: 'clientName',
                required: true,
                minLength: 2,
              }}
            />
            <InputForm
              item={{
                label: 'Teléfono',
                key: 'clientPhone',
                type: 'phone-pad',
                required: true,
              }}
            />
          </View>
          <Controller
            name='deliveryDate'
            control={{
              ...methods.control,
            }}
            rules={{
              required: {
                value: true,
                message: 'Este campo es requerido.',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Pressable
                onPress={() => {
                  setShowDatepicker(true)
                }}
              >
                <Text className='font-bold text-gray-500 pl-2'>
                  Fecha de entrega
                </Text>
                <Text className='p-4 border-b border-gray-400'>
                  {new Date(value).toLocaleDateString()}
                </Text>
                {showDatepicker && (
                  <DateTimePicker
                    timeZoneName='AR'
                    testID='dateTimePicker'
                    value={value}
                    mode={'date'}
                    is24Hour={true}
                    onChange={(_, date) => {
                      onChange(date)
                      setShowDatepicker(false)
                    }}
                  />
                )}
              </Pressable>
            )}
          />
          <Controller
            name='deliveryTime'
            control={{
              ...methods.control,
            }}
            rules={{
              required: {
                value: true,
                message: 'Este campo es requerido.',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Pressable
                onPress={() => {
                  setShowTimepicker(true)
                }}
              >
                <Text className='font-bold text-gray-500 pl-2'>
                  Hora de entrega
                </Text>
                <Text className='p-4 border-b border-gray-400'>
                  {new Date(value).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
                {showTimepicker && (
                  <DateTimePicker
                    testID='dateTimePicker'
                    value={value}
                    mode={'time'}
                    is24Hour={true}
                    onChange={(_, date) => {
                      onChange(date)
                      setShowTimepicker(false)
                    }}
                  />
                )}
              </Pressable>
            )}
          />
          <View className='gap-2'>
            <Text className='text-lg font-bold'>
              Selecciona los productos para este pedido
            </Text>
            <View className='gap-2'>
              <View className='flex-grow gap-2'>
                {products.data.map((p) => (
                  <View
                    key={p.id}
                    className='bg-slate-100 p-3 rounded-lg flex-row justify-between items-center'
                  >
                    <View className='gap-1'>
                      <Text className='font-bold'>{p.title}</Text>
                      <Text className='text-sm'>{p.description}</Text>
                      <CurrencyText text={p.price.toString()} />
                    </View>
                    <View className='flex-row gap-3 items-center'>
                      <Pressable
                        onPress={() => {
                          removeItemFromOrder(p)
                        }}
                      >
                        {({ pressed }) => (
                          <FontAwesome5
                            size={25}
                            name='minus'
                            color={pressed ? 'red' : 'gray'}
                          />
                        )}
                      </Pressable>
                      <Text className='font-bold'>
                        {methods
                          .watch('items')
                          .find((item) => item.product.id === p.id)?.quantity ||
                          0}
                      </Text>
                      <Pressable
                        onPress={() => {
                          addItemToOrder(p)
                        }}
                      >
                        {({ pressed }) => (
                          <FontAwesome5
                            size={25}
                            name='plus'
                            color={pressed ? 'red' : 'gray'}
                          />
                        )}
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
          <Text className='text-lg font-bold'>Resumen del pedido</Text>
          <View className='p-4 bg-slate-200 rounded-lg'>
            {methods.watch('items').length === 0 && (
              <Text className='text-center'>
                No hay productos seleccionados
              </Text>
            )}
            {methods.watch('items').length > 0 && (
              <View className='gap-2'>
                {methods.watch('items').map((item) => (
                  <View
                    key={item.product.id}
                    className='flex-row justify-between'
                  >
                    <Text>
                      {item.quantity} x {item.product.title}
                    </Text>
                    <CurrencyText
                      text={(item.product.price * item.quantity).toString()}
                    />
                  </View>
                ))}
                <View className='border-t border-slate-400 mt-2 pt-2'>
                  <View className='flex-row justify-between'>
                    <Text className='font-bold'>Total</Text>
                    <CurrencyText
                      text={methods
                        .watch('items')
                        .reduce(
                          (acc, p) => acc + p.product.price * p.quantity,
                          0
                        )
                        .toString()}
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
          <ButtonComponent
            loading={createOrder.isPending}
            primary
            onPress={methods.handleSubmit(onSubmit)}
          >
            Guardar
          </ButtonComponent>
        </FormProvider>
      </View>
    </ScrollLayout>
  )
}
