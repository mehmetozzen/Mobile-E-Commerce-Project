import { View, Text, Button,StyleSheet, TextInput } from 'react-native'
import React, { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const kayit = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            console.log('Kullanıcı başarıyla kaydedildi!');
        } catch (error: any) {
            console.error('Kayıt işlemi başarısız:', error.message);
        }
    };
    return (
        <View style={styles.container}>
      <Text>Kayıt ol Firebase!</Text>

      <TextInput
        style={styles.input}
        placeholder="E-posta"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Şifre"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />

      <Button title="Kayıt Ol" onPress={kayit} />

      <View style={{ marginTop: 20 }}>
        <Text>Email: {email}</Text>
        <Text>Şifre: {password}</Text>
      </View>

      {/* Diğer bileşenler ve stillendirmeler buraya eklenir */}

    </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      paddingLeft: 10,
      width: '100%',
    },
  });
  