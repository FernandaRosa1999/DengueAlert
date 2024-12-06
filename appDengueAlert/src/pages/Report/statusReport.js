import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, Alert, TouchableOpacity, StyleSheet, Modal, Pressable } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import { database } from "../../config/firebaseconfig";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import iconDengue from '../../../assets/iconDengue.png';
import { isWithinRange } from 'date-fns';
export default function StatusReport() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterVisible, setFilterVisible] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [status, setStatus] = useState('');
  const [allReports, setAllReports] = useState([]);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const userId = await AsyncStorage.getItem('userID');
        if (!userId) {
          Alert.alert('Erro', 'Usuário não encontrado. Faça login novamente.');
          return;
        }

        const reportsCollection = collection(database, 'Reports');
        const q = query(reportsCollection, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        const fetchedReports = await Promise.all(querySnapshot.docs.map(async (doc) => {
          const reportData = doc.data();
          const description = reportData.description;
          const photoUri = reportData.photoUri;
          const createdAt = reportData.createdAt.toDate(); 
          const formattedDate = createdAt.toLocaleDateString("pt-BR"); 
          const reportId = doc.id;
          const locationData = await fetchLocationData(reportId); 
          const locationName = locationData.nome_localizacao;
          const longitude = locationData.longitude;
          const latitude = locationData.latitude;
          const latestStatus = await fetchLatestStatus(reportId);
          const observation = await fetchObservation(reportId);
          const imageAedesAegypti = iconDengue;

          return { 
            id: doc.id,
            ...reportData,
            createdAt,
            formattedDate,
            locationName,
            description,
            longitude,
            latitude,
            photoUri,
            imageAedesAegypti,
            status: latestStatus,
            observation,
          };
        }));

        setReports(fetchedReports);
        setAllReports(fetchedReports);
      } catch (error) {
        console.error('Erro ao buscar denúncias:', error);
        Alert.alert('Erro', 'Não foi possível buscar as denúncias.');
      } finally {
        setLoading(false);
      }
    };

    const fetchLocationData = async (reportId) => {
      try {
        const locationsCollection = collection(database, 'Locations');
        const locationQuery = query(locationsCollection, where("reportId", "==", reportId));
        const locationSnapshot = await getDocs(locationQuery);
    
        return locationSnapshot.docs[0]?.data() || { nome_localizacao: "Local não encontrado", longitude: null, latitude: null };
      } catch (error) {
        console.error('Erro ao buscar localização:', error);
        return { nome_localizacao: "Local não encontrado", longitude: null, latitude: null };
      }
    };
  
    const fetchLatestStatus = async (reportId) => {
      try {
        const statusCollection = collection(database, 'StatusUpdates');
        const statusQuery = query(
          statusCollection,
          where("reportId", "==", reportId),
          limit(1)
        );
        const statusSnapshot = await getDocs(statusQuery);
        return statusSnapshot.docs[0]?.data()?.status || "Status não encontrado";
      } catch (error) {
        console.error('Erro ao buscar status:', error);
        return "Erro ao buscar status"; 
      }
    };

    const fetchObservation = async (reportId) => {
      try {
        const observationsCollection = collection(database, 'Observations');
        const observationQuery = query(observationsCollection, where("reportId", "==", reportId));
        const observationSnapshot = await getDocs(observationQuery);
        
        return observationSnapshot.docs[0]?.data()?.observation || "";
      } catch (error) {
        console.error('Erro ao buscar observação:', error);
        return "Erro ao buscar observação";
      }
    };

    fetchReports();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => handlePress(item)}>
      <Text style={styles.itemText}>Bairro: {item.locationName}</Text>
      <Text style={styles.itemText}>Status: {item.status}</Text>
      <Text style={styles.itemText}>Data: {item.formattedDate}</Text>
      <Text style={styles.itemText}>Atualizações: {item.observation}</Text>
    </TouchableOpacity>
  );

  const handlePress = (item) => {
    navigation.navigate('ReportDetails', { report: item });
  };

  const filterReports = () => {
    setFilterVisible(true);
  };

  

  const applyFilters = () => {
    const filteredReports = allReports.filter((report) => {
      if (!report.createdAt) {
        console.warn('Campo createdAt ausente:', report);
        return false;
      }
  
      const reportDate = new Date(report.createdAt).getTime();
      const startDateMs = new Date(startDate).getTime();
      const endDateMs = new Date(endDate).getTime();
  
      return reportDate >= startDateMs && reportDate <= endDateMs && (status ? report.status === status : true);
    });
  
    setReports(filteredReports);
    setFilterVisible(false);
  };
  
  
  const statusOptions = [
    { label: 'Em Aberto', value: 'em aberto' },
          { label: 'Em Tratamento', value: 'em tratamento' },
          { label: 'Resolvida', value: 'resolvida' },
];
  
  
  return (
    <View style={styles.container}>
      <Button title="Filtrar" onPress={filterReports} />
      {loading ? (
        <Text>Carregando...</Text>
      ) : (
        <FlatList
          data={reports}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}

      {/* Modal de Filtro */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterVisible}
        onRequestClose={() => setFilterVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Filtrar Denúncias</Text>

          {/* Seletor de Data de Início */}
    <Text>Data de Início:</Text>
    <Button title="Selecionar Data de Início" onPress={() => setShowStartDatePicker(true)} />
    {showStartDatePicker && (
      <DateTimePicker
      value={startDate}
      mode="date"
      display="default"
      onChange={(event, selectedDate) => {
        setShowStartDatePicker(false);
        if (selectedDate) {
          setStartDate(selectedDate);
        }
      }}
    />
    )}
          {/* Seletor de Data de Fim */}
    <Text>Data de Fim:</Text>
    <Button title="Selecionar Data de Fim" onPress={() => setShowEndDatePicker(true)} />
    {showEndDatePicker && (
      <DateTimePicker
        value={endDate}
        mode="date"
        display="default"
        onChange={(event, selectedDate) => {
          setShowEndDatePicker(false);
          if (selectedDate) {
            setEndDate(selectedDate);
          }
        }}
      />
    )}

          {/* Seletor de Status */}
          <Text>Status:</Text>
          <RNPickerSelect
           onValueChange={(value) => setStatus(value)}
           items={statusOptions}
  style={{
    inputIOS: {
      color: 'black',
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      marginBottom: 10,
    },
    inputAndroid: {
      color: 'black',
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      marginBottom: 10,
    },
  }}
  placeholder={{
    label: 'Selecione o Status...',
    value: null,
    color: 'gray',
  }}
/>


          <Pressable style={[styles.button, styles.buttonClose]} onPress={applyFilters}>
            <Text style={styles.textStyle}>Aplicar Filtros</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.buttonClose]} onPress={() => setFilterVisible(false)}>
            <Text style={styles.textStyle}>Fechar</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  itemContainer: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginVertical: 5,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    textAlign: 'center',
  },
});
