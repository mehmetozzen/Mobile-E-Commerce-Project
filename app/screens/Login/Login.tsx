import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { RegisterModal } from './RegisterModal';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSignUpModalVisible, setIsSignUpModalVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const SignIn = async () => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert('Giriş yapma başarısız!' + error.message);
    }
  };

  const toggleSignUpModal = () => {
    setIsSignUpModalVisible(!isSignUpModalVisible);
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.visualTitleContainer}>
        <Text style={styles.visualTitleText}>
          
          <Text>Giriş </Text>
          
          <Text>Yap</Text>
        </Text>
        <View style={styles.titleUnderline}></View>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            placeholder="Şifre"
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={styles.inputPass}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye' : 'eye-off'}
              size={24}
              color="black"
              style={{ marginLeft: 10 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={SignIn} style={styles.button}>
          <Text style={styles.buttonText}>Giriş Yap</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleSignUpModal} style={[styles.button, styles.buttonOutline]}>
          <Text style={styles.buttonOutlineText}>Kayıt Ol</Text>
        </TouchableOpacity>
      </View>

      <RegisterModal
        isVisible={isSignUpModalVisible}
        onClose={() => setIsSignUpModalVisible(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visualTitleContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  visualTitleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    flexDirection: 'row',
  },
  blueText: {
    color: '#2C3E50',
  },
  titleUnderline: {
    backgroundColor: '#2C3E50',
    height: 2,
    width: '50%',
    marginTop: 5,
    marginBottom: 50
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  inputPass: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    width: '87%',
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#2C3E50',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutline: {
    backgroundColor: '#66707a',
    marginTop: 5,
    borderColor: 'white',
    borderWidth: 2,
  },
  buttonOutlineText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});
