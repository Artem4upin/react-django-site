import './Button.css'

function Button ({
    className, 
    type, 
    text, 
    onClick, 
    disabled
}) {
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