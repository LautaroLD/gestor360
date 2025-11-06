import ButtonComponent from '@/components/ButtonComponent'
import InputForm from '@/components/InputForm'
import ScrollLayout from '@/components/ScrollLayout'
import api from '@/services/config'
import { useStore } from '@/services/store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { FormProvider, useForm } from 'react-hook-form'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
interface NewBusinessFormProps {
  name: string
  description: string
  address: string
  category: string
}
export default function NewBusiness() {
  const insets = useSafeAreaInsets()

  const router = useRouter()
  const queryClient = useQueryClient()
  const { user } = useStore((state) => state)
  const methods = useForm<NewBusinessFormProps>()
  const registerBusiness = useMutation({
    mutationFn: async (data: NewBusinessFormProps) => {
      const newUser = await api.post('/business', {
        ...data,
        ownerId: user?.id,
      })
      return newUser
    },
    onSuccess: (data) => {
      if (data.status === 201) {
        router.back()
        queryClient.refetchQueries({ queryKey: ['business'] })
      }
    },
    onError: (error) => console.log(error),
  })
  const onSubmit = (data: NewBusinessFormProps) => registerBusiness.mutate(data)

  return (
    <ScrollLayout>
      <View className='gap-10'>
        <FormProvider {...methods}>
          <InputForm
            item={{
              label: 'Nombre del negocio',
              key: 'name',
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
          <InputForm item={{ label: 'Dirección', key: 'address' }} />
          <InputForm
            item={{
              label: 'Categoría o sector',
              key: 'category',
            }}
          />
          <ButtonComponent primary onPress={methods.handleSubmit(onSubmit)}>
            Guardar
          </ButtonComponent>
        </FormProvider>
      </View>
    </ScrollLayout>
  )
}
