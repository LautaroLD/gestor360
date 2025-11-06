import React from 'react'
import { MaskedText } from 'react-native-mask-text'

export default function CurrencyText({ text }: { text: string }) {
  return (
    <MaskedText
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
