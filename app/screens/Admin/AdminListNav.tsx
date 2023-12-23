import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {  collection, where, query, getDocs } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';

const AdminListNav = ({ navigation }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsername] = useState(null);

  const fetchUsername = async (uid) => {
    const usersCollection = collection(firestore, 'users');
    const q = query(usersCollection, where('uid', '==', uid));

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      setUsername(querySnapshot.docs[0].data().username);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const auth = getAuth();

      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        if (user) {
          fetchUsername(user.uid);
        }
      });

      return () => unsubscribe();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      if (currentUser) {
        fetchUsername(currentUser.uid);
      }
    }, [currentUser])
  );

  const navigateToCreate = () => {
    navigation.navigate('CreateProduct');
  };

  const navigateToList = () => {
    navigation.navigate('ReadProduct');
  };

  const navigateToUpdate = () => {
    navigation.navigate('UpdateProduct');
  };

  const navigateToDelete = () => {
    navigation.navigate('DeleteProduct');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.welcomeText}>Hoşgeldin, {username || 'Misafir'}!</Text>
      <TouchableOpacity onPress={navigateToCreate} style={styles.createButton}>
        <Text style={styles.buttonText}>Ürün Oluştur!</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToList} style={styles.readButton}>
        <Text style={styles.buttonText}>Ürün Listele!</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToUpdate} style={styles.updateButton}>
        <Text style={styles.buttonText}>Ürün Güncelle!</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToDelete} style={styles.deleteButton}>
        <Text style={styles.buttonText}>Ürün Sil!</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Arka plan rengi
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333', // Yazı rengi
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    width: 200,
    alignItems: 'center',
  },
  readButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    width: 200,
    alignItems: 'center',
  },
  updateButton: {
    backgroundColor: '#FFC107',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    width: 200,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    width: 200,
    alignItems: 'center',
  },
});

export default AdminListNav;
