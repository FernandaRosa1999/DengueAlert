import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f9f9f9",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    smallInput: {  
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        padding: 8,
        marginBottom: 15,
    },
    input: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        padding: 8,
        marginBottom: 10,
        flex: 1, 
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
        marginTop: -10,
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        padding: 8,
        marginBottom: 15,
        width: '100%', 
    },
    eyeIcon: {
        marginLeft: 10,
    },
    backIcon: {
        position: "absolute",
        top: 20,
        left: 20,
    },
});

export default styles;
