import { ReactElement, useState } from "react";
import { Application, AppProps } from "../Application";
import { DesktopIcon } from "../Desktop";



export function ConsoleApp(props: AppProps) : ReactElement {
    let [number, setNumber] = useState(0)

    return (
        <Application name="Console" className="bg-black" {...props}>
            <div onMouseDown={() => {setNumber(number+1)}}>
                <div className="flex items-center justify-center">
                    <DesktopIcon name="Console Bitches Homo Faggot" icon="./logo192.png" app={ConsoleApp}/>
                </div>
            </div>
        </Application>
    )
}
