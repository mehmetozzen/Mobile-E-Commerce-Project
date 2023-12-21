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
import { auth } from '../../../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

export const RegisterModal = ({ isVisible, onClose }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [emailReg, setEmailReg] = useState('');
  const [passwordReg, setPasswordReg] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const SignUp = async () => {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailReg)) {
        setEmailError('Geçerli bir e-posta adresi giriniz.');
        return;
      }

      setEmailError('');

      if (passwordReg.length < 6) {
        setPasswordError('Şifre en az 6 karakter içermelidir.');
        return;
      }

      setPasswordError('');

      await createUserWithEmailAndPassword(auth, emailReg, passwordReg);
      console.log('Kullanıcı başarıyla kaydedildi!');
      onClose();
    } catch (error) {
      console.error('Kayıt işlemi başarısız:', error.message);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => onClose()}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalInput}>
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
              value={emailReg}
              onChangeText={(text) => setEmailReg(text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Şifre"
              value={passwordReg}
              onChangeText={(text) => setPasswordReg(text)}
              style={styles.input}
              secureTextEntry
            />
          </View>

          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={SignUp} style={styles.button}>
              <Text style={styles.buttonText}>Kayıt Ol</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={[styles.button, styles.buttonOutline]}>
              <Text style={styles.buttonOutlineText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

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
  inputPass: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    width: '87%'

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
  modalInput: {
    width: '80%',
  }

});
