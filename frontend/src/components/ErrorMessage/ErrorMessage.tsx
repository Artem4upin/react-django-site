import "./ErrorMessage.scss"

function ErrorMessage({ errorMsg }: { errorMsg: string }) {

    return (
        <div>
            {errorMsg && <h2 className='error-message'>{errorMsg}</h2>}
        </div>
    )
}

export default ErrorMessage;