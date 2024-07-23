import { ChangeEvent, MouseEvent, useEffect, useMemo } from 'react'
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

interface ModalProps {
  fields: FormField[]
  onSubmit: () => void
  onChange: (values: ChangeEvent<HTMLInputElement>) => void
  isModalVisible: boolean
  setModalVisible: () => void
  okButtonText: string
  description?: string
}

export interface RadioChangeEvent extends MouseEvent<HTMLInputElement> {
  target: HTMLInputElement
}

const Modal: React.FC<ModalProps> = ({
  fields,
  onSubmit,
  onChange,
  isModalVisible,
  setModalVisible,
  okButtonText,
  description,
}) => {
  const handleKeyPress = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.code === 'Enter') {
      onSubmit
    }
  }

  const handleKeyEsc = useMemo(
    () => (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setModalVisible()
      }
    },
    [setModalVisible],
  )

  useEffect(() => {
    document.addEventListener('keyup', handleKeyEsc)
    return () => {
      document.removeEventListener('keyup', handleKeyEsc)
    }
  }, [handleKeyEsc])

  return (
    <>
      <div
        className={`overlay ${isModalVisible ? '' : 'overlay--disabled'}`}
        onClick={setModalVisible}
      >
        <div
          className="modal"
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
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
              <button onClick={setModalVisible}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Modal
