import React from 'react';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

export type IconName =
  | 'back'
  | 'next'
  | 'lock'
  | 'star'
  | 'play'
  | 'check'
  | 'close'
  | 'sound'
  | 'refresh'
  | 'home'
  | 'gear'
  | 'crown'
  | 'eraser';

export function Icon({ name, size = 28, color = '#2B2D42' }: { name: IconName; size?: number; color?: string }) {
  const s = { stroke: color, strokeWidth: 3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      {name === 'back' && <Path d="M19 6 L9 16 L19 26" {...s} strokeWidth={4} />}
      {name === 'next' && <Path d="M13 6 L23 16 L13 26" {...s} strokeWidth={4} />}
      {name === 'lock' && (
        <>
          <Rect x="7" y="14" width="18" height="13" rx="3" fill={color} />
          <Path d="M11 14 V10 a5 5 0 0 1 10 0 V14" {...s} />
        </>
      )}
      {name === 'star' && (
        <Path
          d="M16 3 L19.8 11.2 L28.6 12.1 L22 18.1 L23.9 26.9 L16 22.4 L8.1 26.9 L10 18.1 L3.4 12.1 L12.2 11.2 Z"
          fill={color}
          stroke={color}
          strokeWidth={2}
          strokeLinejoin="round"
        />
      )}
      {name === 'play' && <Path d="M11 7 L25 16 L11 25 Z" fill={color} stroke={color} strokeWidth={2} strokeLinejoin="round" />}
      {name === 'check' && <Path d="M7 17 L13 23 L25 9" {...s} strokeWidth={4} />}
      {name === 'close' && <Path d="M9 9 L23 23 M23 9 L9 23" {...s} strokeWidth={4} />}
      {name === 'sound' && (
        <>
          <Path d="M5 12 H10 L17 6 V26 L10 20 H5 Z" fill={color} stroke={color} strokeWidth={2} strokeLinejoin="round" />
          <Path d="M21 11 a6 6 0 0 1 0 10 M24 7 a11 11 0 0 1 0 18" {...s} />
        </>
      )}
      {name === 'refresh' && (
        <>
          <Path d="M25 16 a9 9 0 1 1 -3 -6.7" {...s} />
          <Path d="M23 4 V10 H17" {...s} />
        </>
      )}
      {name === 'home' && <Path d="M5 15 L16 5 L27 15 V27 H19 V20 H13 V27 H5 Z" fill={color} stroke={color} strokeWidth={2} strokeLinejoin="round" />}
      {name === 'gear' && (
        <>
          <Circle cx="16" cy="16" r="5" {...s} />
          <Path d="M16 3 V7 M16 25 V29 M3 16 H7 M25 16 H29 M6.8 6.8 L9.6 9.6 M22.4 22.4 L25.2 25.2 M6.8 25.2 L9.6 22.4 M22.4 9.6 L25.2 6.8" {...s} />
        </>
      )}
      {name === 'crown' && (
        <Path d="M4 10 L10 16 L16 6 L22 16 L28 10 L25 25 H7 Z" fill={color} stroke={color} strokeWidth={2} strokeLinejoin="round" />
      )}
      {name === 'eraser' && (
        <>
          <Path d="M18 5 L27 14 L15 26 H8 L4 22 Z" fill={color} stroke={color} strokeWidth={2} strokeLinejoin="round" />
          <Path d="M11 12 L20 21" stroke="#FFFFFF" strokeWidth={2.5} />
        </>
      )}
    </Svg>
  );
}
