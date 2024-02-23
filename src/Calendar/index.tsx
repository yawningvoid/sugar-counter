import { useAppDispatch, useAppSelector } from '../store/hooks'
import { editCalendarToday } from '../store/itemSlice'
import Day from './Day'
import './index.scss'
import { useEffect } from 'react'

export interface CalendarEntry {
  date: string 
  sugarCounter: number | null
  id: string
}

interface CalendarProps {
  counter: number
}

const Calendar: React.FC<CalendarProps> = ({ counter }) => {
  const dispatch = useAppDispatch()
  const calendar = useAppSelector(state => state.item.calendar)

  useEffect(() => { 
    dispatch(editCalendarToday(counter))
  }, [counter])

  return (
    <>
      <div className="calendar">
        {calendar.map((item) => <Day sugarCounter={item.sugarCounter} key={item.id} hasValue={item.sugarCounter !== null}/>)}
      </div>
    </>
  )
}

export default Calendar
