import { LockIcon } from './SvgIcons'

export function LockButton({ onClick }: { onClick: () => void }) {
  return <button type="button" className="lock-button" onClick={onClick} aria-label="Acceso administrativo"><LockIcon/></button>
}
