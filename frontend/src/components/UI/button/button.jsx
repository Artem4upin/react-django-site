import './button.css'

function Button ({className, text, onClick, disabled}) {
    return(
        <div className='button'>
            <button 
            className={className} 
            onClick={onClick}
            disabled={disabled}
            >
            {text}
            </button>
        </div>
    )
}

export default Button