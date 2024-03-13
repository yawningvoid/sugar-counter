import Modal from '../components/Modal/index'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setEditGoalModalVisible, setGoal } from '../store/itemSlice'
import { ChangeEvent, useState } from 'react'

function EditGoalModal() {
  const isEditGoalModalVisible = useAppSelector(state => state.item.isEditGoalModalVisible)
  const initialGoal = useAppSelector(state => state.item.goal)
  const [goal, editGoal] = useState<number>(initialGoal)

  const dispatch = useAppDispatch()

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    editGoal(parseInt(event.target.value, 10))
  }

  const handleEditGoal = () => {
    dispatch(setGoal(goal))
    dispatch(setEditGoalModalVisible())
  }

  const fieldsEditGoal = [
    {
      id: 'goal',
      label: 'Set your daily sugar goal (g)',
      type: 'number',
      value: goal,
    },
  ]
      
  return (
    <Modal 
      fields={fieldsEditGoal} 
      onChange={handleInputChange} 
      onSubmit={handleEditGoal} 
      isModalVisible={isEditGoalModalVisible} 
      setModalVisible={()=>dispatch(setEditGoalModalVisible())}
      okButtonText="Set goal"
      description="The recommended daily sugar intake varies, but generally, it's advised to limit added sugars to around 25g for women and 38g for men."
    />
  )
}

export default EditGoalModal
