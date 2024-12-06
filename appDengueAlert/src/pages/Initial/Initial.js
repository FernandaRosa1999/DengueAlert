import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LogoDengueAlert from '../../images/LogoDengueAlert.png'; 

const { width } = Dimensions.get('window');

export default function Initial() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* ScrollView Horizontal */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.scrollContainer}
      >
        <View style={styles.slide}>
          <Text style={styles.slideText}>Bem-vindo ao DengueAlert!</Text>
          <Image source={LogoDengueAlert} style={styles.logo} />
          <Text style={styles.slideDescription}>Registre denúncias de surtos de dengue na sua região.</Text>
        </View>
        
        <View style={styles.slide}>
          <Text style={styles.slideText}>Acompanhe o Status</Text>
          <Text style={styles.slideDescription}>Veja o status das denúncias e saiba quais já estão em tratamento ou foram resolvidas.</Text>
        </View>
        
      </ScrollView>

      {/* Botões */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('NewUser')}
      >
        <Text style={styles.buttonText}>Cadastre-se</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('User')}
      >
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    height: 250, 
    marginBottom: 30,
  },
  slide: {
    width: width * 0.8, 
    marginHorizontal: width * 0.1,
    padding: 20,
    backgroundColor: '#F8F8F8',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  slideText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  slideDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FFC107',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
