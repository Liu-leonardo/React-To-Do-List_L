import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

interface TDListTaskbarProps {
  onReset: () => void;
  onSidebarToggle: () => void;
  batteryLevel: number; // 电池电量，0-10
}

export default function TDListTaskbar({ onReset, onSidebarToggle, batteryLevel }: TDListTaskbarProps) {
  const [isBatteryPopupVisible, setBatteryPopupVisible] = useState(false);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [showLanguageText, setShowLanguageText] = useState(false);
  const [sidebarAnim] = useState(new Animated.Value(-100)); // 侧边栏初始位置为屏幕外

  const handleBatteryPress = () => {
    setBatteryPopupVisible(true);
  };

  const closeBatteryPopup = () => {
    setBatteryPopupVisible(false);
  };

  const handleSidebarToggle = () => {
    if (isSidebarVisible) {
      // 关闭侧边栏动画
      Animated.timing(sidebarAnim, {
        toValue: -100, // 隐藏侧边栏
        duration: 300,
        useNativeDriver: false,
      }).start(() => setSidebarVisible(false));
    } else {
      // 打开侧边栏动画
      setSidebarVisible(true);
      Animated.timing(sidebarAnim, {
        toValue: 0, // 显示侧边栏
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleLanguagePress = () => {
    setShowLanguageText(true);
    setTimeout(() => {
      setShowLanguageText(false); // 1秒后隐藏文字
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {/* 侧边栏按钮 */}
      <TouchableOpacity onPress={handleSidebarToggle} style={styles.button}>
        <Ionicons name="menu" size={28} color="#333" />
      </TouchableOpacity>

      {/* 重置按钮 */}
      <TouchableOpacity onPress={onReset} style={styles.button}>
        <MaterialIcons name="refresh" size={28} color="#333" />
      </TouchableOpacity>

      {/* 电池按钮 */}
      <TouchableOpacity onPress={handleBatteryPress} style={styles.batteryContainer}>
        <View style={[styles.batteryLevel, { width: `${(batteryLevel / 10) * 100}%` }]} />
        <View style={styles.batteryHead}></View>
      </TouchableOpacity>

      {/* 电池弹窗 */}
      <Modal transparent visible={isBatteryPopupVisible} animationType="fade">
        <TouchableWithoutFeedback onPress={closeBatteryPopup}>
          <View style={styles.overlay}>
            <BlurView
              style={StyleSheet.absoluteFillObject} // 毛玻璃覆盖整个屏幕
              intensity={60} // 模糊强度
              tint="dark" // 深色风格
            />
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.popupContainer}>
          <Text style={styles.popupTitle}>任务电池</Text>
          <Text style={styles.popupText}>
            当你的任务超过10个,电池就会没电!😱
            {"\n"}尝试解决更多的任务来恢复电池的电量吧！
          </Text>
        </View>
      </Modal>

      {/* 侧边栏 */}
      <Modal transparent visible={isSidebarVisible} animationType="none">
        <TouchableWithoutFeedback onPress={handleSidebarToggle}>
          <View style={styles.overlay}>
            <BlurView
              style={StyleSheet.absoluteFillObject} // 毛玻璃覆盖整个屏幕
              intensity={60}
              tint="dark"
            />
          </View>
        </TouchableWithoutFeedback>

        <Animated.View style={[styles.sidebar, { left: sidebarAnim }]}>
          {/* 侧边栏关闭按钮 */}
          <TouchableOpacity style={styles.closeButton} onPress={handleSidebarToggle}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>

          {/* 语言按钮 */}
          <TouchableOpacity style={styles.languageButton} onPress={handleLanguagePress}>
            <Text style={styles.languageText}>切换{"\n"}英文</Text>
          </TouchableOpacity>

          {/* 显示语言文字 */}
          {showLanguageText && (
            <Text style={styles.languageMessage}>让{"\n"}我{"\n"}们{"\n"}说{"\n"}中{"\n"}文{"\n"}😆</Text>
          )}
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    backgroundColor: 'transparent',
    paddingHorizontal: 10,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 4,
    padding: 2,
    width: 60,
    height: 20,
  },
  batteryLevel: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  batteryHead: {
    width: 3,
    height: '80%',
    backgroundColor: '#333',
    position: 'absolute',
    right: -4,
    top: '20%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 100, // 设置侧边栏的宽度
    backgroundColor: 'rgba(245, 245, 220, 1)', // 浅绿色背景
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
  },
  closeButton: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 20,
  },
  languageButton: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
  },
  languageText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  languageMessage: {
    marginTop: 10,
    fontSize: 27,
    fontWeight: 'bold',
    color: '#333',
  },
  popupContainer: {
    position: 'absolute',
    top: '40%',
    left: '10%',
    right: '10%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 10,
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  popupText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
  },
});
