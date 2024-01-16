import React from 'react'
import './index.scss'
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setModalVisible } from '../../store/itemSlice';

const Modal: React.FC = () => {
  const isModalVisible = useAppSelector(state => state.item.isModalVisible)
  const dispatch = useAppDispatch()


  const handleAddItem = () => {
    console.log('Add item button was clicked')
  }

  return (
    <>
      <div 
        className={`overlay ${isModalVisible ? '' : 'overlay--disabled'}`} 
        onClick={()=>dispatch(setModalVisible())}
      >
        <div className="modal">
          <div className="modal-content">
            <label>
              Item Name:
              <input type="text"  />
            </label>
            <label>
              Emoji:
              <input type="text" />
            </label>
            <button onClick={handleAddItem}>Add Item</button>
            <button onClick={(e) => { e.stopPropagation(); dispatch(setModalVisible()); }}>Cancel</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Modal
