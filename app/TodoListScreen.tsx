import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

export default function TodoListScreen() {
  const [tasks, setTasks] = useState<string[]>([]);
  const [task, setTask] = useState('');

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, task]);
      setTask('');
    }
  };

  return (
    <View style={styles.container}>
      {/* 将标题向下移动 30px */}
      <Text style={styles.title}>To-Do List(待办列表)</Text>
      <TextInput
        placeholder="在这里输入你的计划"
        style={styles.input}
        value={task}
        onChangeText={setTask}
      />
      <Button title="创建新计划" onPress={addTask} />
      <FlatList
        data={tasks}
        renderItem={({ item }) => <Text style={styles.task}>{item}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#fff' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    marginTop: 15, // 向下移动 30px
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 10, 
    marginBottom: 10, 
    borderRadius: 5 
  },
  task: { 
    fontSize: 18, 
    marginVertical: 5 
  },
});
