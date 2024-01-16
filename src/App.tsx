import { useState } from 'react'
import './App.scss'
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'
import Item, { ItemObject } from './Item'
import Modal from './Item/Modal/index'


const initialItems = [
  { 
    id: 1,
    emoji: '🍰', 
    name: 'cake',
    sugarPerPiece: 5,
    pieces: 1,
   },
  { 
    id: 2,
    emoji: '🍪', 
    name: 'cookie',
    sugarPerPiece: 5,
    pieces: 1,
   },
  { 
    id: 3,
    emoji: '🍦', 
    name: 'ice-cream',
    sugarPerPiece: 5,
    pieces: 1,
   },
]

function App() {
  const queryClient = new QueryClient()
  const [selectedItems, setSelectedItems] = useState<ItemObject[]>([])
  const [items, setItems] = useState<ItemObject[]>(initialItems)

  const handleSelectItem = (itemId: number) => {
    const itemToSelect: ItemObject | undefined = items.find(
      (item) => item.id === itemId
    )
    if (itemToSelect) {
      setSelectedItems((prevSelectedItems) => [...prevSelectedItems, itemToSelect])
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
    }
  }
  
  const handleDeselectItem = (itemId: number) => {
    setSelectedItems((prevSelectedItems) => prevSelectedItems.filter((item) => item.id !== itemId))
    const itemToRestore: ItemObject | undefined = selectedItems.find(
      (item) => item.id === itemId
    )
    if (itemToRestore) {
      setItems((prevItems) => [...prevItems, itemToRestore])
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
      <Modal />
      
      <div className="container">
        <h1>What sweets did you have today?</h1>
        <input/>
        <div className="container-items">
          {selectedItems.map((item)=> 
            <Item 
              selected 
              key={item.id} 
              name={item.name} 
              emoji={item.emoji} 
              onClick={()=> handleDeselectItem(item.id)} 
            />)
          }
        </div>
        <div className="container-items">
          {items.map((item)=> 
            <Item 
              key={item.id} 
              name={item.name} 
              emoji={item.emoji} 
              onClick={()=> handleSelectItem(item.id)} 
            />)
          }
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more <a>hello from the other sideg</a>
        </p>
      </div>

      </div>
    </QueryClientProvider>
  )
}

export default App
