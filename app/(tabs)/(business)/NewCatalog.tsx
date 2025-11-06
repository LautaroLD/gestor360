import ButtonComponent from '@/components/ButtonComponent'
import InputForm from '@/components/InputForm'
import List from '@/components/List'
import ProductItem from '@/components/ProductItem'
import ScrollLayout from '@/components/ScrollLayout'
import { Product } from '@/models'
import api from '@/services/config'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { FlatList, Modal, Pressable, Text, View } from 'react-native'
interface NewCatalogFormProps {
  title: string
  description: string
  products: Product[]
}
export default function NewCatalog() {
  const [open, setOpen] = useState(false)
  const params = useLocalSearchParams()
  const queryClient = useQueryClient()
  const router = useRouter()
  const methods = useForm<NewCatalogFormProps>({
    defaultValues: {
      title: '',
      description: '',
      products: [],
    },
  })
  const {
    data: products,
    isPending,
    error,
  } = useQuery({
    queryKey: ['products', params?.businessId],
    queryFn: async () => {
      const res = await api.get<Product[]>(
        '/product/business/' + params?.businessId
      )

      return res
    },
  })
  const createCatalog = useMutation({
    mutationFn: async (data: NewCatalogFormProps) => {
      return await api.post('/catalog', {
        ...data,
        products: data.products.map((item) => item.id),
        businessId: params.businessId,
      })
    },

    onSuccess: (data) => {
      queryClient.refetchQueries({ queryKey: ['business'], exact: false })
      router.back()
    },
    onError: (error) => console.log(error),
  })
  const onSubmit = (data: NewCatalogFormProps) => createCatalog.mutate(data)
  if (isPending) return <Text>Loading...</Text>
  if (error) return <Text>{error.message}</Text>
  return (
    <ScrollLayout>
      <View className='gap-10'>
        <FormProvider {...methods}>
          <InputForm
            item={{
              label: 'Nombre del catalogo',
              key: 'title',
              required: true,
              minLength: 2,
            }}
          />
          <InputForm
            item={{
              label: 'Descripción',
              key: 'description',
            }}
          />
          <View className='gap-2'>
            <ButtonComponent
              onPress={() => setOpen(true)}
              className='text-lg font-bold'
            >
              <Text className='text-lg'>
                Selecciona los productos para este catalogo
              </Text>
            </ButtonComponent>
            <Modal
              visible={open}
              onRequestClose={() => setOpen(false)}
              animationType='slide'
            >
              <FlatList
                data={products?.data}
                className='bg-slate-100'
                contentContainerClassName='gap-4 p-4'
                ListHeaderComponent={() => (
                  <View className='gap-3'>
                    <Text className='text-lg font-bold text-center'>
                      Selecciona los productos para este catalogo
                    </Text>
                    <ButtonComponent
                      onPress={() => setOpen(false)}
                      className='border-slate-300 border-2 rounded-lg bg-white'
                    >
                      Listo
                    </ButtonComponent>
                  </View>
                )}
                renderItem={({ item }: { item: Product }) => {
                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => {
                        if (
                          methods
                            .getValues('products')
                            .find(({ id }) => id === item.id)
                        ) {
                          methods.setValue(
                            'products',
                            methods
                              .getValues('products')
                              .filter(({ id }) => id !== item.id)
                          )
                        } else {
                          methods.setValue('products', [
                            ...methods.getValues('products'),
                            item,
                          ])
                        }
                      }}
                      className={` border-4 rounded-lg bg-white ${
                        methods
                          .watch('products')
                          .find(({ id }) => id === item.id)
                          ? 'border-primary '
                          : 'border-transparent'
                      }`}
                    >
                      <ProductItem p={item} />
                    </Pressable>
                  )
                }}
              />
            </Modal>
          </View>
          {methods.watch('products') &&
            methods.watch('products').length > 0 && (
              <View className='gap-2'>
                <Text className='text-lg font-bold text-center'>
                  Productos seleccionados
                </Text>
                <List items={methods.watch('products')} type='product' />
              </View>
              // <FlatList
              //   data={methods.watch('products')}
              //   contentContainerClassName='gap-2'
              //   renderItem={({ item }) => <ProductItem p={item} />}
              // />
            )}
          <ButtonComponent
            loading={createCatalog.isPending}
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
