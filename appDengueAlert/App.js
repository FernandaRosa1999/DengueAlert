import React from "react";
import { TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import User from "./src/pages/Users";
import NewUser from "./src/pages/NewUsers";
import Home from "./src/pages/Home";
import UserProfile from "./src/pages/Profile";
import Complaint from "./src/pages/newComplaint/complaint";
import Photograph from "./src/pages/newComplaint/photograph";
import Upload from "./src/pages/newComplaint/upload";
import Localization from "./src/pages/newComplaint/maps/localization";
import LocationDetails from "./src/pages/newComplaint/maps/locationDetails";
import StatusReport from "./src/pages/Report/statusReport";
import ReportDetails from "./src/pages/Report/ReportDetails";
import Initial from "./src/pages/Initial/Initial";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Initial">
      <Stack.Screen
          name="Initial"
          component={Initial}
          options={{
            headerTintColor: "#ffffff",
          }}
        />

        {/* Tela User sem botão de voltar */}
        <Stack.Screen
          name="User"
          component={User}
          options={{
            headerTintColor: "#ffffff",
          }}
        />

        {/* Tela Home sem botão de voltar */}
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerTintColor: "#ffffff",
          }}
        />

        {/* Outras telas com botão de voltar em azul */}
        <Stack.Screen
          name="NewUser" 
          component={NewUser}
          options={({ navigation }) => ({
            headerTintColor: "#ffffff",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#0000FF" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="UserProfile"  
          component={UserProfile}
          options={({ navigation }) => ({
            headerTintColor: "#ffffff",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#0000FF" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Complaint"  
          component={Complaint}
          options={({ navigation }) => ({
            headerTintColor: "#ffffff",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#0000FF" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Photograph" 
          component={Photograph}
          options={({ navigation }) => ({
            headerTintColor: "#ffffff",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#0000FF" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Upload"  
          component={Upload}
          options={({ navigation }) => ({
            headerTintColor: "#ffffff",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#0000FF" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Localization"  
          component={Localization}
          options={({ navigation }) => ({
            headerTintColor: "#ffffff",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#0000FF" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="LocationDetails"  
          component={LocationDetails}
          options={({ navigation }) => ({
            headerTintColor: "#ffffff",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#0000FF" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="StatusReport"  
          component={StatusReport}
          options={({ navigation }) => ({
            headerTintColor: "#ffffff",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#0000FF" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="ReportDetails"  
          component={ReportDetails}
          options={({ navigation }) => ({
            headerTintColor: "#ffffff",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#0000FF" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
