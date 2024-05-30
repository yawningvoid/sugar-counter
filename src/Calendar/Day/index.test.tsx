import { screen } from '@testing-library/react'
import Day from './index'
import { renderWithProviders } from '../../utils/test-utils' // adjust the path as needed

describe('Day', () => {
  it('renders the UI as expected and sets the font size based on sugarCounter', async () => {
    // Assuming the goal in Redux store is 20
    renderWithProviders(<Day sugarCounter={10} hasValue={true} />)
    expect(screen.getAllByText('🍪')[0]).toHaveStyle({ fontSize: '30px' })

    renderWithProviders(<Day sugarCounter={30} hasValue={true} />)
    expect(screen.getAllByText('🍪')[1]).toHaveStyle({ fontSize: '40px' })

    renderWithProviders(<Day sugarCounter={50} hasValue={true} />)
    expect(screen.getAllByText('🍪')[2]).toHaveStyle({ fontSize: '50px' })
  })

  it('adds the day--disabled class when hasValue is false', async () => {
    renderWithProviders(<Day sugarCounter={10} hasValue={false} />)
    const dayElement = await screen.findByText('🍪')
    expect(dayElement).toHaveClass('day--disabled')
  })
})