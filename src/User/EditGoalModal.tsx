import Modal, { RadioChangeEvent } from '../components/Modal/index'
import { useDialogRef } from '../context/useDialogRef'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { Measurement, setGoal, switchMeasurement } from '../store/itemSlice'
import { ChangeEvent, useState } from 'react'

function EditGoalModal() {
  const { editGoalDialogRef } = useDialogRef()
  const initialGoal = useAppSelector((state) => state.item.goal)
  const initialMeasurement = useAppSelector((state) => state.item.measurement)
  const [goal, editGoal] = useState<number>(initialGoal)
  const [measurement, setMeasurement] =
    useState<Measurement>(initialMeasurement)

  const dispatch = useAppDispatch()

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    editGoal(parseInt(event.target.value, 10))
  }

  const handleEditGoal = () => {
    dispatch(switchMeasurement(measurement))
    dispatch(setGoal(goal))
    editGoalDialogRef?.current?.close()
  }

  function handleRadioClick(event: RadioChangeEvent) {
    const inputValue = event.target.value
    if (inputValue === 'tsp' || inputValue === 'g') {
      setMeasurement(inputValue)
    }
  }

  const fieldsEditGoal = [
    {
      id: 'goal',
      label: `Set your daily sugar goal (${measurement})`,
      type: 'number',
      value: goal,
    },
    {
      id: 'measurements',
      label: 'Measurements',
      type: 'radio',
      value: measurement,
      options: [
        { label: 'g', onClick: handleRadioClick, value: 'g' },
        { label: 'tsp', onClick: handleRadioClick, value: 'tsp' },
      ],
    },
  ]

  return (
    <Modal
      fields={fieldsEditGoal}
      onChange={handleInputChange}
      onSubmit={handleEditGoal}
      okButtonText="Set goal"
      description="The recommended daily sugar intake varies, but generally, it's advised to limit added sugars to around 25g (5tsp) for women and 38g (8tsp) for men."
      dialogRef={editGoalDialogRef}
    />
  )
}

export default EditGoalModal
