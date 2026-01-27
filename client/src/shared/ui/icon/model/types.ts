export type IconName = 'close' | 'video-off' | 'video-on' | 'mic-off' 
| 'mic-on' | 'send' | 'mute-on' | 'mute-off' 
| 'share' | 'chat' | 'lang' | 'copy' 
| 'home' | 'add-file' | 'file' | 'share-screen' 
| 'share-screen-off' | 'fullsize' | 'fullsize-off' | 'expand'
| 'telegram' | 'whatsapp' | 'email' | 'instagram';

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}
