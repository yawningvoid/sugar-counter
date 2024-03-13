import { useState } from 'react'
import './index.scss'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setLastPressedItemId, removeItem, setEditItemModalVisible } from '../store/itemSlice'
import Dropdown from '../components/Dropdown'


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
  const isEditItemModalVisible = useAppSelector(state => state.item.isEditItemModalVisible)
  const initialItems = useAppSelector(state => state.item.initialItems)
  const selectedItems = useAppSelector(state => state.item.selectedItems)

  const items =  initialItems.concat(selectedItems)
  const isInitial = (id: string = '') => items.find((item) => id === item.id)?.isInitial

  const threeVerticalDots = "\u22EE"

  const handleEdit = (itemId : string) => {
    setDropdownVisible(false)
    setHovered(false)
    dispatch(setEditItemModalVisible())
    dispatch(setLastPressedItemId(itemId))
  }
  const handleDelete = (itemId : string) => {
    dispatch(removeItem(itemId))
  }

  const buttons = [
    {label: 'Edit', onClick: () => handleEdit(id ?? '')},
    {label: 'Delete', onClick: () => handleDelete(id ?? ''), show: !isInitial(id)},
  ]

  return (
    <>
      <button 
        className={`item ${selected ? '' : 'item--disabled'}`} 
        onClick={onClick} 
        onMouseEnter={() => setHovered(true)} 
        onMouseLeave={() => {setHovered(false); setDropdownVisible(false)}}
        tabIndex={isEditItemModalVisible ? -1 : 0}
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
              {isDropdownVisible && 
                <Dropdown buttons={buttons}/>
              }
            </div>
          }
      </button>
    </>
  )
}

export default Item
