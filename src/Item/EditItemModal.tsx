import  { ItemObject } from '../Item/index'
import Modal from '../components/Modal/index'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { addSelectedItem, createItem, setEditItemModalVisible } from '../store/itemSlice'
import { useEffect, useState, ChangeEvent, useMemo } from 'react'
import { v4 as uuid } from 'uuid'

function EditItemModal() {
  const initialItems = useAppSelector(state => state.item.initialItems)
  const selectedItems = useAppSelector(state => state.item.selectedItems)
  const isEditItemModalVisible = useAppSelector(state => state.item.isEditItemModalVisible)
  const lastPressedItemId = useAppSelector((state) => state.item.lastPressedItemId)

  const dispatch = useAppDispatch()

  const shallowItem = useMemo(() => ({
    id: '',
    name: '',
    description: '',
    emoji: '',
    sugarPerPiece: 0,
    pieces: 0,
    isInitial: false,
  }), [])

  const [itemToEdit, setItemToEdit] = useState<ItemObject>(shallowItem)

  useEffect(() => {
    const itemInInitialItems = initialItems.find(item => item.id === lastPressedItemId)
    const itemInSelectedItems = selectedItems.find(item => item.id === lastPressedItemId)
    setItemToEdit(itemInInitialItems ?? itemInSelectedItems ?? shallowItem)
  }, [lastPressedItemId, initialItems, selectedItems, shallowItem])

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
      id: uuid(),
    }
    dispatch(createItem(newItem))
    dispatch(addSelectedItem(newItem))
    dispatch(setEditItemModalVisible())
  }

  const fieldsEditItem = [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      value: itemToEdit?.name || '',
    },
    {
      id: 'description',
      label: 'Description',
      type: 'text',
      value: itemToEdit?.description || '',
    },
    {
      id: 'sugarPerPiece',
      label: 'Amount of sugar per piece',
      type: 'number',
      value: itemToEdit?.sugarPerPiece || 0,
    },
    {
      id: 'pieces',
      label: 'How many pieces did you have?',
      type: 'number',
      value: itemToEdit?.pieces || 0,
    },
  ]

      
  return (
    <Modal 
      fields={fieldsEditItem} 
      onChange={handleInputChange} 
      onSubmit={handleAddItem} 
      isModalVisible={isEditItemModalVisible} 
      setModalVisible={() => dispatch(setEditItemModalVisible())}
      okButtonText="Add item"
    />
  )
}

export default EditItemModal
