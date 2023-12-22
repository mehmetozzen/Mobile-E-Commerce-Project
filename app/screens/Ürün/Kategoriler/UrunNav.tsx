import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Kategoriler from './Kategoriler';
import UrunSayfasi from './UrunSayfasi';
import TekilUrun from './TekilUrun';


const Stack = createStackNavigator();


const UrunNav = () => {
  return (
    <Stack.Navigator initialRouteName="Kategoriler">
  <Stack.Screen
    name="Kategoriler"
    component={Kategoriler}
    options={{
      headerTitle: 'Kategoriler',
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: 'bold',
      },
    }}
  />
  <Stack.Screen
    name="Urunler"
    component={UrunSayfasi}
    options={{
      headerTitle: 'Urunler',
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: 'bold',
      },
    }}
  />
  <Stack.Screen
    name="Tekil Urun"
    component={TekilUrun}
    options={{
      headerTitle: 'Tekil Urun',
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: 'bold',
      },
    }}
  />
</Stack.Navigator>

  );
}

export default UrunNav