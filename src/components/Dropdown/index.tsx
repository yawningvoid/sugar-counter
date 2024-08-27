import './index.scss'

interface Buttons {
  label: string
  onClick: () => void
  show?: boolean
}

interface DropdownProps {
  buttons: Buttons[]
}

const Dropdown: React.FC<DropdownProps> = ({ buttons }) => {
  return (
    <div className="dropdown" role="menu">
      {buttons.map(
        (button) =>
          button.show !== false && (
            <div
              key={button.label}
              className="dropdown-button"
              onClick={() => button.onClick()}
              role="menuitem"
            >
              {button.label}
            </div>
          ),
      )}
    </div>
  )
}

export default Dropdown
