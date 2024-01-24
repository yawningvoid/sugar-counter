import './App.scss'
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'
import Item, { ItemObject } from './Item'
import Modal from './Item/Modal/index'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { addSelectedItem, removeSelectedItem } from './store/itemSlice'

function App() {
  const queryClient = new QueryClient()
  const initialItems = useAppSelector(state => state.item.initialItems)
  const selectedItems = useAppSelector(state => state.item.selectedItems)
  const dispatch = useAppDispatch()

  const handleSelectItem = (itemId: number) => {
    const itemToSelect: ItemObject | undefined = initialItems.find(
      (item) => item.id === itemId
    )
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
        <h1>What sweets did you have today?</h1>
        <input id="search"/>
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
        <div className="container-items">
          {initialItems.map((item)=> 
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
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more <a>hello from the other sideg</a>
        </p>
      </div>

      </div>
    </QueryClientProvider>
  )
}

export default App
