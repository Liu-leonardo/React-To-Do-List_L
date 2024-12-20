import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TDListTaskBlock from './TDListTaskBlock';
import TDListPopup from './TDListPopup';
import TDListDailyTasks from './TDListDailyTasks';
import TDListTaskbar from './TDListTaskbar'; // 引入状态栏组件

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const TITLES = [
  "What's up, User!",
  "嗨！今天过的如何!",
  "Hi, How are you :)",
];

export default function TodoListScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [mainTitle, setMainTitle] = useState<string>("");
  const [batteryLevel, setBatteryLevel] = useState<number>(10); // 初始电量

  useEffect(() => {
    // 每次加载随机选取一个标题
    const randomTitle = TITLES[Math.floor(Math.random() * TITLES.length)];
    setMainTitle(randomTitle);
  }, []);

  useEffect(() => {
    // 动态更新电池电量
    setBatteryLevel(Math.max(0, 10 - tasks.length));
  }, [tasks]);

  const addTask = (taskText: string) => {
    setTasks([...tasks, { id: Date.now(), text: taskText, completed: false }]);
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const resetTasks = () => {
    setTasks([]); // 清空任务
    setBatteryLevel(10); // 重置电量
  };

  const toggleSidebar = () => {
    console.log('Sidebar toggled!');
    // 在此实现侧边栏逻辑
  };

  return (
    <View style={styles.container}>
      {/* 状态栏 */}
      <TDListTaskbar
        onReset={resetTasks}
        onSidebarToggle={toggleSidebar}
        batteryLevel={batteryLevel}
      />

      {/* 状态栏占位符 */}
      <View style={styles.statusBarPlaceholder}></View>

      {/* 大标题 */}
      <Text style={styles.mainTitle}>{mainTitle}</Text>

      {/* 每日任务推荐模块的标题 */}
      <Text style={styles.subTitle}>不知道做啥？不妨试试每日推荐！</Text>
      {/* 集成每日任务模块 */}
      <TDListDailyTasks />

      {/* 今日计划模块的标题 */}
      <Text style={styles.subTitle}>今日计划</Text>
      <TDListTaskBlock tasks={tasks} onDelete={deleteTask} />

      {/* 弹窗组件 */}
      <TDListPopup
        visible={isPopupVisible}
        onClose={() => setPopupVisible(false)}
        onAddTask={addTask}
      />

      {/* 添加任务按钮 */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setPopupVisible(true)}
      >
        <Ionicons name="add-circle" size={60} color="#4A4A4A" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(245, 245, 220, 0.7)', // 添加透明度，使颜色更通透
    paddingHorizontal: 8,
    paddingTop: 40,
  },
  statusBarPlaceholder: {
    height: 10, // 状态栏高度占位符
  },
  mainTitle: {
    fontSize: 30, // 大标题字体大小
    fontWeight: 'bold',
    marginBottom: 10, // 与下方元素的间距
    color: '#333', // 确保在浅色背景上的文字可读性
  },
  subTitle: {
    fontSize: 18, // 小标题字体大小
    fontWeight: '600',
    marginVertical: 10,
    color: '#333',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 0,
    backgroundColor: 'transparent', // 透明按钮背景
    borderRadius: 30, // 圆形按钮
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
