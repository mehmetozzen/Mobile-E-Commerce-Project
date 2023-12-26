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
import { auth, firestore } from '../../../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { addDoc, collection } from 'firebase/firestore';

export const RegisterModal = ({ isVisible, onClose }) => {
  const [username, setUsername] = useState('');

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

      const userCredential = await createUserWithEmailAndPassword(auth, emailReg, passwordReg);
      const user = userCredential.user;

      // Firestore'a kullanıcı bilgilerini ekleme
      await addDoc(collection(firestore, 'users'), {
        uid: user.uid,
        username: username,
      });


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
        <View style={styles.visualTitleContainer}>
        <Text style={styles.visualTitleText}>

          <Text>Kayıt Ol! </Text>

        </Text>
        <View style={styles.titleUnderline}></View>
      </View>
          <View style={styles.modalInput}>
            <TextInput
              placeholder="Kullanıcı Adı"
              value={username}
              onChangeText={(text) => setUsername(text)}
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
    width: '87%'

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
  buttonOutline: {
    backgroundColor: '#66707a',
    marginTop: 5,
    borderColor: '#66707a',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
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
    borderColor: 'white',

  },
  modalInput: {
    width: '80%',
  }

});
