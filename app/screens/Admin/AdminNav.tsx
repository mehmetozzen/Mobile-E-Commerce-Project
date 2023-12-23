import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import AdminListNav from './AdminListNav';
import CreateProduct from './createProduct';
import ReadProduct from './readProduct';
import UpdateProduct from './updateProduct';
import DeleteProduct from './deleteProduct';


const AdminNav = () => {
    const Stack = createNativeStackNavigator();
    return (


        <Stack.Navigator initialRouteName="liste">
            <Stack.Screen name="liste" component={AdminListNav}
                options={{
                    headerShown: false
                }} />
            <Stack.Screen name="CreateProduct" component={CreateProduct}
                options={{
                    headerShown: true,
                    headerTitle:"Ürün Oluştur"
                }} />
            <Stack.Screen name="ReadProduct" component={ReadProduct}
                options={{
                    headerShown: true,
                    headerTitle:"Ürün Listesi"
                }} />
            <Stack.Screen name="UpdateProduct" component={UpdateProduct}
                options={{
                    headerShown: true,
                    headerTitle:"Güncelle"
                }} />
            <Stack.Screen name="DeleteProduct" component={DeleteProduct}
                options={{
                    headerShown: true,
                    headerTitle:"Ürün Sil"
                }} />

        </Stack.Navigator>

    )
}

export default AdminNav