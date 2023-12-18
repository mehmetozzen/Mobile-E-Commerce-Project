import { View, Text, Button } from 'react-native'
import React from 'react'
import { auth } from '../../../../firebaseConfig'
import { SafeAreaView } from 'react-native-safe-area-context'

const Kategoriler = () => {
  return (
    <SafeAreaView>
      <View>
        
      <Button onPress={()=>auth.signOut()} title='Çıkış Yap' />
    </View>
    </SafeAreaView>
  )
}

export default Kategoriler