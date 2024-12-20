import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      {/* 显示简单的提示信息 */}
      <Text style={styles.text}>仍在搭建中...{"\n"}先去别处逛逛吧</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // 占满整个屏幕
    justifyContent: 'center', // 垂直居中
    alignItems: 'center', // 水平居中
    backgroundColor: '#FFF8DC', // 米黄色背景
  },
  text: {
    fontSize: 32, // 放大字体大小
    fontWeight: 'bold', // 加粗文字
    color: '#333', // 深灰色文字颜色
  },
});
