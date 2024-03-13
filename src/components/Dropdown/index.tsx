import './index.scss'

interface Buttons {
  label: string
  onClick: (args?: any) => void
  show?: boolean
}

interface DropdownProps {
  buttons: Buttons[]
}

const Dropdown: React.FC<DropdownProps> = ( {buttons} ) => {
  return (
    <div className="dropdown">
       {buttons.map((button) => 
          (button.show !== false) && (
            <div key={button.label} className="dropdown-button" onClick={() => button.onClick()}>
              {button.label}
            </div>
          )
      )}
    </div>
  )
}

export default Dropdown
