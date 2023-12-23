import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from './app/screens/Login/Login';
import Kategoriler from './app/screens/Ürün/Kategoriler/Kategoriler';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, firestore } from './firebaseConfig';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import UrunNav from './app/screens/Ürün/Kategoriler/UrunNav';
import Profile from './app/screens/Profile/Profile';
import Sepet from './app/screens/Sepet/Sepet';
import ListeNav from './app/screens/Listeler/ListeNav';

import { AntDesign } from '@expo/vector-icons';
import CreateProduct from './app/screens/Admin/createProduct';
import AdminNav from './app/screens/Admin/AdminNav';
import { collection, getDocs, query, where } from 'firebase/firestore';

const Stack = createNativeStackNavigator();
const InsideStack = createBottomTabNavigator();

function InsideLayout() {
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userId = user.uid;
        const q = query(collection(firestore, 'admins'), where('uid', '==', userId));

        try {
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            setAdmin(false);
          } else {
            setAdmin(true);
          }
        } catch (error) {
          console.error('Error getting documents: ', error);
        }
      }
    });

    return () => unsubscribe();
  }, []); 

  const screenOptions: any = {
    tabBarShowLabel: false,
    tabBarHideOnKeyboard: true,
    headerShown: false,
    tabBarStyle: {
      position: "absolute",
      bottom: 0,
      right: 0,
      left: 0,
      elevation: 0,
      height: 70
    }
  };

  return (
    <InsideStack.Navigator initialRouteName="UrunSayfasi" screenOptions={screenOptions}>
      <InsideStack.Screen name='UrunSayfasi' component={UrunNav} options={{
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <Ionicons
            name={focused ? "home" : "home-outline"}
            size={24}
            color={focused ? "#0782F9" : "#b3aaaa"}
          />
        ),
      }} />
      <InsideStack.Screen name='Listeler' component={ListeNav} options={{
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <Ionicons
            name={focused ? "list" : "list-outline"}
            size={24}
            color={focused ? "#0782F9" : "#b3aaaa"}
          />
        ),
      }} />

      {admin ? (
        <InsideStack.Screen name='Admin' component={AdminNav} options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name='user'
              size={24}
              color={focused ? "#0782F9" : "#b3aaaa"}
            />
          ),
        }} />
      ) : null}

      <InsideStack.Screen
        name='Sepet'
        component={Sepet}
        options={{
          headerShown: true,
          headerTitle: 'Sepet',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: 'bold',
          },
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'basket' : 'basket-outline'}
              size={24}
              color={focused ? '#0782F9' : '#b3aaaa'}
            />
          ),
        }}
      />

      <InsideStack.Screen name='Profil Ekrani' component={Profile} options={{
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <Ionicons
            name={focused ? "person" : "person-outline"}
            size={24}
            color={focused ? "#0782F9" : "#b3aaaa"}
          />
        ),
      }} />
    </InsideStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    })
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {user ? (
          <Stack.Screen name="Inside" component={InsideLayout} options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
