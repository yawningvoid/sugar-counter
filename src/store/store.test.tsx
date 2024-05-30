import { setupStore, RootState } from './store'
import { Measurement, addNewDayCustomItems, addSelectedItem, createItem, editCalendarToday, editCalendarYesterday, removeItem, removeSelectedItem, setEditGoalModalVisible, setEditItemModalVisible, setGoal, setLastPressedItemId, switchMeasurement } from './itemSlice'
import { ItemObject } from '../Item'
import { v4 as uuid } from 'uuid'

describe('Redux Store Integration Tests', () => {
	let store: ReturnType<typeof setupStore>
	const mockDate = '2024-05-28T00:00:00.000Z'

	beforeAll(() => {
		jest.useFakeTimers(undefined)
		jest.setSystemTime(new Date(mockDate))
	})

	afterAll(() => {
		jest.useRealTimers()
	})

	beforeEach(() => {
		store = setupStore()
	})

  it('should toggle edit goal modal visibility', () => {
		store.dispatch(setEditGoalModalVisible())
		let state: RootState = store.getState()
		expect(state.item.isEditGoalModalVisible).toBe(true)

		store.dispatch(setEditGoalModalVisible())
		state = store.getState()
		expect(state.item.isEditGoalModalVisible).toBe(false)
  })

  it('should toggle edit item modal visibility', () => {
    store.dispatch(setEditItemModalVisible())
    let state: RootState = store.getState()
    expect(state.item.isEditItemModalVisible).toBe(true)

    store.dispatch(setEditItemModalVisible())
    state = store.getState()
    expect(state.item.isEditItemModalVisible).toBe(false)
  })

  it('should add a new item', () => {
    const newItem: ItemObject = {
      id: uuid(),
      name: 'Sugar',
      pieces: 10,
      sugarPerPiece: 2,
      isInitial: true,
			emoji: '🍬',
    }
    store.dispatch(createItem(newItem))
    const state: RootState = store.getState()
    expect(state.item.initialItems).toContainEqual(newItem)
    expect(state.item.lastSavedDate).toBe(new Date(mockDate).toLocaleDateString())
  })

  it('should handle a complex sequence of actions', () => {
    const newItem1: ItemObject = {
      id: uuid(),
      name: 'Item 1',
      pieces: 10,
      sugarPerPiece: 2,
      isInitial: true,
			emoji: '🍬',
    }
    const newItem2: ItemObject = {
      id: uuid(),
      name: 'Item 2',
      pieces: 5,
      sugarPerPiece: 3,
      isInitial: false,
			emoji: '🍭',
    }

    store.dispatch(createItem(newItem1))
    store.dispatch(createItem(newItem2))
    store.dispatch(setEditGoalModalVisible())

    const state: RootState = store.getState()
    expect(state.item.initialItems).toContainEqual(newItem1)
    expect(state.item.initialItems).toContainEqual(newItem2)
    expect(state.item.isEditGoalModalVisible).toBe(true)
  })

	it('should remove an item', () => {
		const itemToRemove: ItemObject = store.getState().item.initialItems[0]
		store.dispatch(removeItem(itemToRemove.id))
		const state: RootState = store.getState()
		expect(state.item.initialItems).not.toContainEqual(itemToRemove)
	})
	
	it('should add a selected item', () => {
		const itemToAdd: ItemObject = store.getState().item.initialItems[0]
		store.dispatch(addSelectedItem(itemToAdd))
		const state: RootState = store.getState()
		expect(state.item.selectedItems).toContainEqual(itemToAdd)
	})

	it('should remove a selected item', () => {
		const itemToAdd: ItemObject = { 
			id: uuid(),
			name: 'Item 1',
			pieces: 10,
			sugarPerPiece: 2,
			isInitial: true,
			emoji: '🍬',
		}
		store.dispatch(addSelectedItem(itemToAdd))
	
		const itemToRemove: ItemObject = store.getState().item.selectedItems[0]
		expect(itemToRemove).toBeDefined()
	
		store.dispatch(removeSelectedItem(itemToRemove.id))
		const state: RootState = store.getState()
		expect(state.item.selectedItems).not.toContainEqual(itemToRemove)
	})
	
	it('should add new day custom items', () => {
		store.dispatch(addNewDayCustomItems())
		const state: RootState = store.getState()
		expect(state.item.selectedItems).toHaveLength(0)
	})
	
	it('should set last pressed item id', () => {
		const itemId: string = uuid()
		store.dispatch(setLastPressedItemId(itemId))
		const state: RootState = store.getState()
		expect(state.item.lastPressedItemId).toBe(itemId)
	})
	
	it('should edit calendar yesterday', () => {
		store.dispatch(editCalendarYesterday())
		const state: RootState = store.getState()
		expect(state.item.calendar).toHaveLength(7)
	})
	
	it('should edit calendar today', () => {
		const sugarCounter: number = 10
		store.dispatch(editCalendarToday(sugarCounter))
		const state: RootState = store.getState()
		expect(state.item.calendar[state.item.calendar.length - 1].sugarCounter).toBe(sugarCounter)
	})
	
	it('should set goal', () => {
		const goal: number = 30
		store.dispatch(setGoal(goal))
		const state: RootState = store.getState()
		expect(state.item.goal).toBe(goal)
	})
	
	it('should switch measurement', () => {
		const measurement: Measurement = 'tsp'
		store.dispatch(switchMeasurement(measurement))
		const state: RootState = store.getState()
		expect(state.item.measurement).toBe(measurement)
	})
})
