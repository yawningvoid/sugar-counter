import { ChangeEvent, MouseEvent, RefObject } from 'react'
import './index.scss'

interface FormField {
  id: string
  label: string
  type: string
  value: string | number
  options?: {
    label: string
    value: string | number
    onClick: (event: RadioChangeEvent) => void
  }[]
}

export interface ModalProps {
  fields: FormField[]
  onSubmit: () => void
  onCancel: () => void
  onChange: (values: ChangeEvent<HTMLInputElement>) => void
  okButtonText: string
  description?: string
  dialogRef: RefObject<HTMLDialogElement> | null
}

export interface RadioChangeEvent extends MouseEvent<HTMLInputElement> {
  target: HTMLInputElement
}

const Modal: React.FC<ModalProps> = ({
  fields,
  onSubmit,
  onCancel,
  onChange,
  okButtonText,
  description,
  dialogRef,
}) => {
  const handleKeyPress = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.code === 'Enter') {
      onSubmit
    }
  }

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-content">
        {fields.map((field) => (
          <label key={field.id}>
            {field.label}
            {field.type === 'radio' && field.options ? (
              <div className="radio-container">
                {field.options.map((option, index) => (
                  <div key={index}>
                    <input
                      type={field.type}
                      id={`${field.id}-${index}`}
                      name={field.id}
                      value={option.label}
                      onClick={option.onClick}
                      tabIndex={0}
                      defaultChecked={field.value === option.value}
                    />
                    <label htmlFor={`${field.id}-${index}`}>
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <input
                type={field.type}
                id={field.id}
                value={field.value || ''}
                onChange={onChange}
                tabIndex={0}
              />
            )}
          </label>
        ))}
        {description && (
          <div className="modal-content--description">{description}</div>
        )}
        <div className="modal-content--button-container">
          <button onClick={onSubmit} onKeyUp={handleKeyPress}>
            {okButtonText}
          </button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </dialog>
  )
}

export default Modal
