import React, { useState, useEffect } from 'react';
import { View, Button, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { database } from '../../../config/firebaseconfig';
import { collection, addDoc } from 'firebase/firestore'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Localization({ route, navigation }) {
  const { photoUri, description } = route.params; 
  const [region, setRegion] = useState(null);
  const [markerCoordinate, setMarkerCoordinate] = useState(null);
  const [nome_localizacao, setNomeLocalizacao] = useState('');
  const [loading, setLoading] = useState(false); 
  useEffect(() => {
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão de Localização', 'Permissão para acessar a localização é necessária.');
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setMarkerCoordinate({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    };

    requestLocationPermission();
  }, []);

  const handleSave = async () => {
    if (markerCoordinate) {
      setLoading(true); 
      try {
        const { latitude, longitude } = markerCoordinate;
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          {
            headers: {
              'User-Agent': 'DengueAlertApp/1.0',
            },
          }
        );

        const { address } = response.data;
        const nome_localizacao = `${address.road || ''}, ${address.suburb || ''}, ${address.city || ''}`.trim();
        const suburb =`${address.suburb}`;

        const reportId = await AsyncStorage.getItem('reportID'); 

        if (reportId) {
          const docRef = await addDoc(collection(database, 'Locations'), {
            reportId: reportId,
            latitude: latitude,
            longitude: longitude,
            nome_localizacao: nome_localizacao,
            suburb: suburb,
          });

          navigation.navigate('LocationDetails', { 
            localizationId: docRef.id,
            nome_localizacao: nome_localizacao,
            photoUri,
            description,
          });

          setLoading(false); 
        } else {
          Alert.alert('Erro', 'Relatório não encontrado.');
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
        Alert.alert('Erro', 'Falha ao salvar a localização.');
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {region && (
        <MapView style={{ flex: 1 }} region={region} onPress={(e) => setMarkerCoordinate(e.nativeEvent.coordinate)}>
          {markerCoordinate && <Marker coordinate={markerCoordinate} />}
        </MapView>
      )}

      <Button title="Salvar Localização" onPress={handleSave} disabled={loading} />

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
}
