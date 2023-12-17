import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Modal,
} from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSignUpModalVisible, setIsSignUpModalVisible] = useState(false);

  const SignUp = async () => {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError('Geçerli bir e-posta adresi giriniz.');
        return;
      }

      setEmailError('');

      if (password.length < 6) {
        setPasswordError('Şifre en az 6 karakter içermelidir.');
        return;
      }

      setPasswordError('');

      await createUserWithEmailAndPassword(auth, email, password);
      console.log('Kullanıcı başarıyla kaydedildi!');
      setIsSignUpModalVisible(false);
    } catch (error) {
      console.error('Kayıt işlemi başarısız:', error.message);
    }
  };

  const SignIn = async () => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      // Giriş işlemi başarılı olduysa burada istediğiniz aksiyonları gerçekleştirebilirsiniz.
    } catch (error) {
      alert('Giriş yapma başarısız!' + error.message);
    }
  };

  const toggleSignUpModal = () => {
    setIsSignUpModalVisible(!isSignUpModalVisible);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Şifre"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={isSignUpModalVisible}
        onRequestClose={() => {
          setIsSignUpModalVisible(false);
        }}

      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Ad"
              value={name}
              onChangeText={(text) => setName(text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Soyad"
              value={surname}
              onChangeText={(text) => setSurname(text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Şifre"
              value={password}
              onChangeText={(text) => setPassword(text)}
              style={styles.input}
              secureTextEntry
            />

            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={SignUp} style={styles.button}>
                <Text style={styles.buttonText}>Kayıt Ol</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleSignUpModal} style={[styles.button, styles.buttonOutline]}>
                <Text style={styles.buttonOutlineText}>İptal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#0782F9',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  modalContent: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    borderWidth: 2,
    borderColor: '#0782F9',
  },

});
