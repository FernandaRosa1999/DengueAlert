import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Upload() {
  const navigation = useNavigation();
  const [photoUri, setPhotoUri] = useState(null);
  const [description, setDescription] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar sua galeria de fotos.');
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Falha ao selecionar a imagem. Tente novamente.');
    }
  };
  

  const handleSave = async () => {
    if (!photoUri || !description.trim()) {
      Alert.alert('Erro', 'Descrição e foto são obrigatórios.');
      return;
    }

    const userId = await AsyncStorage.getItem('userID');
    if (!userId) {
      Alert.alert('Erro', 'Usuário não encontrado. Faça login novamente.');
      return;
    }

    try {
      const photo = {
        uri: photoUri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      };

      const formData = new FormData();
      formData.append('photo', photo);
      formData.append('description', description);
      formData.append('userId', userId);

      const serverResponse = await fetch('http://192.168.0.12:3000/upload', {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const result = await serverResponse.json();
      if (serverResponse.ok) {
        Alert.alert('Sucesso', 'Denúncia salva com sucesso!');
        await AsyncStorage.setItem('reportID', result.reportId);
        navigation.navigate('Localization', { photoUri, description });
      } else {
        Alert.alert('Erro', result.error || 'Falha ao salvar a denúncia. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao enviar imagem para o servidor:', error);
      Alert.alert('Erro', 'Falha ao salvar a denúncia. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      {photoUri ? (
        <View style={styles.resultContainer}>
          <Image source={{ uri: photoUri }} style={styles.image} />
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={styles.input}
            placeholder="Detalhe a denúncia"
            onChangeText={setDescription}
            value={description}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.uploadContainer}>
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Text style={styles.uploadButtonText}>Selecionar Imagem</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: '#008CBA',
    padding: 15,
    borderRadius: 5,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 18,
  },
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
  saveButton: {
    backgroundColor: '#008CBA',
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
  },
});
