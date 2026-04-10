import "./SuccessMessage.scss"

interface ISuccessMessageProps {
    successMsg: string | null;
    className?: string;
}

function SuccessMessage({
                          successMsg,
                          className = 'success-message',
                      }: ISuccessMessageProps) {

    return (
        <div>
            {successMsg && <h2 className={className}>{successMsg}</h2>}
        </div>
    )
}

export default SuccessMessage;