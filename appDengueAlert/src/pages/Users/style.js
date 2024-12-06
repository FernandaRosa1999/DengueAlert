import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        backgroundColor: "#f9f9f9",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    logo: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
        marginBottom: 20,
      },
    name: {
        height: 50,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    input: {
        height: 50,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        flex: 1, 
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center", 
        marginBottom: 15,
    },
    button: {
        backgroundColor: "#007BFF", 
        borderRadius: 25, 
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15, 
    },
    buttonText: {
        color: "#ffffff", 
        fontSize: 18,
        fontWeight: "bold",
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    iconButton: {
        marginLeft: -35, 
    },
});

export default styles;
