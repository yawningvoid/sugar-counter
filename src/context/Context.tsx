import { createContext, useRef, ReactNode, FC } from 'react'

interface DialogRefs {
  editGoalDialogRef: React.RefObject<HTMLDialogElement> | null
  editItemDialogRef: React.RefObject<HTMLDialogElement> | null
}

export const DialogRefContext = createContext<DialogRefs | null>(null)

export const DialogRefProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const editGoalDialogRef = useRef<HTMLDialogElement | null>(null)
  const editItemDialogRef = useRef<HTMLDialogElement | null>(null)

  return (
    <DialogRefContext.Provider value={{ editGoalDialogRef, editItemDialogRef }}>
      {children}
    </DialogRefContext.Provider>
  )
}
