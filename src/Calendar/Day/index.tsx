import { useAppSelector } from '../../store/hooks'
import './index.scss'

interface DayProps {
  sugarCounter: number | null
  hasValue: boolean
}

const Day: React.FC<DayProps> = ({sugarCounter, hasValue}) => {
  let fontSize = '30px'
  const goal = useAppSelector(state => state.item.goal)
  if (sugarCounter) {
    if (sugarCounter && sugarCounter <= goal) {
      fontSize = '30px'
    } else if (sugarCounter < goal*2) {
      fontSize = '40px'
    } else {
      fontSize = '50px'
    }
  }

  const style = {
    fontSize,
  }

  return (
    <>
     <div className={`day ${hasValue ? ``: `day--disabled`}`} style={style}>
      🍪
     </div>
    </>
  )
}

export default Day
