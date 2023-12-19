import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Kategoriler from './Kategoriler';
import UrunSayfasi from './UrunSayfasi';
import TekilUrun from './TekilUrun';


const Stack = createStackNavigator();


const UrunNav = () => {
  return (
    <Stack.Navigator initialRouteName="Kategoriler" >
      <Stack.Screen name="Kategoriler" component={Kategoriler} />
      <Stack.Screen name="Urunler" component={UrunSayfasi} />
      <Stack.Screen name="Tekil Urun" component={TekilUrun}  />
      
    </Stack.Navigator>
  );
}

export default UrunNav