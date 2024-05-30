import { render, fireEvent } from '@testing-library/react'
import Dropdown from './index'

describe('Dropdown', () => {
  it('renders the correct number of buttons', () => {
    const buttons = [
      { label: 'Button 1', onClick: jest.fn() },
      { label: 'Button 2', onClick: jest.fn() },
      { label: 'Button 3', onClick: jest.fn(), show: false }
    ]

    const { container } = render(<Dropdown buttons={buttons} />)
    const renderedButtons = container.querySelectorAll('.dropdown-button')

    expect(renderedButtons.length).toBe(2)
  })

  it('calls the correct onClick handler when a button is clicked', () => {
    const buttons = [
      { label: 'Button 1', onClick: jest.fn() },
      { label: 'Button 2', onClick: jest.fn() }
    ]

    const { getByText } = render(<Dropdown buttons={buttons} />)
    const button1 = getByText('Button 1')
    fireEvent.click(button1)

    expect(buttons[0].onClick).toHaveBeenCalled()
  })
})