import {  useAppSelector } from '../store/hooks'
import Day from './Day'
import './index.scss'

export interface CalendarEntry {
  date: string 
  sugarCounter: number | null
  id: string
}
const Calendar: React.FC = () => {
  const calendar = useAppSelector(state => state.item.calendar)

  return (
    <>
      <div className="calendar">
        {calendar.map((item) => <Day sugarCounter={item.sugarCounter} key={item.id} hasValue={item.sugarCounter !== null}/>)}
      </div>
    </>
  )
}

export default Calendar
