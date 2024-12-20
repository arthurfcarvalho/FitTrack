import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Workout {
  name: string;
  description: string;
  duration?: string;
  intensity?: string;
}

export default function HomeScreen({ navigation }: any) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const loadWorkouts = async () => {
    const savedWorkouts = await AsyncStorage.getItem('workouts');
    if (savedWorkouts) {
      setWorkouts(JSON.parse(savedWorkouts));
    } else {
      setWorkouts([]);
    }
  };

  const editWorkout = (index: number) => {
    const workoutToEdit = workouts[index];
    navigation.navigate('AddWorkout', { workoutToEdit, index });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadWorkouts);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        data={workouts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.workoutItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.description}>{item.description}</Text>
              {item.duration && <Text style={styles.detail}>Duração: {item.duration}</Text>}
              {item.intensity && <Text style={styles.detail}>Intensidade: {item.intensity}</Text>}
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => editWorkout(index)}
            >
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddWorkout')}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  workoutItem: {
    flexDirection: 'row',
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  description: { fontSize: 14, color: '#666', marginBottom: 5 },
  detail: { fontSize: 12, color: '#999', marginBottom: 5 },
  editButton: {
    backgroundColor: '#FFA726',
    padding: 10,
    marginLeft: 5,
    borderRadius: 8,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#6200EE',
    borderRadius: 50,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
});
