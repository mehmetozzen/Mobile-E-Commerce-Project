import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from './app/screens/Login';
import Kategoriler from './app/screens/Ürün/Kategoriler';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

function InsideLayout() {
  return (
    <InsideStack.Navigator initialRouteName="Kategoriler">
      <InsideStack.Screen name='Kategoriler' component={Kategoriler} options={{
            headerShown: false

          }} />
    </InsideStack.Navigator>
  );
}

export default function App() {

  const[user, setUser] = useState<User | null>(null);
  useEffect(
    ()=>{
      onAuthStateChanged(auth,(user)=>{
        setUser(user);
      })
    },[]
  )
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {user ? (
          <Stack.Screen name="Inside" component={InsideLayout}
          options={{
            headerShown: false

          }} />
        ):(
          <Stack.Screen name="Login" component={Login}
          options={{
            headerShown: false
          }} />
        )}
        

      </Stack.Navigator>
    </NavigationContainer>
  )
}