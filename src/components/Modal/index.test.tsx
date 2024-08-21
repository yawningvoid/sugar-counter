import { render, screen, fireEvent } from '@testing-library/react'
import Modal, { ModalProps } from './index'
import { RefObject } from 'react'
import '@testing-library/jest-dom'

const mockDialogRef: RefObject<HTMLDialogElement> = {
  current: document.createElement('dialog'),
}

describe('Modal Component', () => {
  const defaultProps: ModalProps = {
    fields: [
      {
        id: 'username',
        label: 'Username',
        type: 'text',
        value: '',
      },
      {
        id: 'gender',
        label: 'Gender',
        type: 'radio',
        value: 'male',
        options: [
          { label: 'Male', value: 'male', onClick: jest.fn() },
          { label: 'Female', value: 'female', onClick: jest.fn() },
        ],
      },
    ],
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
    onChange: jest.fn(),
    okButtonText: 'Submit',
    dialogRef: mockDialogRef,
    description: 'Please fill out the form',
  }

  it('should render the modal with form fields', async () => {
    render(<Modal {...defaultProps} />)
    expect(screen.getByText('Username')).toBeInTheDocument()
    expect(screen.getByText('Gender')).toBeInTheDocument()
    expect(screen.getByText('Submit')).toBeInTheDocument()
    expect(screen.getByText('Please fill out the form')).toBeInTheDocument()
  })

  it('should call onSubmit when the submit button is clicked', () => {
    render(<Modal {...defaultProps} />)

    fireEvent.click(screen.getByText('Submit'))

    expect(defaultProps.onSubmit).toHaveBeenCalled()
  })

  it('should call onChange when a text input value is changed', () => {
    render(<Modal {...defaultProps} />)

    const input = screen.getByLabelText('Username')
    fireEvent.change(input, { target: { value: 'new value' } })

    expect(defaultProps.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ target: input }),
    )
  })

  it('should call option.onClick when a radio option is clicked', () => {
    render(<Modal {...defaultProps} />)

    const radioOption = screen.getByLabelText('Female')
    fireEvent.click(radioOption)

    expect(defaultProps.fields[1].options?.[1].onClick).toHaveBeenCalled()
  })

  it('should close the dialog when the cancel button is clicked', () => {
    render(<Modal {...defaultProps} />)

    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)

    expect(defaultProps.onCancel).toHaveBeenCalled()
  })

  it('should call onSubmit when Enter key is pressed on the submit button', () => {
    render(<Modal {...defaultProps} />)

    const submitButton = screen.getByText('Submit')
    fireEvent.keyUp(submitButton, { code: 'Enter' })

    expect(defaultProps.onSubmit).toHaveBeenCalled()
  })
})
