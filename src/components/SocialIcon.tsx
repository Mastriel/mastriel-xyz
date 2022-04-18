import React, { FunctionComponent, ReactSVG } from "react"
import { Centered } from "./Centered"



type SocialIconProps = {
    src: FunctionComponent<React.SVGProps<SVGSVGElement>>,
    text: string,
    width?: string,
    height?: string
}

export function SocialIcon(props: SocialIconProps) {
    let height = props.height ?? "40" 
    let width = props.width ?? "40" 
    return (
        <Centered>
            <div className="flex items-center">
                <props.src width={width} height={height}/>
                <div className='pr-4'/>
                <p className='secondary-color'>{props.text}</p>
            </div>
        </Centered>
    )
}