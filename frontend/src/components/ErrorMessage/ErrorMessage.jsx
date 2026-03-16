import "./ErrorMessage.css"

function ErrorMessage({
    errorMsg = '',
                      }) {

    return (
        <div>
            {errorMsg && <h2 className='error-message'>{errorMsg}</h2>}
        </div>
    )
}

export default ErrorMessage;