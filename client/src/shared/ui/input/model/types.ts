export interface InputProps {
    ref?: React.ForwardedRef<HTMLInputElement>,
    error?: string,
    value?: string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    placeholder?: string,
    type?: string,
    title?: string,
    onEnter?: () => void
} 
