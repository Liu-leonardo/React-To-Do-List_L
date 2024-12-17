import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Animated,
  PanResponder,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export default function TDListUi({
  tasks,
  onDelete,
}: {
  tasks: Task[];
  onDelete: (id: number) => void;
}) {
  const resetFunctions = useRef<(() => void)[]>([]); // 存储所有复位函数
  const globalResetTimer = useRef<NodeJS.Timeout | null>(null);

  // 注册复位函数
  const registerReset = (resetFunc: () => void) => {
    resetFunctions.current = [...resetFunctions.current, resetFunc];
  };

  // 重置所有任务块
  const resetAllTasks = () => {
    resetFunctions.current.forEach((reset) => reset());
    resetFunctions.current = [];
  };

  // 启动全局计时器
  const startGlobalTimer = () => {
    if (globalResetTimer.current) clearTimeout(globalResetTimer.current);
    globalResetTimer.current = setTimeout(() => {
      resetAllTasks();
    }, 10000); // 10 秒无操作自动复位
  };

  // 点击屏幕时触发复位
  const handleScreenPress = () => {
    resetAllTasks();
  };

  return (
    <TouchableWithoutFeedback onPress={handleScreenPress}>
      <View style={styles.container}>
        <Text style={styles.title}>To-Do List (待办列表)</Text>
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <SwipeableTask
              task={item}
              onDelete={() => onDelete(item.id)}
              registerReset={registerReset}
              startGlobalTimer={startGlobalTimer}
            />
          )}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

function SwipeableTask({
  task,
  onDelete,
  registerReset,
  startGlobalTimer,
}: {
  task: Task;
  onDelete: () => void;
  registerReset: (resetFunc: () => void) => void;
  startGlobalTimer: () => void;
}) {
  const translateX = useRef(new Animated.Value(0)).current;
  const resetTimer = useRef<NodeJS.Timeout | null>(null);

  // 复位任务块
  const resetPosition = () => {
    Animated.timing(translateX, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  // 启动单个任务的自动复位计时器
  const startAutoResetTimer = () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => {
      resetPosition();
    }, 10000); // 10 秒自动复位
  };

  // 注册复位函数并启动计时器
  const handleExpand = () => {
    registerReset(resetPosition);
    startGlobalTimer();
    startAutoResetTimer();
  };

  // 滑动手势检测
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      if (gesture.dx < 0) translateX.setValue(gesture.dx); // 处理左滑
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx < -30) {
        // 滑动超过 30px，展开任务块
        Animated.timing(translateX, {
          toValue: -100,
          duration: 200,
          useNativeDriver: false,
        }).start(() => handleExpand());
      } else {
        resetPosition();
      }
    },
  });

  return (
    <View style={styles.taskWrapper}>
      {/* 底层功能任务块 */}
      <View style={styles.deleteTask}>
        <TouchableOpacity
          onPress={() => {
            onDelete();
            resetPosition();
          }}
          style={styles.trashButton}
        >
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
    marginHorizontal: 30,
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
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  taskText: { fontSize: 16, color: '#333' },
});
