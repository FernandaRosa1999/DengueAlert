import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TextInput, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera/legacy';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { database } from "../../config/firebaseconfig";
import { collection, addDoc } from "firebase/firestore";

export default function Photograph() {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [photoUri, setPhotoUri] = useState(null);
  const [description, setDescription] = useState('');
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhotoUri(photo.uri);
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

      const serverResponse = await fetch('http://SEU_IP_LOCAL:3000/upload', {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const result = await serverResponse.json();
      if (serverResponse.ok) {
        Alert.alert('Sucesso', 'Denúncia salva com sucesso!');
        await AsyncStorage.setItem('reportID', result.reportId); // Salva o reportId no AsyncStorage
        navigation.navigate('Localization', { photoUri, description });
      } else {
        Alert.alert('Erro', result.error || 'Falha ao salvar a denúncia. Tente novamente.');
      }
    } catch (error) {
      console.error("Erro ao enviar imagem para o servidor:", error);
      Alert.alert('Erro', 'Falha ao salvar a denúncia. Tente novamente.');
    }
  };

  if (hasPermission === null) {
    return <View><Text>Solicitando permissão para acessar a câmera...</Text></View>;
  }

  if (hasPermission === false) {
    return <View><Text>Sem permissão para acessar a câmera.</Text></View>;
  }

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
        <View style={styles.cameraContainer}>
          <Camera style={styles.camera} type={Camera.Constants.Type.back} ref={cameraRef}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                <Text style={styles.captureButtonText}>Tirar Foto</Text>
              </TouchableOpacity>
            </View>
          </Camera>
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
  cameraContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    aspectRatio: 1,
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
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
  captureButton: {
    backgroundColor: '#008CBA',
    padding: 15,
    borderRadius: 5,
  },
  captureButtonText: {
    color: 'white',
    fontSize: 18,
  },
});
