import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Complaint() {
    const navigation = useNavigation();
    return(
        <View style={styles.board}>
        <View style={styles.ordersContainer}>
          <TouchableOpacity
            style={styles.orderButton}
            onPress={() => navigation.navigate('Photograph')}
          >
            <Text style={styles.buttonText}>Tirar Foto</Text>
          </TouchableOpacity>
          <TouchableOpacity
             style={styles.orderButton}
             onPress={() => navigation.navigate('Upload')}>
            <Text style={styles.buttonText}>Upload Imagem</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    board: {
      padding: 16,
      borderColor: 'rgba(204, 204, 204, 0.4)',
      borderWidth: 1,
      borderRadius: 16,
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
    },
    ordersContainer: {
      flexDirection: 'column',
      width: '100%',
      marginTop: 24,
    },
    orderButton: {
      backgroundColor: '#fff',
      borderColor: 'rgba(204, 204, 204, 0.4)',
      borderWidth: 1,
      height: 128,
      borderRadius: 8,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24, 
    },
    buttonText: {
      fontWeight: '500',
    },

});
    