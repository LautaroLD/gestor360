import { Text } from 'react-native'

export default function DateText({
  date,
  longDate = false,
  className,
}: {
  date: Date | string
  longDate?: boolean
  className?: string
}) {
  return (
    <Text className={className || ''}>
      {longDate
        ? new Date(date).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : new Date(date).toLocaleDateString()}
    </Text>
  )
}
