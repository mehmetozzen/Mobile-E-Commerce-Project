import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import FavoriUrunListesi from './FavoriÜrünListesi/FavoriUrunListesi';
import IstekListesi from './İstekListesi/IstekListesi';
import Liste from './Liste';

const Stack = createNativeStackNavigator();

const ListeNav = () => {
  return (
   
      <Stack.Navigator initialRouteName="liste">
        <Stack.Screen name="liste" component={Liste}
          options={{
            headerShown: false

          }} />
        <Stack.Screen name="Fav" component={FavoriUrunListesi}
          options={{
            headerShown: true,
            headerTitle:"Favori Ürün Listesi"

          }} />
        <Stack.Screen name="Istek" component={IstekListesi}
            options={{
              headerShown: true,
              headerTitle:"İstek Listesi"

            }} />
      </Stack.Navigator>
  
  )
}

export default ListeNav