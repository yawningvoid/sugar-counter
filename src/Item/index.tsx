import { useState } from 'react'
import './index.scss'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setModalVisible, setLastPressedItemId, removeItem } from '../store/itemSlice'


export interface ItemObject {
  id: string,
  emoji: string, 
  name: string,
  description?: string,
  sugarPerPiece: number,
  pieces: number,
  isInitial: boolean,
 }

export interface ItemProps extends Partial<ItemObject> {
  selected?: boolean,
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void,
}

const Item: React.FC<ItemProps> = ( {id, name, emoji, description, selected=false, onClick} ) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false)
  const [isHovered, setHovered] = useState(false)
  const dispatch = useAppDispatch()
  const isModalVisible = useAppSelector(state => state.item.isModalVisible)
  const initialItems = useAppSelector(state => state.item.initialItems)
  const selectedItems = useAppSelector(state => state.item.selectedItems)

  const items =  initialItems.concat(selectedItems)
  const isInitial = (id: string) => items.find((item)=> id === item.id)?.isInitial

  const threeVerticalDots = "\u22EE"

  const handleEdit = (itemId : string) => {
    setDropdownVisible(false)
    setHovered(false)
    dispatch(setModalVisible())
    dispatch(setLastPressedItemId(itemId))
  }
  const handleDelete = (itemId : string) => {
    dispatch(removeItem(itemId))
  }

  return (
    <>
      <button 
        className={`item ${selected ? '' : 'item--disabled'}`} 
        onClick={onClick} 
        onMouseEnter={() => setHovered(true)} 
        onMouseLeave={() => {setHovered(false); setDropdownVisible(false)}}
        tabIndex={isModalVisible ? -1 : 0}
      >
        <span className="emoji">{emoji}</span>
          <div className="name">{name}</div>
          <div className="description">{description}</div>
          { isHovered && 
          <div
            className="item--actions"
            onClick={(e) => {
              e.stopPropagation() 
              setDropdownVisible(!isDropdownVisible)
            }}
          >
            {threeVerticalDots}
            {isDropdownVisible && id &&
              <div className="item-dropdown" onMouseLeave={() => setDropdownVisible(false)}>
                <div className="item-dropdown-button" onClick={() => handleEdit(id)}>Edit</div>
                {!isInitial(id) && <div className="item-dropdown-button" onClick={() => handleDelete(id)}>Delete</div>}
              </div>
            }
          </div>}
      </button>
    </>
  )
}

export default Item
