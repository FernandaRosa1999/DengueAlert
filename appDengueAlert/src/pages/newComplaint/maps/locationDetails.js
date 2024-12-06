import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Switch, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { database } from '../../../config/firebaseconfig';
import { doc, updateDoc, addDoc, collection } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LocationDetails({ route }) {
  const navigation = useNavigation();
  const { nome_localizacao, localizationId, latitude, longitude, photoUri, description } = route.params;

  if (!localizationId) {
    Alert.alert('Erro', 'ID da localização não encontrado. Por favor, tente novamente.');
    return null;
  }

  const [number, setNumber] = useState('');
  const [isNumberSelected, setNumberSelection] = useState(false);
  const [complement, setComplement] = useState('');
  const [isComplementSelected, setComplementSelection] = useState(false);
  const [referencePoint, setReferencePoint] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorNumber, setErrorNumber] = useState(false);
  const [errorComplement, setErrorComplement] = useState(false);

  const handleSave = async () => {
    let isValid = true;

    if (!isNumberSelected && (!number || isNaN(number) || !Number.isInteger(parseFloat(number)))) {
      setErrorNumber(true);
      isValid = false;
    } else {
      setErrorNumber(false);
    }


    if (!isComplementSelected && !complement) {
      setErrorComplement(true);
      isValid = false;
    } else {
      setErrorComplement(false);
    }

    if (!isValid) {
      Alert.alert('Erro', 'Por favor, corrija os campos obrigatórios.');
      return;
    }

    const data = {
      address: {
        number: isNumberSelected ? null : parseInt(number, 10),
        complement: isComplementSelected ? null : complement,
        referencePoint,
      },
      createdAt: new Date(),
    };

    try {
      setLoading(true);
      const reportId = await AsyncStorage.getItem('reportID');
      if (reportId) {
        const docRef = await addDoc(collection(database, "StatusUpdates"), {
          reportId: reportId,
          status: 'em análise',
          createdAt: new Date()
        });
        const statusId = docRef.id;
        await AsyncStorage.setItem('statusId', statusId);
        await updateDoc(doc(database, 'Locations', localizationId), data);
        Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
        navigation.navigate('Home');
      } else {
        Alert.alert('Erro', 'ID do relatório não encontrado.');
      }
    } catch (error) {
      console.error('Erro ao atualizar dados: ', error);
      Alert.alert('Erro', 'Não foi possível atualizar os dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleNumberSwitchChange = (value) => {
    setNumberSelection(value);
    setErrorNumber(false);
    if (value) {
      setNumber('');
    }
  };

  const handleComplementSwitchChange = (value) => {
    setComplementSelection(value);
    setErrorComplement(false);
    if (value) {
      setComplement('');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <Text style={styles.title}>Localização Selecionada:</Text>
        <Text style={styles.locationText}>{nome_localizacao}</Text>
        
        <TextInput
          style={[styles.input, errorNumber && styles.inputError]}
          placeholder="Número *"
          value={number}
          onChangeText={text => setNumber(text)}
          editable={!isNumberSelected}
          keyboardType="numeric"
        />
        {errorNumber && <Text style={styles.errorText}>Número é obrigatório</Text>}
        
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Endereço sem número</Text>
          <Switch
            value={isNumberSelected}
            onValueChange={handleNumberSwitchChange}
          />
        </View>
        
        <TextInput
          style={[styles.input, errorComplement && styles.inputError]}
          placeholder="Complemento *"
          value={complement}
          onChangeText={text => setComplement(text)}
          editable={!isComplementSelected}
        />
        {errorComplement && <Text style={styles.errorText}>Complemento é obrigatório</Text>}
        
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Endereço sem complemento</Text>
          <Switch
            value={isComplementSelected}
            onValueChange={handleComplementSwitchChange}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Ponto de referência (opcional)"
          value={referencePoint}
          onChangeText={text => setReferencePoint(text)}
        />
        
        <TouchableOpacity onPress={handleSave} disabled={loading} style={styles.button}>
          {loading ? (
            <ActivityIndicator size="large" color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Salvar</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
  },
  button: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#007BFF',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
