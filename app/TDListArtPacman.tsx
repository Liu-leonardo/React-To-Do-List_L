import React, { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface PacmanProps {
  isChomping: boolean;
  onChompComplete: () => void;
}

export default function TDListArtPacman({ isChomping, onChompComplete }: PacmanProps) {
  const mouthAngle = useRef(new Animated.Value(0)).current;
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    if (isChomping) {
      // 张嘴->闭嘴->张嘴->闭嘴->张嘴
      Animated.sequence([
        Animated.timing(mouthAngle, {
          toValue: 30, // 闭嘴
          duration: 150,
          useNativeDriver: false,
        }),
        Animated.timing(mouthAngle, {
          toValue: 0, // 张嘴
          duration: 150,
          useNativeDriver: false,
        }),
        Animated.timing(mouthAngle, {
          toValue: 30, // 闭嘴
          duration: 150,
          useNativeDriver: false,
        }),
        Animated.timing(mouthAngle, {
          toValue: 0, // 张嘴
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start(onChompComplete);
    }
  }, [isChomping]);

  // mouthAngle=0 => wedge=60°（大缺口）; mouthAngle=30 => wedge=0°
  const wedgeAngle = mouthAngle.interpolate({
    inputRange: [0, 30],
    outputRange: [60, 0],
  });

  const getPacmanPath = (currentWedgeAngle: number) => {
    const cx = 20;
    const cy = 20;
    const r = 20;

    // 嘴巴中心在180°（朝左）
    const topA = 180 - currentWedgeAngle / 2;
    const bottomA = 180 + currentWedgeAngle / 2;

    const toRad = (deg: number) => (deg * Math.PI) / 180;

    const xTop = cx + r * Math.cos(toRad(topA));
    const yTop = cy + r * Math.sin(toRad(topA));

    const xBottom = cx + r * Math.cos(toRad(bottomA));
    const yBottom = cy + r * Math.sin(toRad(bottomA));

    // 路径：
    // M 移动到上嘴唇点
    // L 到圆心
    // L 到下唇点
    // A 大弧回到上唇点 (largeArcFlag=1表示走大弧线，sweepFlag=0尝试方向)
    // Z 闭合路径
    //
    // 这样形成一个几乎完整的圆，但中间从上唇点-圆心-下唇点形成一块三角形的空缺，
    // 使得缺口更像一个从圆心切出的披萨片，较之前的方案更尖锐、更明显。
    const largeArcFlag = 1;
    const sweepFlag = 1; 

    const path = `
      M ${xTop} ${yTop}
      L ${cx} ${cy}
      L ${xBottom} ${yBottom}
      A ${r} ${r} 0 ${largeArcFlag} ${sweepFlag} ${xTop} ${yTop}
      Z
    `;
    return path;
  };

  useEffect(() => {
    const id = mouthAngle.addListener(({ value }) => {
      const wa = 60 - 2 * value; 
      setCurrentPath(getPacmanPath(wa));
    });
    // 初始状态, mouthAngle=0 => wedge=60°
    setCurrentPath(getPacmanPath(60));
    return () => {
      mouthAngle.removeListener(id);
    };
  }, []);

  return (
    <Svg width={40} height={40}>
      <Path d={currentPath} fill="yellow" />
    </Svg>
  );
}
