import "./ErrorMessage.scss"

interface IErrorMessageProps {
    errorMsg: string | null;
    className?: string;
}

function ErrorMessage({
    errorMsg,
    className = 'error-message',
}: IErrorMessageProps) {

    return (
        <div>
            {errorMsg && <h2 className={className}>{errorMsg}</h2>}
        </div>
    )
}

export default ErrorMessage;