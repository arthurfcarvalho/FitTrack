import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import AddWorkoutScreen from './screens/AddWorkoutScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'FitTrack' }} />
        <Stack.Screen name="AddWorkout" component={AddWorkoutScreen} options={{ title: 'Adicionar Treino' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
