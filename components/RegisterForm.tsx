import api from '@/services/config'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { FormProvider, useForm } from 'react-hook-form'
import { Text, View } from 'react-native'
import ButtonComponent from './ButtonComponent'
import InputForm from './InputForm'
interface RegisterFormProps {
  firstName: string
  lastName: string
  email: string
  password: string
  phone: string
  birthday?: Date
}
const RegisterForm = () => {
  const router = useRouter()
  const methods = useForm<RegisterFormProps>()
  const registerUser = useMutation({
    mutationFn: async (data: RegisterFormProps) => {
      const newUser = await api.post('/users', data)

      return newUser
    },
    onSuccess: (data) => {
      if (data.status === 201) {
        router.replace('/login')
      }
    },
    onError: (error) => console.log(error),
  })
  const onSubmit = (data: RegisterFormProps) => registerUser.mutate(data)
  return (
    <FormProvider {...methods}>
      <View className='gap-10 '>
        <Text className='text-2xl font-bold'>Información personal</Text>
        <View className='flex flex-row gap-4  '>
          <InputForm
            item={{
              label: 'Nombre',
              key: 'firstName',
              required: true,
              minLength: 2,
            }}
          />
          <InputForm
            item={{
              label: 'Apellido',
              key: 'lastName',
              required: true,
              minLength: 2,
            }}
          />
        </View>
        <View className='flex flex-row gap-4  '>
          <InputForm
            item={{
              label: 'Teléfono',
              key: 'phone',
              type: 'phone-pad',
            }}
          />
          <InputForm
            item={{
              label: 'Fecha de nacimiento',
              key: 'birthday',
              type: 'number-pad',
            }}
          />
        </View>
        <InputForm
          item={{
            label: 'Correo',
            key: 'email',
            type: 'email-address',
            pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            required: true,
          }}
        />
        <InputForm
          item={{
            label: 'Contraseña',
            key: 'password',
            secureTextEntry: true,
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
            errorMessage:
              'La contraseña debe tener al menos 6 caracteres, una letra mayúscula, una letra minúscula y un número.',
            required: true,
          }}
        />

        {/* <Text className='text-2xl font-bold'>Información de la empresa</Text>
        <InputForm
          item={{
            label: 'Nombre de la empresa',
            key: 'businessName',
          }}
        />
        <InputForm
          item={{
            label: 'Descripción',
            key: 'businessDescription',
          }}
        />
        <InputForm item={{ label: 'Dirección', key: 'businessAddress' }} />
        <InputForm
          item={{
            label: 'Categoría o sector',
            key: 'businessCategory',
          }}
        /> */}

        <ButtonComponent
          loading={registerUser.isPending}
          primary
          onPress={methods.handleSubmit(onSubmit)}
        >
          Registrarse
        </ButtonComponent>
      </View>
    </FormProvider>
  )
}

export default RegisterForm
