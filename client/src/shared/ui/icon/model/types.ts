export type IconName = 'close' | 'video-off' | 'video-on' | 'mic-off' | 'mic-on' | 'send' | 'mute-on' | 'mute-off' | 'share' | 'chat'

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}
