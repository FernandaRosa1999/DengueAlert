import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth"; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const firebaseConfig = {
    apiKey: "AIzaSyBTv4vVoEpZH_NH-INbrPfmffQrplV2zYg",
    authDomain: "denguealert-29b4d.firebaseapp.com",
    projectId: "denguealert-29b4d",
    storageBucket: "denguealert-29b4d.appspot.com",
    messagingSenderId: "928131677895",
    appId: "1:928131677895:web:3f3afc4c696b30d33f88e2",
    measurementId: "G-K9ZC4GJ5T8"
};

const app = initializeApp(firebaseConfig);

const database = getFirestore(app);

const storage = getStorage(app);


const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export { database, storage, auth };
