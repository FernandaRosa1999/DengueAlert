import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './style';

export default function Home() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.board}>
        <View style={styles.ordersContainer}>
          <TouchableOpacity
            style={styles.orderButton}
            onPress={() => navigation.navigate('Complaint')}
          >
            <Text style={styles.buttonText}>Nova Denúncia</Text>
            <Text style={styles.buttonSubText}>Insira uma nova denúncia</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.orderButton}
            onPress={() => navigation.navigate('StatusReport')}
          >
            <Text style={styles.buttonText}>Status de Denúncias</Text>
            <Text style={styles.buttonSubText}>Verificar status de denúncias realizadas</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.orderButton}
            onPress={() => navigation.navigate('UserProfile')}
          >
            <Text style={styles.buttonText}>Verificar Perfil</Text>
          </TouchableOpacity>
       
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={() => navigation.navigate('User')}
          >
            <Text style={styles.buttonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
