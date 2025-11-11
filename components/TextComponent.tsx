import React from 'react'
import { Text, TextProps } from 'react-native'
interface TextComponentProps extends TextProps {
  children: React.ReactNode
  color?: string
  theme?: 'light' | 'dark'
}
export default function TextComponent({
  children,
  color,
  theme,
  ...props
}: TextComponentProps) {
  return (
    <Text
      {...props}
      className={` ${color ? `text-${color}` : 'text-black'} ${props.className}`}
    >
      {children}
    </Text>
  )
}
