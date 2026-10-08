// lucide v1 non include più i loghi dei marchi: icona Instagram disegnata con lo stesso stile (stroke 2).
import Svg, { Circle, Rect } from 'react-native-svg';

type Props = { size?: number; color?: string; strokeWidth?: number };

export function InstagramIcon({ size = 24, color = 'currentColor', strokeWidth = 2 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round">
      <Rect x={2} y={2} width={20} height={20} rx={5} ry={5} />
      <Circle cx={12} cy={12} r={4} />
      <Circle cx={17.5} cy={6.5} r={0.5} fill={color} />
    </Svg>
  );
}
