import './App.scss'
import Item from './Item'
import { useAppDispatch, useAppSelector } from './store/hooks'
import {
  addNewDayCustomItems,
  addSelectedItem,
  editCalendarYesterday,
  removeSelectedItem,
} from './store/itemSlice'
import { useState } from 'react'
import Calendar from './Calendar'
import EditItemModal from './Item/EditItemModal'
import EditGoalModal from './User/EditGoalModal'
import Dropdown from './components/Dropdown'
import { useDialogRef } from './context/useDialogRef'

function App() {
  const initialItems = useAppSelector((state) => state.item.initialItems)
  const selectedItems = useAppSelector((state) => state.item.selectedItems)
  const { editGoalDialogRef } = useDialogRef()
  const lastSavedDate = useAppSelector((state) => state.item.lastSavedDate)
  const measurement = useAppSelector((state) => state.item.measurement)
  const counter = useAppSelector((state) => state.item.counter)

  const dispatch = useAppDispatch()

  const [searchQuery, setSearchQuery] = useState('')
  const [isDropdownVisible, setDropdownVisible] = useState(false)
  const buttons = [
    { label: 'Goal', onClick: () => editGoalDialogRef?.current?.showModal() },
    { label: 'Profile', onClick: () => console.log('Profile is coming') },
  ]
  const filteredItems = initialItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const updateCalendarIfNeeded = () => {
    if (lastSavedDate !== new Date().toLocaleDateString()) {
      dispatch(editCalendarYesterday())
      dispatch(addNewDayCustomItems())
    }
  }

  const handleSelectItem = (itemId: string) => {
    const itemToSelect = initialItems.find((item) => item.id === itemId)
    if (itemToSelect) {
      updateCalendarIfNeeded()
      dispatch(addSelectedItem(itemToSelect))
    }
  }

  const handleDeselectItem = (itemId: string) => {
    updateCalendarIfNeeded()
    dispatch(removeSelectedItem(itemId))
  }

  return (
    <div className="app">
      <EditGoalModal />
      <EditItemModal />
      <div className="container">
        <div onMouseLeave={() => setDropdownVisible(false)}>
          <div className="avatar-container">
            <div
              className="avatar"
              onClick={() => setDropdownVisible(!isDropdownVisible)}
            >
              🙂
              {isDropdownVisible && <Dropdown buttons={buttons} />}
            </div>
          </div>
          <div className="calendar-counter-container">
            <Calendar />
            <div className="counter">
              {counter} {measurement}
            </div>
          </div>
        </div>
        <h1>What sweets did you have today?</h1>
        <input
          id="search"
          aria-label="Search sweets"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="search"
        />
        {selectedItems.length > 0 && (
          <div className="container-items">
            {selectedItems.map((item) => (
              <Item
                selected
                key={item.id}
                id={item.id}
                name={item.name}
                emoji={item.emoji}
                description={item.description}
                onClick={() => handleDeselectItem(item.id)}
              />
            ))}
          </div>
        )}
        <p className="intro">
          Choose the sweets you consumed today. Consider editing them based on
          the nutrition facts of your specific food, usually found on the
          package.
        </p>
        <div className="container-items">
          {filteredItems.map((item) => (
            <Item
              key={item.id}
              id={item.id}
              name={item.name}
              emoji={item.emoji}
              description={item.description}
              onClick={() => handleSelectItem(item.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
