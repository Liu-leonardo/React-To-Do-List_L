import React, { useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Animated,
  PanResponder,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export default function TDListUi({ tasks, onDelete }: { tasks: Task[]; onDelete: (id: number) => void }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do List (待办列表)</Text>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <SwipeableTask task={item} onDelete={() => onDelete(item.id)} />
        )}
      />
    </View>
  );
}

function SwipeableTask({ task, onDelete }: { task: Task; onDelete: () => void }) {
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      if (gesture.dx < 0) translateX.setValue(gesture.dx);
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx < -30) {
        // 滑动超过 30px 展开
        Animated.timing(translateX, {
          toValue: -100,
          duration: 200,
          useNativeDriver: false,
        }).start();
      } else {
        resetPosition();
      }
    },
  });

  const resetPosition = () => {
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

      {/* 上层常规任务块 */}
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
  container: { flex: 1, padding: 16, backgroundColor: '#F0F4F8' },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 20,
    color: '#333',
  },
  taskWrapper: {
    position: 'relative',
    marginBottom: 10,
    marginHorizontal: 30, // 左右间距
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
  trashButton: { justifyContent: 'center', alignItems: 'center' },
  taskContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 5, // 添加阴影效果
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  taskText: { fontSize: 16, color: '#333' },
});
