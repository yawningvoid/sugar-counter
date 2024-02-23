import React, { ChangeEvent, useEffect, useState } from 'react'
import './index.scss'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { createItem, addSelectedItem, setModalVisible } from '../../store/itemSlice'
import { ItemObject } from '../index'

const Modal: React.FC = () => {
  const isModalVisible = useAppSelector(state => state.item.isModalVisible)
  const lastPressedItemId = useAppSelector((state) => state.item.lastPressedItemId)
  const initialItems = useAppSelector(state => state.item.initialItems)
  const selectedItems = useAppSelector(state => state.item.selectedItems)

  const dispatch = useAppDispatch()

  const shallowItem = {
    id: '',
    name: '',
    description: '',
    emoji: '',
    sugarPerPiece: 0,
    pieces: 0,
    isInitial: false,
  }

  const [itemToEdit, setItemToEdit] = useState<ItemObject>(shallowItem)

  useEffect(() => {
    const itemInInitialItems = initialItems.find(item => item.id === lastPressedItemId)
    const itemInSelectedItems = selectedItems.find(item => item.id === lastPressedItemId)
    setItemToEdit(itemInInitialItems ?? itemInSelectedItems ?? shallowItem)
  }, [lastPressedItemId, initialItems, selectedItems])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target
    setItemToEdit((prevItem) => ({
      ...prevItem,
      [id]: id === 'sugarPerPiece' || id === 'pieces' ? parseInt(value, 10) : value,
    }))
  }

  const handleAddItem = () => {
    const newItem = {
      ...itemToEdit,
      isInitial: false,
      id: self.crypto.randomUUID(),
    }
    dispatch(createItem(newItem))
    dispatch(addSelectedItem(newItem))
    dispatch(setModalVisible())
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.code === 'Enter') {
      handleAddItem()
    }
  }

  const handleKeyEsc = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      dispatch(setModalVisible())
    }
  }

  useEffect (()=> {
    document.addEventListener('keyup', handleKeyEsc)
    return () => {
      document.removeEventListener('keyup', handleKeyEsc)
    }
  }, [])

  return (
    <>
      <div 
        className={`overlay ${isModalVisible ? '' : 'overlay--disabled'}`} 
        onClick={()=>dispatch(setModalVisible())}
      >
        <div className="modal" onClick={(e) => {e.stopPropagation()}}>
          <div className="modal-content">
            <label>
              Name
              <input 
                type="text" 
                id="name" 
                value={itemToEdit?.name || ''}
                onChange={handleInputChange}
                tabIndex={0}
              />
            </label>
            <label>
              Description
              <input 
                type="text" 
                id="description" 
                value={itemToEdit?.description || ''}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Amount of sugar per piece
              <input 
                type="number"
                id="sugarPerPiece"
                value={itemToEdit?.sugarPerPiece || 0}
                onChange={handleInputChange}
              />
            </label>
            <label>
              How many pieces did you have?
              <input 
                type="number"
                id="pieces"
                value={itemToEdit?.pieces || 0} 
                onChange={handleInputChange}
              />
            </label>
            <div className="modal-content--button-container">
              <button onClick={handleAddItem} onKeyUp={handleKeyPress}>Add Item</button>
              <button onClick={() => {dispatch(setModalVisible())}}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Modal
