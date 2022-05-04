import { PropsWithChildren, ReactNode } from "react";



type ShakingTextProps = {
  text: string
}
export function ShakingText(props: ShakingTextProps) : JSX.Element {
  let text = props.text
  let items : Array<ReactNode> = []
  for (var i = 0; i < text.length; i++) {
    let char = text.charAt(i)
    let style = {
        animationDelay: `${-i*0.3}s`
    }
    items.push(<span className="shaking" style={style} key={i}>{char}</span>)
  }
  return (
    <span>
      {items}
    </span>
  )
}