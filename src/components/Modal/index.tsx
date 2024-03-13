import React, {  useEffect } from 'react'
import './index.scss'

interface FormField {
  id: string
  label: string
  type: string
  value: string | number
}

interface ModalProps {
  fields: FormField[]
  onSubmit: (values: any) => void
  onChange: (values: any) => void
  isModalVisible: boolean
  setModalVisible: () => void
  okButtonText: string
  description?: string
}

const Modal: React.FC<ModalProps> = ({ fields, onSubmit, onChange, isModalVisible, setModalVisible, okButtonText, description }) => {
  const handleKeyPress = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.code === 'Enter') {
      onSubmit
    }
  }

  const handleKeyEsc = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setModalVisible()
    }
  }

  useEffect (()=> {
    document.addEventListener('keyup', handleKeyEsc)
    return () => {
      document.removeEventListener('keyup', handleKeyEsc)
    }
  }, [])

  return (
    <>
      <div 
        className={`overlay ${isModalVisible ? '' : 'overlay--disabled'}`} 
        onClick={setModalVisible}
      >
        <div className="modal" onClick={(e) => {e.stopPropagation()}}>
          <div className="modal-content">
            {fields.map(field => (
              <label key={field.id}>
                  {field.label}
                  <input 
                    type={field.type} 
                    id={field.id} 
                    value={field.value || ''}
                    onChange={onChange}
                    tabIndex={0}
                    />
                </label>
              ))}
            { description && <div className="modal-content--description">{description}</div>}
            <div className="modal-content--button-container">
              <button onClick={onSubmit} onKeyUp={handleKeyPress}>{okButtonText}</button>
              <button onClick={setModalVisible}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Modal
