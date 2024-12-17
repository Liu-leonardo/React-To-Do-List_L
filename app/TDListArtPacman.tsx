import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

interface PacmanProps {
  isMouthOpen: boolean; // 控制吃豆人嘴巴状态
}

export default function TDListArtPacman({ isMouthOpen }: PacmanProps) {
  const mouthAngle = useRef(new Animated.Value(30)).current; // 吃豆人嘴巴张开的角度

  useEffect(() => {
    if (isMouthOpen) {
      // 张开嘴巴动画
      Animated.timing(mouthAngle, {
        toValue: 30,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      // 闭合嘴巴动画
      Animated.timing(mouthAngle, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [isMouthOpen]);

  return (
    <View style={styles.container}>
      {/* 吃豆人的嘴巴 */}
      <View style={[styles.pacman, { transform: [{ rotate: '0deg' }] }]}>
        <Animated.View
          style={[
            styles.mouth,
            {
              transform: [{ rotate: mouthAngle.interpolate({
                inputRange: [0, 30],
                outputRange: ['0deg', '30deg']
              }) }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.mouth,
            {
              transform: [{ rotate: mouthAngle.interpolate({
                inputRange: [0, 30],
                outputRange: ['0deg', '-30deg']
              }) }],
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pacman: {
    width: 50,
    height: 50,
    backgroundColor: 'yellow',
    borderRadius: 25, // 圆形
    position: 'relative',
    overflow: 'hidden',
  },
  mouth: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: '50%',
    backgroundColor: '#F0F4F8', // 与背景一致，形成嘴巴
  },
});
