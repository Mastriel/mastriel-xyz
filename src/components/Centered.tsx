import { PropsWithChildren } from "react";



type CenteredProps = PropsWithChildren<any> & {
  
}
export function Centered(props: CenteredProps) {
    return (
        <div className="flex justify-center">
            {props.children}
        </div>
    )
}