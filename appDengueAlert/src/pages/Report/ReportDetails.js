import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import MapView, { Marker } from 'react-native-maps';

export default function ReportDetails({ route }) {
  const { report } = route.params;

  // Função para determinar o estilo do status com base no valor
  const getStatusStyle = (status) => {
    switch (status) {
      case 'resolvida':
        return styles.completed;
      case 'em tratamento':
        return styles.pending;
      case 'em análise':
        return styles.analysis;
      default:
        return {};
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Detalhes da Denúncia</Text>
        <View style={styles.card}>
          <Text style={styles.date}>{report.formattedDate}</Text>

          <Text style={styles.statusTitle}>Status Atual</Text>
          <Text style={[styles.status, getStatusStyle(report.status)]}>
            {report.status}
          </Text>
          <Text style={styles.statusTitle}>Atualizações</Text>
          <Text style={styles.observation}>{report.observation}</Text>


          <Text style={styles.label}>Descrição da denúncia:</Text>
          <Text style={styles.description}>{report.description}</Text>
          <Text style={styles.label}>Localização:</Text>
          <Text style={styles.location}>{report.locationName}</Text>

          <Image source={{ uri: report.photoURL }} style={styles.image} />
        </View>

        <MapView
          style={styles.map}
          initialRegion={{
            latitude: report.latitude,
            longitude: report.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            coordinate={{
              latitude: report.latitude,
              longitude: report.longitude,
            }}
            title={report.locationName}
          >
            <Image
              source={report.imageAedesAegypti}
              style={styles.markerImage}
            />
          </Marker>
        </MapView>
      </ScrollView>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#eaeef2',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  date: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 15,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#34495e',
    marginTop: 10,
    textAlign: 'center',
  },
  status: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  completed: {
    color: '#2ecc71', 
  },
  pending: {
    color: '#e67e22',
  },
  analysis: {
    color: '#e74c3c', 
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495e',
    marginTop: 10,
  },
  observation: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 22,
    marginVertical: 5,
    padding: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2980b9',
    backgroundColor: '#f4f6f8',
    borderRadius: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 22,
    marginVertical: 5,
    padding: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2980b9',
    backgroundColor: '#f4f6f8',
    borderRadius: 8,
  },
  location: {
    fontSize: 16,
    color: '#34495e',
    marginVertical: 5,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ececec',
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
  },
  markerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
