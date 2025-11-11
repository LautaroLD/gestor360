import { MaskedText } from 'react-native-mask-text'

export default function CurrencyText({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  return (
    <MaskedText
      className={className || ''}
      style={{ fontWeight: 'bold' }}
      type='currency'
      options={{
        prefix: '$',
        decimalSeparator: '.',
        groupSeparator: ',',
        precision: 2,
      }}
    >
      {text}
    </MaskedText>
  )
}
