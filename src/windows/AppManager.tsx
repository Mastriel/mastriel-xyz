import React, { ReactElement, ReactNode, useEffect, useState } from "react"
import { FunctionComponent } from "react"
import { AppProps } from "./Application"




namespace AppManager {

    export type AppElement = ReactElement<AppProps>
    export type AppFunction = (props: AppProps) => AppElement

    let openApps : Array<AppElement> = []

    let globalPid = 0

    export function spawnApp(App: AppFunction) {
        globalPid++
        let spawnedApp = <App pid={globalPid}/>
    
        openApps.push(spawnedApp)
        console.log(openApps)
        if (updateState == undefined) {
            console.log("no update state?")
        }
        update()
    } 

    export function killApp(appPid: number) {
        openApps = openApps?.filter((it) => { return it?.props?.pid != appPid })
        if (updateState == undefined) {
            console.log("no update state?")
        }
        update()
    }

    function update() {
        number++
        updateState?.(number)
    }

    let updateState : React.Dispatch<React.SetStateAction<number>>
    let number = 0

    type AppManagerProps = {
        apps?: Array<AppFunction>
    }
    export function AppManager(props: AppManagerProps) {

        const [isFirst, setFirst] = useState(true)
        const [_, update] = useState(0)

        useEffect(() => {
            if (isFirst) {
                props.apps?.forEach((it) => {
                    spawnApp(it)
                })
                setFirst(false)
                updateState = update
            }
        }, [setFirst, isFirst, props.apps])

        return (
            <div id="application-layer">
                {openApps?.map((it) => {
                    console.log(it.props.pid)
                    console.log(`Processing app ${it.props.pid}`)
                    return <div key={it.props.pid}>{it}</div>
                })}
            </div>
        )
    }
}

export default AppManager;