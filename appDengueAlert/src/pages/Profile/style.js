import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 25, 
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', 
        width: '100%',
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 12, 
        borderRadius: 25, 
        flex: 1, 
        marginHorizontal: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default styles;
