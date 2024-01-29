import './App.scss'
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'
import Item, { ItemObject } from './Item'
import Modal from './Item/Modal/index'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { addSelectedItem, removeSelectedItem } from './store/itemSlice'
import { useState } from 'react'
import { useClearLocalStorageEffect } from './utils/localStorage'

function App() {
  const queryClient = new QueryClient()
  const initialItems = useAppSelector(state => state.item.initialItems)
  const selectedItems = useAppSelector(state => state.item.selectedItems)
  const dispatch = useAppDispatch()
  useClearLocalStorageEffect()
  
  const counter = selectedItems.reduce((acc, currentValue)=> acc + currentValue.pieces * currentValue.sugarPerPiece, 0)
  
  const [searchQuery, setSearchQuery] = useState('')
  
  const filteredItems = initialItems.filter((item) =>
  item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

      const handleSelectItem = (itemId: number) => {
        const itemToSelect: ItemObject | undefined = initialItems.find((item) => item.id === itemId)
        if (itemToSelect) {
          dispatch(addSelectedItem(itemToSelect))
        }
      }
      
      const handleDeselectItem = (itemId: number) => {
        dispatch(removeSelectedItem(itemId))
      }
      
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
      <Modal />
      
      <div className="container">
        <div className="counter">{counter} g</div>
        <h1>What sweets did you have today?</h1>
        <input 
          id="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="search"
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
    </QueryClientProvider>
  )
}

export default App
