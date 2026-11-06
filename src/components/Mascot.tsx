import React from 'react';
import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';

type Mood = 'happy' | 'wow' | 'wink' | 'sleepy';

/**
 * Bolajon — ilovaning maskoti: doppili quvnoq bolakay.
 */
export function Mascot({ size = 120, mood = 'happy' }: { size?: number; mood?: Mood }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      {/* quloqlar */}
      <Circle cx="34" cy="112" r="18" fill="#F7B98B" />
      <Circle cx="166" cy="112" r="18" fill="#F7B98B" />
      <Circle cx="36" cy="112" r="9" fill="#EE9C6C" />
      <Circle cx="164" cy="112" r="9" fill="#EE9C6C" />
      {/* bosh */}
      <Circle cx="100" cy="110" r="68" fill="#FFD0A6" />
      {/* soch */}
      <Path d="M40 96 C44 58 72 40 100 40 C130 40 158 58 160 96 C146 80 128 74 112 76 C100 70 84 72 72 80 C60 82 48 88 40 96 Z" fill="#5B3A29" />
      {/* doppi */}
      <Path d="M52 70 L60 30 C80 20 120 20 140 30 L148 70 C120 60 80 60 52 70 Z" fill="#1F2A44" />
      <Path d="M52 70 C80 60 120 60 148 70 L150 78 C120 68 80 68 50 78 Z" fill="#FFC93C" />
      <G fill="#FFFFFF">
        <Path d="M74 52 C70 42 78 34 84 40 C86 46 80 50 74 52 Z" />
        <Path d="M100 48 C96 38 104 30 110 36 C112 42 106 46 100 48 Z" />
        <Path d="M126 52 C122 42 130 34 136 40 C138 46 132 50 126 52 Z" />
      </G>
      {/* yuz */}
      {mood === 'sleepy' ? (
        <G stroke="#2B2D42" strokeWidth="6" strokeLinecap="round" fill="none">
          <Path d="M66 112 Q76 120 86 112" />
          <Path d="M114 112 Q124 120 134 112" />
        </G>
      ) : (
        <G>
          <Ellipse cx="76" cy="110" rx="11" ry={mood === 'wow' ? 15 : 13} fill="#2B2D42" />
          {mood === 'wink' ? (
            <Path d="M112 112 Q124 102 136 112" stroke="#2B2D42" strokeWidth="6" strokeLinecap="round" fill="none" />
          ) : (
            <Ellipse cx="124" cy="110" rx="11" ry={mood === 'wow' ? 15 : 13} fill="#2B2D42" />
          )}
          <Circle cx="80" cy="105" r="4" fill="#FFFFFF" />
          {mood !== 'wink' && <Circle cx="128" cy="105" r="4" fill="#FFFFFF" />}
        </G>
      )}
      {/* yonoqlar */}
      <Ellipse cx="58" cy="134" rx="13" ry="8" fill="#FF8FA3" opacity="0.7" />
      <Ellipse cx="142" cy="134" rx="13" ry="8" fill="#FF8FA3" opacity="0.7" />
      {/* og'iz */}
      {mood === 'wow' ? (
        <Ellipse cx="100" cy="146" rx="13" ry="15" fill="#B23A48" />
      ) : mood === 'sleepy' ? (
        <Path d="M90 146 Q100 152 110 146" stroke="#B23A48" strokeWidth="6" strokeLinecap="round" fill="none" />
      ) : (
        <G>
          <Path d="M74 136 Q100 172 126 136 Z" fill="#B23A48" />
          <Path d="M86 152 Q100 162 114 152 Q100 146 86 152 Z" fill="#FF7A8A" />
        </G>
      )}
    </Svg>
  );
}
