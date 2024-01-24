import React, { ChangeEvent, useEffect, useState } from 'react'
import './index.scss'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { addNewItem, addSelectedItem, setModalVisible } from '../../store/itemSlice'
import { ItemObject } from '../index'

const Modal: React.FC = () => {
  const isModalVisible = useAppSelector(state => state.item.isModalVisible)
  const lastPressedItemId = useAppSelector((state) => state.item.lastPressedItemId)
  const initialItems = useAppSelector(state => state.item.initialItems)
  const selectedItems = useAppSelector(state => state.item.selectedItems)

  const dispatch = useAppDispatch()

  const shallowItem = {
    id: 0,
    name: '',
    description: '',
    emoji: '',
    sugarPerPiece: 0,
    pieces: 0,
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
  
  const findMaxId = (items: ItemObject[]): number => {
    return items.reduce((maxId, item) => (item.id > maxId ? item.id : maxId), 0);
  }

  const handleAddItem = () => {
    const maxId = Math.max(findMaxId(initialItems), findMaxId(selectedItems))
    const newItem = {
      ...itemToEdit,
      id: maxId + 1,
    }
  
    dispatch(addNewItem(newItem))
    dispatch(addSelectedItem(newItem))
  
    dispatch(setModalVisible())
  }

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
                onChange={(e)=>handleInputChange(e)}
              />
            </label>
            <label>
              How many pieces did you have?
              <input 
                type="number"
                id="pieces"
                value={itemToEdit?.pieces || 0} 
                onChange={(e)=>handleInputChange(e)}
              />
            </label>
            <button onClick={handleAddItem}>Add Item</button>
            <button onClick={() => {dispatch(setModalVisible())}}>Cancel</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Modal
