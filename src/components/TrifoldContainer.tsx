import React, { PropsWithChildren, ReactNode } from "react";



export class TrifoldContainer extends React.Component<PropsWithChildren<any>> {

  render() : ReactNode {
    return (
      <div className="flex justify-center">
        <div className="trifold-container">
          {this.props.children}
        </div>
      </div>
    )
  }
}