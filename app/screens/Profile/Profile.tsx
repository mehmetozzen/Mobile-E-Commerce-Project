import { View, Text, Button } from 'react-native'
import React from 'react'
import { auth } from '../../../firebaseConfig'
import { SafeAreaView } from 'react-native-safe-area-context'

const Profile = () => {
  return (
    <SafeAreaView>
      <Text>Profile</Text>
      <Button onPress={() => auth.signOut()} title='Çıkış Yap' />
    </SafeAreaView>
  )
}

export default Profile