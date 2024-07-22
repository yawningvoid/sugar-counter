import { fireEvent, screen } from '@testing-library/react'
import { renderWithProviders } from '../utils/test-utils'
import Item, { ItemObject } from './index'
import { setEditItemModalVisible, setLastPressedItemId, removeItem } from '../store/itemSlice'
import { mockState } from '../Calendar/index.test'

const mockInitialItems: ItemObject[] = [
  { id: '1', emoji: '🍬', name: 'Candy', sugarPerPiece: 5, pieces: 10, isInitial: true },
]
const mockSelectedItems: ItemObject[] = [
  { id: '2', emoji: '🍫', name: 'Chocolate', sugarPerPiece: 10, pieces: 5, isInitial: false },
]

const mockOnClick = jest.fn()
const mockDispatch = jest.fn()
jest.mock('../store/hooks', () => ({
  ...jest.requireActual('../store/hooks'),
  useAppDispatch: () => mockDispatch
}))

describe('Item', () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly with given props', () => {
    renderWithProviders(<Item id="1" name="Candy" emoji="🍬" description="Sweet candy" selected onClick={mockOnClick} />, {
      preloadedState: {
        item: {
         ...mockState.item,
          initialItems: mockInitialItems,
          selectedItems: mockSelectedItems,
        },
      },
    })
    expect(screen.getByText('Candy')).toBeInTheDocument()
    expect(screen.getByText('Sweet candy')).toBeInTheDocument()
    expect(screen.getByText('🍬')).toBeInTheDocument()
  })

  it('handles mouse enter and leave events', () => {
    renderWithProviders(<Item id="1" name="Candy" emoji="🍬" description="Sweet candy" selected onClick={mockOnClick} />, {
      preloadedState: {
        item: {
          ...mockState.item,
          initialItems: mockInitialItems,
          selectedItems: mockSelectedItems,
         },
      },
    })
    fireEvent.mouseEnter(screen.getByTestId('item'))
    expect(screen.getByText('⋮')).toBeVisible()

    fireEvent.mouseLeave(screen.getByTestId('item'))
    expect(screen.queryByText('⋮')).toBeNull()
  })

  it('shows dropdown on click', async () => {
    renderWithProviders(<Item id="2" name="Chocolate" emoji="🍫" description="Delicious chocolate" selected onClick={mockOnClick} />, {
      preloadedState: {
        item: {
          ...mockState.item,
          initialItems: mockInitialItems,
          selectedItems: mockSelectedItems,
        },
      },
    })

    fireEvent.mouseEnter(screen.getByTestId('item'))
    const moreOptionsButton = screen.getByText('⋮')
    fireEvent.click(moreOptionsButton)

    const editOption = await screen.findByText('Edit')
    expect(editOption).toBeVisible()

    const deleteOption = await screen.findByText('Delete')
    expect(deleteOption).toBeVisible()
  })

  it('handles edit action', async () => {
    renderWithProviders(<Item id="2" name="Chocolate" emoji="🍫" description="Delicious chocolate" selected onClick={mockOnClick} />, {
      preloadedState: {
        item: {
          ...mockState.item,
           initialItems: mockInitialItems,
           selectedItems: mockSelectedItems,
         },
      },
    })

    fireEvent.mouseEnter(screen.getByTestId('item'))
    const moreOptionsButton = screen.getByText('⋮')
    fireEvent.click(moreOptionsButton)

    const editButton = await screen.findByText('Edit')
    fireEvent.click(editButton)
    expect(mockDispatch).toHaveBeenCalledWith(setEditItemModalVisible())
    expect(mockDispatch).toHaveBeenCalledWith(setLastPressedItemId('2'))
  })

  it('handles delete action', () => {
    renderWithProviders(<Item id="2" name="Chocolate" emoji="🍫" description="Delicious chocolate" selected onClick={mockOnClick} />, {
      preloadedState: {
        item: {
          ...mockState.item,
           initialItems: mockInitialItems,
           selectedItems: mockSelectedItems,
         },
      },
    })

    fireEvent.mouseEnter(screen.getByTestId('item'))
    const moreOptionsButton = screen.getByText('⋮')
    fireEvent.click(moreOptionsButton)

    fireEvent.click(screen.getByText('Delete'))
    expect(mockDispatch).toHaveBeenCalledWith(removeItem('2'))
  })
})
