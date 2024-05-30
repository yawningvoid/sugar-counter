import { screen } from '@testing-library/react'
import { renderWithProviders } from '../utils/test-utils'
import Calendar, { CalendarEntry } from './index'
import { Measurement } from '../store/itemSlice'

const mockCalendar: CalendarEntry[] = [
  { date: '2022-01-01', sugarCounter: 5, id: '1' },
  { date: '2022-01-02', sugarCounter: 3, id: '2' },
]

export const mockState = {
	item: {
		calendar: mockCalendar,
		isEditGoalModalVisible: false,
		isEditItemModalVisible: false,
		initialItems: [],
		selectedItems: [],
		lastSavedDate: '',
		lastPressedItemId: '',
		measurement: 'g' as Measurement,
		counter: 0,
		goal: 0,
	}
}

describe('Calendar', () => {
  it('renders without crashing', () => {
    renderWithProviders(<Calendar />)
  })

  it('renders correct number of Day components', () => {
    renderWithProviders(<Calendar />, {
      preloadedState: mockState
    })
    expect(screen.getAllByTestId('day-component')).toHaveLength(2)
  })
})

