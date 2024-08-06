import { renderWithProviders } from './utils/test-utils'
import { fireEvent, screen } from '@testing-library/react'
import App from './App'
import {
  editCalendarYesterday,
  addNewDayCustomItems,
  addSelectedItem,
} from './store/itemSlice'
import { mockState } from './Calendar/index.test'

jest.mock('./store/hooks', () => ({
  ...jest.requireActual('./store/hooks'),
  useAppDispatch: () => mockDispatch,
}))

const mockDispatch = jest.fn()

const mockInitialItems = [
  {
    id: '1',
    emoji: '🍬',
    name: 'Candy',
    sugarPerPiece: 5,
    pieces: 10,
    isInitial: true,
    description: 'Sweet candy',
  },
  {
    id: '2',
    emoji: '🍫',
    name: 'Chocolate',
    sugarPerPiece: 10,
    pieces: 5,
    isInitial: false,
    description: 'Delicious chocolate',
  },
]

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly with initial state', () => {
    renderWithProviders(<App />, {
      preloadedState: {
        item: { ...mockState.item, initialItems: mockInitialItems },
      },
    })

    expect(
      screen.getByText('What sweets did you have today?'),
    ).toBeInTheDocument()
    expect(screen.getByPlaceholderText('search')).toBeInTheDocument()
    expect(screen.getAllByTestId('item')).toHaveLength(mockInitialItems.length)
  })

  it('opens and closes the dropdown menu', () => {
    renderWithProviders(<App />, { preloadedState: mockState })

    const avatar = screen.getByText('🙂')
    fireEvent.click(avatar)

    expect(screen.getByText('Goal')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()

    fireEvent.click(avatar)
    expect(screen.queryByText('Goal')).not.toBeInTheDocument()
    expect(screen.queryByText('Profile')).not.toBeInTheDocument()
  })

  it('handles selecting an item', async () => {
    renderWithProviders(<App />, {
      preloadedState: {
        item: { ...mockState.item, initialItems: mockInitialItems },
      },
    })

    const items = await screen.findAllByTestId('item')
    const itemButton = items.find(
      (item) =>
        item && item.textContent && item.textContent.includes('Chocolate'),
    ) // Add null check
    if (itemButton) {
      fireEvent.click(itemButton)
    }
    expect(mockDispatch).toHaveBeenNthCalledWith(1, editCalendarYesterday())
    expect(mockDispatch).toHaveBeenNthCalledWith(2, addNewDayCustomItems())

    const selectedItem = mockInitialItems.find(
      (item) => item.name === 'Chocolate',
    )
    if (selectedItem) {
      expect(mockDispatch).toHaveBeenNthCalledWith(
        3,
        addSelectedItem(selectedItem),
      )
    }
  })
})
