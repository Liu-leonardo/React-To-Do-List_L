import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
  PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export default function TDListUi() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');

  // 添加任务
  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  // 删除任务
  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <View style={styles.container}>
      {/* 标题 */}
      <Text style={styles.title}>To-Do List (待办列表)</Text>

      {/* 输入框与按钮 */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="今天想要做点什么？:)"
          value={newTask}
          onChangeText={setNewTask}
        />
        <TouchableOpacity onPress={addTask} style={styles.addButton}>
          <Ionicons name="add-circle" size={40} color="blue" />
        </TouchableOpacity>
      </View>

      {/* 任务列表 */}
      <FlatList
        data={tasks}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <SwipeableTask task={item} onDelete={() => deleteTask(item.id)} />
        )}
      />
    </View>
  );
}

// 单个可滑动任务组件
function SwipeableTask({
  task,
  onDelete,
}: {
  task: Task;
  onDelete: () => void;
}) {
  const translateX = useRef(new Animated.Value(0)).current;
  const timer = useRef<NodeJS.Timeout | null>(null);

  // 滑动手势检测
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      if (gesture.dx < 0) translateX.setValue(gesture.dx); // 左滑
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx < -30) {
        // 超过 30px，展开删除按钮
        Animated.timing(translateX, {
          toValue: -100,
          duration: 200,
          useNativeDriver: false,
        }).start(() => startAutoResetTimer());
      } else {
        resetPosition();
      }
    },
  });

  // 自动重置位置计时器
  const startAutoResetTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      resetPosition();
    }, 10000); // 10 秒后自动重置
  };

  // 重置任务位置
  const resetPosition = () => {
    if (timer.current) clearTimeout(timer.current);
    Animated.timing(translateX, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.taskWrapper}>
      {/* 底层功能任务块 */}
      <View style={styles.deleteTask}>
        <TouchableOpacity onPress={onDelete} style={styles.trashButton}>
          <Ionicons name="trash" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* 上层任务块 */}
      <Animated.View
        style={[styles.taskContainer, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        <Text style={styles.taskText}>{task.text}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 20,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  addButton: {
    marginLeft: 10,
  },
  taskWrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  deleteTask: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FF5722',
    justifyContent: 'center',
    alignItems: 'flex-end',
    borderRadius: 8,
    paddingRight: 20,
  },
  trashButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    zIndex: 1,
  },
  taskText: {
    fontSize: 16,
    color: '#333',
  },
});
