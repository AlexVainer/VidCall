export type IconName = 'close' | 'video-off' | 'video-on' | 'mic-off' | 'mic-on' | 'send' | 'mute-on' | 'mute-off' | 'share' | 'chat' | 'lang' | 'copy' | 'home'

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}
