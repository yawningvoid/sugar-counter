import { useCallback, useEffect, useState } from 'react'
import './index.scss'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setLastPressedItemId, removeItem } from '../store/itemSlice'
import Dropdown from '../components/Dropdown'
import useLongPress from '../utils/useLongPress'
import { useDialogRef } from '../context/useDialogRef'

export interface ItemObject {
  id: string
  emoji: string
  name: string
  description?: string
  sugarPerPiece: number
  pieces: number
  isInitial: boolean
}

export interface ItemProps extends Partial<ItemObject> {
  selected?: boolean
  onClick: (id: string) => void
}

const Item: React.FC<ItemProps> = ({
  id,
  name,
  emoji,
  description,
  selected = false,
  onClick,
}) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false)
  const [isHovered, setHovered] = useState(false)
  const dispatch = useAppDispatch()
  const { editItemDialogRef } = useDialogRef()
  const initialItems = useAppSelector((state) => state.item.initialItems)
  const selectedItems = useAppSelector((state) => state.item.selectedItems)

  const items = initialItems.concat(selectedItems)
  const isInitial = (id: string = '') =>
    items.find((item) => id === item.id)?.isInitial

  const threeVerticalDots = '\u22EE'
  const { action, handlers } = useLongPress()
  const handleClick = useCallback(() => {
    if (id) {
      onClick(id)
    }
  }, [id, onClick])

  useEffect(() => {
    if (action === 'click') {
      handleClick()
    } else if (action === 'longpress') {
      setDropdownVisible(true)
    }
  }, [action, handleClick])

  const handleEdit = (itemId: string) => {
    setDropdownVisible(false)
    editItemDialogRef?.current?.showModal()
    dispatch(setLastPressedItemId(itemId))
  }
  const handleDelete = (itemId: string) => {
    dispatch(removeItem(itemId))
  }

  const buttons = [
    { label: 'Edit', onClick: () => handleEdit(id ?? '') },
    {
      label: 'Delete',
      onClick: () => handleDelete(id ?? ''),
      show: !isInitial(id),
    },
  ]

  return (
    <>
      <button
        className={`item ${selected ? '' : 'item--disabled'}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setDropdownVisible(false)
          setHovered(false)
        }}
        {...handlers}
        data-testid="item"
      >
        <span className="emoji">{emoji}</span>
        <div className="name">{name}</div>
        <div className="description">{description}</div>
        {isHovered && (
          <div
            className="item--actions"
            onClick={(e) => {
              e.stopPropagation()
              setDropdownVisible((isDropdownVisible) => !isDropdownVisible)
            }}
          >
            {threeVerticalDots}
            {isDropdownVisible && <Dropdown buttons={buttons} />}
          </div>
        )}
      </button>
    </>
  )
}

export default Item
