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
import TDListArtPacman from './TDListArtPacman'; // 引入吃豆人组件

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export default function TDListTaskBlock({
  tasks,
  onDelete,
}: {
  tasks: Task[];
  onDelete: (id: number) => void;
}) {
  const resetFunctions = useRef<(() => void)[]>([]);
  const globalResetTimer = useRef<NodeJS.Timeout | null>(null);

  const registerReset = (resetFunc: () => void) => {
    resetFunctions.current = [...resetFunctions.current, resetFunc];
  };

  const resetAllTasks = () => {
    resetFunctions.current.forEach((reset) => reset());
    resetFunctions.current = [];
  };

  const startGlobalTimer = () => {
    if (globalResetTimer.current) clearTimeout(globalResetTimer.current);
    globalResetTimer.current = setTimeout(() => {
      resetAllTasks();
    }, 10000);
  };

  const handleScreenPress = () => {
    resetAllTasks();
  };

  return (
    <TouchableWithoutFeedback onPress={handleScreenPress}>
      <View style={styles.container}>
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
  const [isChomping, setIsChomping] = useState(false);

  const resetPosition = () => {
    Animated.timing(translateX, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const startAutoResetTimer = () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => {
      resetPosition();
    }, 10000);
  };

  const handleExpand = () => {
    registerReset(resetPosition);
    startGlobalTimer();
    startAutoResetTimer();
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      if (gesture.dx < 0) translateX.setValue(gesture.dx);
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx < -30) {
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
      {/* 底层功能任务块：用Pac-Man代替垃圾桶图标 */}
      <View style={styles.deleteTask}>
        <TouchableOpacity
          onPress={() => {
            setIsChomping(true);
          }}
          style={styles.trashButton}
        >
          <TDListArtPacman
            isChomping={isChomping}
            onChompComplete={() => {
              onDelete();
              resetPosition();
            }}
          />
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
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: 'transparent',
  },
  taskWrapper: {
    position: 'relative',
    marginBottom: 10, // 增加任务块之间的间距
    marginHorizontal: 25, // 调整任务块左右的间距
  },
  deleteTask: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#B0B0B0', // 修改为浅灰色
    justifyContent: 'center',
    alignItems: 'flex-end',
    borderRadius: 20, // 调整任务块的圆角
    paddingRight: 20,
  },
  trashButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  taskContainer: {
    backgroundColor: '#4A4A4A', // 修改为中灰色的任务块背景
    borderRadius: 20, // 调整任务块的圆角
    padding: 20, // 增加内边距
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  taskText: { 
    fontSize: 16, 
    color: '#FFFFFF', // 确保文字在深灰色背景上清晰可读
  },
});