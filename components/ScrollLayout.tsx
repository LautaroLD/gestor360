import React, { useEffect, useState } from 'react'
import { Keyboard, KeyboardAvoidingView, ScrollView } from 'react-native'

export default function ScrollLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [keyboardHeight, setKeyboardHeight] = useState(false)

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardHeight(true)
    })
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(false)
    })

    return () => {
      showSub.remove()
      hideSub.remove()
    }
  }, [])
  return (
    <KeyboardAvoidingView behavior='padding' className='flex-1 '>
      <ScrollView
        contentContainerClassName={`gap-5 flex-grow p-5 ${keyboardHeight ? 'pb-32' : ''} `}
        keyboardShouldPersistTaps='handled'
        automaticallyAdjustContentInsets={false}
        automaticallyAdjustsScrollIndicatorInsets={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
