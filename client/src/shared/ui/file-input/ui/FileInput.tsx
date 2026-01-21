import { Icon } from '@/shared'
import type { FileInputProps } from '../model/types'
import styles from './FileInput.module.scss'


export const FileInput = ({ onFileSelect, multiple }: FileInputProps) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
            if(files) {
                onFileSelect(files)
            }
    }

    return (
        <div className={styles.fileInput}>
            <label className={styles.fileInput__label} >
                <Icon name='add-file' size={28} />

                <input type="file" className={styles.fileInput__input} hidden onChange={handleFileChange} multiple={multiple}/>
            </label>
        </div>
    )
}
