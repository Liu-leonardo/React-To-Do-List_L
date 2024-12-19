import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TDListTaskBlock from './TDListTaskBlock';
import TDListPopup from './TDListPopup';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoListScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isPopupVisible, setPopupVisible] = useState(false);

  const addTask = (taskText: string) => {
    setTasks([...tasks, { id: Date.now(), text: taskText, completed: false }]);
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <View style={styles.container}>
      <TDListTaskBlock tasks={tasks} onDelete={deleteTask} />
      <TDListPopup
        visible={isPopupVisible}
        onClose={() => setPopupVisible(false)}
        onAddTask={addTask}
      />

      {/* 蓝色按钮 - 触发弹窗 */}
      <TouchableOpacity
        style={[
          styles.addButton,
          tasks.length === 0 ? styles.centerButton : styles.bottomRightButton,
        ]}
        onPress={() => setPopupVisible(true)}
      >
        <Ionicons name="add-circle" size={60} color="blue" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  centerButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -30,
    marginLeft: -30,
  },
  bottomRightButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  
});
