import React, { PropsWithChildren, ReactNode } from "react";


type TrifoldSectionProps = PropsWithChildren<any> & {
  hasBorder: boolean
  className: string
}

export class TrifoldSection extends React.Component<TrifoldSectionProps> {
  

  render() : ReactNode {
    let cls = "trifold-section"
    if (!this.props.noBorder) cls += " border-2 rounded-lg border-white" 
    if (this.props.className) cls += " "+this.props.className
    return (
      <div className={cls}>
        {this.props.children}
      </div>
    )
  }
}