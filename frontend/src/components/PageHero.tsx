import { FloralCorner, FloralLotus } from './SvgIcons'

export function PageHero({ eyebrow, title, children }: { eyebrow: string; title: React.ReactNode; children?: React.ReactNode }) {
  return <header className="page-hero"><FloralLotus className="motif top-left"/><FloralCorner className="motif top-right"/><div className="container"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{children}</div></header>
}
