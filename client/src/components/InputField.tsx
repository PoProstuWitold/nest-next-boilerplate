import classNames from 'classnames'

interface InputGroupProps {
    className?: string
    type: string
    placeholder: string
    value: string
    error: string | undefined
    label: string
    setValue: (str: string) => void
}
  
export const InputField: React.FC<InputGroupProps> = ({
    className,
    type,
    placeholder,
    value,
    error,
    setValue,
    label
}) => {
    return (
        <div className={className}>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">{label}</span>
                </label> 
                <input 
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className={classNames(
                        'w-full p-3 transition duration-200 text-black rounded',
                        { 'border-red-500': error }
                    )}
                />
            </div>
            <small className="font-medium text-red-600">{error}</small>
        </div>
    )
}