import { useTranslation } from 'react-i18next'
import { IconButton, Button } from '@/shared'
import type { JoinContainerProps } from '../model/types'
import styles from './RoomPage.module.scss'

export const JoinContainer = ({ isVideoEnabled, toggleVideo, isAudioEnabled, toggleAudio, joinRoom }: JoinContainerProps) => {
  const { t } = useTranslation()
  return (
    <div className={styles.joinContainer}>
        <IconButton icon={isVideoEnabled ? 'video-off' : 'video-on'} isActive={isVideoEnabled} onClick={toggleVideo}>
            <p>{isVideoEnabled ? t('videoOff') : t('videoOn')}</p>
        </IconButton>
        <IconButton icon={isAudioEnabled ? 'mic-off' : 'mic-on'} isActive={isAudioEnabled} onClick={toggleAudio}>
            <p>{isAudioEnabled ? t('audioOff') : t('audioOn')}</p>
        </IconButton>
        <Button onClick={joinRoom} action>
            {t('joinRoom')}
        </Button>
    </div>
)
}
