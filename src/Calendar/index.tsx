import { useAppDispatch, useAppSelector } from '../store/hooks'
import { addNewDayCustomItems, editCalendarToday, editCalendarYesterday } from '../store/itemSlice'
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
  const lastSavedDate = useAppSelector(state => state.item.lastSavedDate)

  useEffect(() => { 
    if (lastSavedDate !== new Date().toLocaleDateString()) {
      dispatch(editCalendarYesterday())
      dispatch(addNewDayCustomItems())
    } else {
      dispatch(editCalendarToday(counter))
    }
  }, [counter, lastSavedDate])

  return (
    <>
      <div className="calendar">
        {calendar.map((item) => <Day sugarCounter={item.sugarCounter} key={item.id} hasValue={item.sugarCounter !== null}/>)}
      </div>
    </>
  )
}

export default Calendar
