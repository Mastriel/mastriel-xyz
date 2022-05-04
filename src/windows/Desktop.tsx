import { useState } from "react"
import AppManager from "./AppManager"




type DesktopProps = {}




type DesktopIconProps = {
    icon?: string,
    name: string,
    app?: AppManager.AppFunction
}
export function DesktopIcon(props: DesktopIconProps) {
    let [hovering, setHovering] = useState(false)
    
    let mainClassName = "p-1 border"
    if (hovering) 
        mainClassName += " border-dashed"
    else 
        mainClassName += " border-transparent"

    let textClassName = "w-20"
    if (!hovering) textClassName += " h-9 overflow-hidden"
    
    return (
        <div className={mainClassName}
            onMouseOver={() => {setHovering(true)}}
            onMouseOut={() => {setHovering(false)}}
            onClick={() => {openApp(props.app)}}
            >
            <div className="flex justify-center">
                <img src={props.icon} height="64px" width="64px" alt={`Application ${props.name}`}/>
            </div>
            <div className={textClassName}>
                <p className="break-words text-sm text-center">{props.name}</p>
            </div>
        </div>
    )
}

function openApp(app?: AppManager.AppFunction) {
    if (app === undefined || app === null) return
    AppManager.spawnApp(app)
}
