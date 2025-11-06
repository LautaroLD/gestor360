import ButtonComponent from '@/components/ButtonComponent'
import InputForm from '@/components/InputForm'
import ScrollLayout from '@/components/ScrollLayout'
import api from '@/services/config'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { Text, View } from 'react-native'
import { MaskedTextInput } from 'react-native-mask-text'
interface NewProductFormProps {
  title: string
  description: string
  price: number
}
export default function NewProduct() {
  const params = useLocalSearchParams()

  const router = useRouter()
  const queryClient = useQueryClient()
  const methods = useForm<NewProductFormProps>({
    defaultValues: {
      title: '',
      description: '',
      price: 0,
    },
  })
  const registerBusiness = useMutation({
    mutationFn: async (data: NewProductFormProps) => {
      return await api.post('/product', {
        ...data,
        price: Number(data.price),
        businessId: params.businessId,
      })
    },
    onSuccess: (data) => {
      if (data.status === 201) {
        router.back()
        queryClient.refetchQueries({ queryKey: ['business'], exact: false })
        queryClient.refetchQueries({ queryKey: ['charts'], exact: false })
      }
    },
    onError: (error) => console.log(error),
  })
  const onSubmit = (data: NewProductFormProps) => registerBusiness.mutate(data)

  return (
    <ScrollLayout>
      <View className='gap-10'>
        <FormProvider {...methods}>
          <InputForm
            item={{
              label: 'Nombre del producto',
              key: 'title',
              required: true,
              minLength: 2,
            }}
          />
          <InputForm
            item={{
              label: 'Descripción',
              key: 'description',
              required: true,
            }}
          />
          <Controller
            name='price'
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
              <View>
                <Text className='font-bold text-gray-500 pl-2'>Precio</Text>
                <MaskedTextInput
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: 'gray',
                    padding: 10,
                  }}
                  keyboardType='numeric'
                  type='currency'
                  options={{
                    prefix: '$',
                    decimalSeparator: '.',
                    groupSeparator: ',',
                    precision: 2,
                  }}
                  value={value.toString()}
                  onBlur={onBlur}
                  onChangeText={(maskedValue, unmaskedValue) =>
                    onChange(Number(unmaskedValue))
                  }
                />
              </View>
            )}
          ></Controller>
          <ButtonComponent primary onPress={methods.handleSubmit(onSubmit)}>
            Guardar
          </ButtonComponent>
        </FormProvider>
      </View>
    </ScrollLayout>
  )
}
