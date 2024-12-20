import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { RadioButton } from 'react-native-paper';
import { RouteProp, useRoute } from '@react-navigation/native';

interface RouteParams {
  workoutToEdit?: {
    name: any;
    description: any;
    mode: any;
    series?: any;
    reps?: any;
    weight?: any;
    time?: any;
    timeUnit?: any;
  };
  index?: any;
}


export default function AddWorkoutScreen({ navigation }: any) {
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const { workoutToEdit, index } = route.params || {};

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [mode, setMode] = useState('series');
  const [series, setSeries] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [time, setTime] = useState('');
  const [timeUnit, setTimeUnit] = useState('seconds');

  useEffect(() => {
    if (workoutToEdit) {
      setName(workoutToEdit.name);
      setDescription(workoutToEdit.description);
      setMode(workoutToEdit.mode);
      if (workoutToEdit.mode === 'series') {
        setSeries(workoutToEdit.series);
        setReps(workoutToEdit.reps);
        setWeight(workoutToEdit.weight);
      } else {
        setTime(workoutToEdit.time);
        setTimeUnit(workoutToEdit.timeUnit);
      }
    }
  }, [workoutToEdit]);

  const saveWorkout = async () => {
    const existingWorkouts = await AsyncStorage.getItem('workouts');
    const workouts = existingWorkouts ? JSON.parse(existingWorkouts) : [];
    const newWorkout = {
      name,
      description,
      mode,
      ...(mode === 'series' ? { series, reps, weight } : { time, timeUnit }),
    };

    if (index !== undefined) {
      workouts[index] = newWorkout;
    } else {
      workouts.push(newWorkout);
    }

    await AsyncStorage.setItem('workouts', JSON.stringify(workouts));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nome do Treino"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder={mode === 'series' ? 'Descrição do exercício' : 'Descrição'}
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <View style={styles.radioGroup}>
        <RadioButton
          value="series"
          status={mode === 'series' ? 'checked' : 'unchecked'}
          onPress={() => setMode('series')}
        />
        <Text>Séries</Text>
        <RadioButton
          value="time"
          status={mode === 'time' ? 'checked' : 'unchecked'}
          onPress={() => setMode('time')}
        />
        <Text>Tempo</Text>
      </View>
      {mode === 'series' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Séries"
            value={series}
            onChangeText={setSeries}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Repetições"
            value={reps}
            onChangeText={setReps}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Carga (kg)"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
          />
        </>
      )}
      {mode === 'time' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Tempo"
            value={time}
            onChangeText={setTime}
            keyboardType="numeric"
          />
          <Picker
            selectedValue={timeUnit}
            style={styles.picker}
            onValueChange={(itemValue) => setTimeUnit(itemValue)}
          >
            <Picker.Item label="Segundos" value="seconds" />
            <Picker.Item label="Minutos" value="minutes" />
            <Picker.Item label="Horas" value="hours" />
          </Picker>
        </>
      )}
      <Button title="Salvar Treino" onPress={saveWorkout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    fontSize: 18,
    padding: 5,
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    marginVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
});
