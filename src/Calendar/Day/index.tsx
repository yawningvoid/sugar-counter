import { useAppSelector } from '../../store/hooks'
import './index.scss'

interface DayProps {
  sugarCounter: number | null
  hasValue: boolean
}

const Day: React.FC<DayProps> = ({sugarCounter, hasValue}) => {
  let fontSize = '30px'
  let backgroundColor = 'var(--vivid)'
  const goal = useAppSelector(state => state.item.goal)
  if (sugarCounter) {
    if (sugarCounter && sugarCounter <= goal) {
      fontSize = '30px'
    } else if (sugarCounter < goal*2) {
      fontSize = '40px'
      backgroundColor = '#ffbe27'
    } else {
      fontSize = '50px'
      backgroundColor = 'var(--vivid-2)'
    }
  }

  const style = {
    fontSize,
  }
  const messageStyle = {
    backgroundColor,
  }

  return (
    <>
      <div className={`day ${hasValue ? ``: `day--disabled`}`} style={style} data-testid="day-component">
        🍪
        { hasValue && <div className="message" style={messageStyle}></div>}
      </div>
    </>
  )
}

export default Day
