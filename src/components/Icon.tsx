import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

import { colors } from '@/theme';

export type IconName =
  | 'today'
  | 'goals'
  | 'habits'
  | 'calendar'
  | 'gear'
  | 'plus'
  | 'back'
  | 'check'
  | 'flame'
  | 'star'
  | 'clock'
  | 'chart'
  | 'flag'
  | 'bell';

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  /** Fill colour for the inside of the shape (where the icon has one). */
  fill?: string;
};

/** Simple outlined icons, drawn on a 24×24 grid with a thick ink stroke. */
export function Icon({ name, size = 24, color = colors.ink, fill = 'none' }: Props) {
  const s = { stroke: color, strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'today' && (
        <>
          <Circle cx={12} cy={12} r={4.5} fill={fill} {...s} />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
            const r = (a * Math.PI) / 180;
            return (
              <Line
                key={a}
                x1={12 + Math.cos(r) * 7.5}
                y1={12 + Math.sin(r) * 7.5}
                x2={12 + Math.cos(r) * 10}
                y2={12 + Math.sin(r) * 10}
                {...s}
              />
            );
          })}
        </>
      )}
      {name === 'goals' && (
        <>
          <Circle cx={12} cy={12} r={9.5} fill={fill} {...s} />
          <Circle cx={12} cy={12} r={5.5} {...s} fill="none" />
          <Circle cx={12} cy={12} r={1.6} fill={color} stroke="none" />
        </>
      )}
      {name === 'habits' && (
        <>
          <Circle cx={12} cy={12} r={9.5} fill={fill} {...s} />
          <Path d="M7.5 12.3l3 3 6-6.3" fill="none" {...s} />
        </>
      )}
      {name === 'calendar' && (
        <>
          <Rect x={3} y={5} width={18} height={16} rx={3.5} fill={fill} {...s} />
          <Line x1={3} y1={10} x2={21} y2={10} {...s} />
          <Line x1={8} y1={3} x2={8} y2={7} {...s} />
          <Line x1={16} y1={3} x2={16} y2={7} {...s} />
        </>
      )}
      {name === 'gear' && (
        <>
          <Path
            d="M12 2.8l1.6 2.3 2.7-.7.6 2.7 2.6 1-.9 2.6 1.8 2.1-2.2 1.7.4 2.8-2.8.2-1.1 2.6-2.5-1.3-2.5 1.3-1.1-2.6-2.8-.2.4-2.8-2.2-1.7 1.8-2.1-.9-2.6 2.6-1 .6-2.7 2.7.7z"
            fill={fill}
            {...s}
          />
          <Circle cx={12} cy={12} r={3} fill="none" {...s} />
        </>
      )}
      {name === 'plus' && (
        <>
          <Line x1={12} y1={5} x2={12} y2={19} {...s} strokeWidth={2.4} />
          <Line x1={5} y1={12} x2={19} y2={12} {...s} strokeWidth={2.4} />
        </>
      )}
      {name === 'back' && <Path d="M15 5l-7 7 7 7" fill="none" {...s} strokeWidth={2.4} />}
      {name === 'check' && <Path d="M5 12.5l4.5 4.5L19 7.5" fill="none" {...s} strokeWidth={2.4} />}
      {name === 'flame' && (
        <Path
          d="M12 21.5c-4.1 0-7-2.8-7-6.6 0-3.3 2.2-5.4 3.6-7.3.4 1.8 1.3 2.9 2.4 3.4-.3-3.3 1.3-6.2 3.7-8.5.3 3.3 1.6 5 3 6.8 1.1 1.4 2.3 3.1 2.3 5.6 0 3.8-3.1 6.6-8 6.6z"
          fill={fill}
          {...s}
        />
      )}
      {name === 'star' && (
        <Path
          d="M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z"
          fill={fill}
          {...s}
        />
      )}
      {name === 'clock' && (
        <>
          <Circle cx={12} cy={12} r={9.5} fill={fill} {...s} />
          <Path d="M12 7v5.3l3.4 2" fill="none" {...s} />
        </>
      )}
      {name === 'chart' && (
        <>
          <Rect x={3.5} y={12} width={4} height={8.5} rx={1.2} fill={fill} {...s} />
          <Rect x={10} y={7} width={4} height={13.5} rx={1.2} fill={fill} {...s} />
          <Rect x={16.5} y={3.5} width={4} height={17} rx={1.2} fill={fill} {...s} />
        </>
      )}
      {name === 'flag' && (
        <>
          <Line x1={5} y1={3} x2={5} y2={21} {...s} />
          <Path d="M5 4h12.5l-2.8 4 2.8 4H5" fill={fill} {...s} />
        </>
      )}
      {name === 'bell' && (
        <>
          <Path
            d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.7 2H4.3z"
            fill={fill}
            {...s}
          />
          <Path d="M10 20.5a2.2 2.2 0 0 0 4 0" fill="none" {...s} />
        </>
      )}
    </Svg>
  );
}
