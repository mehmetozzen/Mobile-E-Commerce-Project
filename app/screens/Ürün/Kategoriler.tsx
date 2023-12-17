import { View, Text, Button } from 'react-native'
import React from 'react'
import { auth } from '../../../firebaseConfig'

const Kategoriler = () => {
  return (
    <View>
      <Button onPress={()=>auth.signOut()} title='Çıkış Yap' />
    </View>
  )
}

export default Kategoriler