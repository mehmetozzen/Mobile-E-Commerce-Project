import React, { useEffect, useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, TextInput, Modal } from 'react-native';
import { auth, firestore } from '../../../firebaseConfig';
import { onAuthStateChanged, reauthenticateWithCredential, updatePassword, EmailAuthProvider } from 'firebase/auth';
import { collection, getDocs, where, query, updateDoc } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile = () => {
  
  const [username, setUsername] = useState('');
  const [isUsernameModalVisible, setUsernameModalVisible] = useState(false);
  const [newUsername, setNewUsername] = useState('');

  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      const user = auth.currentUser;

      if (user) {
        const q = query(collection(firestore, 'users'), where('uid', '==', user.uid));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          setUsername(doc.data().username);
        });
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUsername();
      } else {
        setUsername('');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleUsernameChange = () => {
    setUsernameModalVisible(true);
  };

  const handlePasswordChange = () => {
    setPasswordModalVisible(true);
  };

  const handleSaveUsername = async () => {
    try {
      const user = auth.currentUser;

      if (user) {
        const q = query(collection(firestore, 'users'), where('uid', '==', user.uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.size > 0) {
          const userDoc = querySnapshot.docs[0];
          await updateDoc(userDoc.ref, { username: newUsername });

          setUsername(newUsername);
          setUsernameModalVisible(false);
          setNewUsername("");
        }
      }
    } catch (error) {
      console.error('Kullanıcı adı güncelleme hatası:', error.message);
    }
  };

  const handleSavePassword = async () => {
    try {
      const user = auth.currentUser;

      if (user) {
        const credential = EmailAuthProvider.credential(user.email, oldPassword);
        await reauthenticateWithCredential(user, credential);

        if (newPassword.length < 6) {
          setPasswordError('Şifre en az 6 karakter olmalıdır.');
          return;
        }

        await updatePassword(user, newPassword);

        setPasswordModalVisible(false);
        setOldPassword('');
        setNewPassword('');
        setPasswordError('');
        console.log('Şifre başarıyla güncellendi.');
      }
    } catch (error) {
      console.error('Şifre güncelleme hatası:', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        <Text style={styles.username}>Hoşgeldin, {username}!</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleUsernameChange} style={[styles.button, styles.buttonBlue]}>
            <Text style={styles.buttonText}>Kullanıcı Adı Değiştir</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePasswordChange} style={[styles.button, styles.buttonOutline]}>
            <Text style={[styles.buttonText, styles.buttonOutlineText]}>Şifre Değiştir</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Button onPress={() => auth.signOut()} title='Çıkış Yap' />

      
      <Modal animationType="slide" transparent={true} visible={isUsernameModalVisible} onRequestClose={() => setUsernameModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Yeni Kullanıcı Adınızı Girin</Text>
            <TextInput
              style={styles.input}
              placeholder="Yeni Kullanıcı Adı"
              value={newUsername}
              onChangeText={(text) => setNewUsername(text)}
            />
            <TouchableOpacity onPress={handleSaveUsername} style={[styles.button, styles.buttonBlue]}>
              <Text style={styles.buttonText}>Kaydet</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setUsernameModalVisible(false)} style={[styles.button, styles.buttonOutline]}>
              <Text style={[styles.buttonText, styles.buttonOutlineText]}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      
      <Modal animationType="slide" transparent={true} visible={isPasswordModalVisible} onRequestClose={() => setPasswordModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Eski Şifrenizi Girin</Text>
            <TextInput
              style={styles.input}
              placeholder="Eski Şifre"
              secureTextEntry={true}
              value={oldPassword}
              onChangeText={(text) => setOldPassword(text)}
            />
            <Text style={styles.modalText}>Yeni Şifrenizi Girin</Text>
            <TextInput
              style={styles.input}
              placeholder="Yeni Şifre"
              secureTextEntry={true}
              value={newPassword}
              onChangeText={(text) => {
                setNewPassword(text);
                setPasswordError('');
              }}
            />
            {passwordError !== '' && (
              <Text style={styles.errorText}>{passwordError}</Text>
            )}
            <TouchableOpacity onPress={handleSavePassword} style={[styles.button, styles.buttonBlue]}>
              <Text style={styles.buttonText}>Şifreyi Değiştir</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setPasswordModalVisible(false)} style={[styles.button, styles.buttonOutline]}>
              <Text style={[styles.buttonText, styles.buttonOutlineText]}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    alignItems: 'center',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '80%',
  },
  button: {
    width: 200,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutline: {
    backgroundColor: 'white',
    borderColor: '#0782F9',
    borderWidth: 2,
  },
  buttonOutlineText: {
    color: '#0782F9',
  },
  buttonBlue: {
    backgroundColor: '#0782F9',
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
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
    width: 200,
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
});

export default Profile;
