import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window'); // 获取屏幕宽度

const TASKS = [
  '喝一杯水',
  '放松一下看看远处',
  '散步10分钟',
  '吃一份水果',
  '来一盘游戏',
  '给自己做一份炸鸡',
  '去商场购物',
  '去健身房锻炼',
];

export default function TDListDailyTasks() {
  const [dailyTasks, setDailyTasks] = useState<string[]>([]);

  useEffect(() => {
    // 每次加载随机选取4个任务
    const shuffledTasks = TASKS.sort(() => 0.5 - Math.random());
    setDailyTasks(shuffledTasks.slice(0, 4));
  }, []);

  return (
    <View>
      <FlatList
        data={dailyTasks}
        horizontal
        keyExtractor={(item, index) => `${item}-${index}`}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.taskBlock}>
            {/* 任务文本 */}
            <Text style={styles.taskText}>{item}</Text>
          </View>
        )}
        snapToAlignment="start"
        snapToInterval={180 + 20} // 确保滑动对齐（任务块大小+间距）
        decelerationRate="fast"
        pagingEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  taskBlock: {
    width: 180, // 每个任务块宽度
    height: 110, // 每个任务块高度
    marginHorizontal: 5,
    backgroundColor: '#1E3A8A', // 深蓝色背景
    borderRadius: 20, // 更大的圆角弧度
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    elevation: 6, // Android阴影效果
    shadowColor: '#000', // iOS阴影颜色
    shadowOffset: { width: 0, height: 3 }, // iOS阴影偏移
    shadowOpacity: 0.3, // iOS阴影透明度
    shadowRadius: 4, // iOS阴影半径
  },
  taskText: {
    fontSize: 20, // 任务文字大小较大
    color: '#FFFFFF', // 白色文字
    fontWeight: '600',
    textAlign: 'center',
  },
});
