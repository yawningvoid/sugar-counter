import { useState, useRef, SetStateAction } from 'react'

type Action = 'longpress' | 'click' | undefined

export default function useLongPress() {
  const [action, setAction]: [Action, React.Dispatch<SetStateAction<Action>>] = useState()

  const timerRef = useRef<number | undefined>()
  const isLongPress = useRef<boolean>(false)

  function startPressTimer() {
    isLongPress.current = false
    timerRef.current = setTimeout(() => {
      isLongPress.current = true
      setAction('longpress')
    }, 500)
  }

  function handleOnClick() {
    if (isLongPress.current) {
      return
    }
    setAction('click')
  }

  function handleOnMouseDown() {
    startPressTimer()
  }

  function handleOnMouseUp() {
    if (timerRef.current) clearTimeout(timerRef.current)
  }

  function handleOnTouchStart() {
    startPressTimer()
  }

  function handleOnTouchEnd() {
    if (action === 'longpress') return
    if (timerRef.current) clearTimeout(timerRef.current)
  }

  return {
    action,
    handlers: {
      onClick: handleOnClick,
      onMouseDown: handleOnMouseDown,
      onMouseUp: handleOnMouseUp,
      onTouchStart: handleOnTouchStart,
      onTouchEnd: handleOnTouchEnd
    }
  }
}