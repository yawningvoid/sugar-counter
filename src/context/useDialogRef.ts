import { useContext } from 'react'
import { DialogRefContext } from './Context'

export const useDialogRef = () => {
  const context = useContext(DialogRefContext)

  if (context === null) {
    throw new Error('useDialogRef must be used within a DialogRefProvider')
  }

  return context
}