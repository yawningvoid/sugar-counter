import React from 'react'
import './index.scss'
import { useAppDispatch } from '../store/hooks'
import { setModalVisible } from '../store/itemSlice'

export interface ItemObject {
  id: number,
  emoji: string, 
  name: string,
  sugarPerPiece: number,
  pieces: number,
 }

export interface ItemProps extends Partial<ItemObject> {
  selected?: boolean,
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void,
}

const Item: React.FC<ItemProps> = ( {name, emoji, selected=false, onClick} ) => {
  const [isDropdownVisible, setDropdownVisible] = React.useState(false)
  const [isHovered, setHovered] = React.useState(false)
  const dispatch = useAppDispatch()
  const threeVerticalDots = "\u22EE"

  const handleEditClick = () => {
    setDropdownVisible(false)
    dispatch(setModalVisible())
  };

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
              <div className="item-dropdown">
                <div className="item-dropdown-button" onClick={handleEditClick} onMouseLeave={() => setDropdownVisible(false)}>Edit</div>
              </div>
            }
          </div>}
      </button>
    </>
  )
}

export default Item
