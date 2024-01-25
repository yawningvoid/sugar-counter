import { useState } from 'react'
import './index.scss'
import { useAppDispatch } from '../store/hooks'
import { setModalVisible, setLastPressedItemId } from '../store/itemSlice'


export interface ItemObject {
  id: number,
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
  const threeVerticalDots = "\u22EE"

  const handleEditClick = (itemId : number) => {
    setDropdownVisible(false)
    setHovered(false)
    dispatch(setModalVisible())
    dispatch(setLastPressedItemId(itemId))
  }

  return (
    <>
      <button 
        className={`item ${selected ? '' : 'item--disabled'}`} 
        onClick={onClick} 
        onMouseEnter={() => setHovered(true)} 
        onMouseLeave={() => {setHovered(false); setDropdownVisible(false)}}
      >
        <span className="emoji">{emoji}</span>
          {name}
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
              <div className="item-dropdown">
                <div className="item-dropdown-button" onClick={() => handleEditClick(id)} onMouseLeave={() => setDropdownVisible(false)}>Edit</div>
              </div>
            }
          </div>}
      </button>
    </>
  )
}

export default Item
