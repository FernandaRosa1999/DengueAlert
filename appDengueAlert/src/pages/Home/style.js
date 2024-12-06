
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
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
  logoutButton: {
    backgroundColor: '#87CEEB',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 12, 
  },
});

export default styles;
