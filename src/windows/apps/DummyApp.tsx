import { ReactElement, useState } from "react"
import { ShakingText } from "../../components/ShakingText"
import { Application, AppProps } from "../Application"
import { DesktopIcon } from "../Desktop"





export function DummyApp(props: AppProps) : ReactElement {
    let [number, setNumber] = useState(0)

    return (
        <Application name="Dumbo" className="bg-slate-100" icon="./logo192.png" width={300} height={100} {...props}>
            <div onMouseDown={() => {setNumber(number+1)}}>
                <div className="flex items-start justify-evenly">
                    <ShakingText text="I'm stupid" className="text-black"/>
                </div>
            </div>
        </Application>
    )
}
