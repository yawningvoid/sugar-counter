import './App.scss'
import Item, { ItemObject } from './Item'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { addNewDayCustomItems, addSelectedItem, editCalendarYesterday, removeSelectedItem, setEditGoalModalVisible } from './store/itemSlice'
import { useState } from 'react'
import Calendar from './Calendar'
import EditItemModal from './Item/EditItemModal'
import EditGoalModal from './User/EditGoalModal'
import Dropdown from './components/Dropdown'

function App() {
  const initialItems = useAppSelector(state => state.item.initialItems)
  const selectedItems = useAppSelector(state => state.item.selectedItems)
  const isEditGoalModalVisible = useAppSelector(state => state.item.isEditGoalModalVisible)
  const isEditItemModalVisible = useAppSelector(state => state.item.isEditItemModalVisible)
  const lastSavedDate = useAppSelector(state => state.item.lastSavedDate)

  const dispatch = useAppDispatch()

  const counter = selectedItems.reduce((acc, currentValue)=> acc + currentValue.pieces * currentValue.sugarPerPiece, 0)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [isDropdownVisible, setDropdownVisible] = useState(false)
  const buttons = [
    {label: 'Goal', onClick: () => dispatch(setEditGoalModalVisible())},
    {label: 'Profile', onClick: () => console.log('Profile is coming')},
  ]
  const filteredItems = initialItems.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleSelectItem = (itemId: string) => {
    const itemToSelect: ItemObject | undefined = initialItems.find((item) => item.id === itemId)
    if (itemToSelect) {
      if (lastSavedDate !== new Date().toLocaleDateString()) {
        dispatch(editCalendarYesterday())
        dispatch(addNewDayCustomItems())
      } 
      // also has to run, user wants to have their item picked even if it's the next day
        dispatch(addSelectedItem(itemToSelect))
    }
  }
  
  const handleDeselectItem = (itemId: string) => {
    if (lastSavedDate !== new Date().toLocaleDateString()) {
      dispatch(editCalendarYesterday())
      dispatch(addNewDayCustomItems())
    } else {
      dispatch(removeSelectedItem(itemId))
    }
  }
      
  return (
    <div className="app">
      {isEditGoalModalVisible && <EditGoalModal/>}
      {isEditItemModalVisible && <EditItemModal/>}
      <div className="container">
        <div onMouseLeave={() => setDropdownVisible(false)}>
          <div className="header-container">
            <div className="avatar" onClick={() => setDropdownVisible(!isDropdownVisible)}>
              🙂
              {isDropdownVisible && 
                <Dropdown buttons={buttons}/>
              }
            </div>
          </div>
          <div className="header-container">
            <Calendar counter={counter}/>
            <div className="counter">{counter} g</div>
          </div>
        </div>
        <h1>What sweets did you have today?</h1>
        <input 
          id="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="search"
          tabIndex={isEditGoalModalVisible || isEditItemModalVisible ? -1 : 0}
        />
        { selectedItems.length > 0 &&
        <div className="container-items">
            {selectedItems.map((item)=> 
              <Item 
                selected 
                key={item.id} 
                id={item.id}
                name={item.name} 
                emoji={item.emoji} 
                description={item.description}
                onClick={()=> handleDeselectItem(item.id)} 
              />)
            }
          </div>
        } 
        <p className="intro">
          Choose the sweets you consumed today. Consider editing them based on the nutrition facts of your specific food, usually found on the package.    
        </p>
        <div className="container-items">
          {filteredItems.map((item)=> 
            <Item 
              key={item.id} 
              id={item.id}
              name={item.name} 
              emoji={item.emoji} 
              description={item.description}
              onClick={()=> handleSelectItem(item.id)} 
            />)
          }
        </div>
      </div>
    </div>
  )
}

export default App
