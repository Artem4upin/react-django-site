import './Button.css'

interface IButtonProps {
    className?: string;
    type?: "button" | "submit" | "reset" | undefined;
    text?: string;
    onClick?: () => void;
    disabled?: boolean;
}

function Button ({
    className='',
    type='button',
    text='',
    onClick = () => {},
    disabled = false
}:IButtonProps) {
    return(
        <div className='button'>
            <button 
            className={className}
            type={type} 
            onClick={onClick}
            disabled={disabled}
            >
            {text}
            </button>
        </div>
    )
}

export default Button