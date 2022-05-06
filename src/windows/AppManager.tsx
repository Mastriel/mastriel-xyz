import React, { ReactElement, ReactNode, useEffect, useState } from "react"
import { FunctionComponent } from "react"
import { ESMap, Map } from "typescript"
import { AppProps } from "./Application"




namespace AppManager {

    export type AppElement = ReactElement<AppProps>
    export type AppFunction = (props: AppProps) => AppElement
    export type OpenApp = {
        pid: number,
        function: AppFunction,
        props: AppProps
    }

    let openApps : Array<OpenApp> = []

    let globalPid = 0

    export function spawnApp(App: AppFunction) {
        globalPid++
    
        openApps.push({
            pid: globalPid,
            function: App,
            props: {
                pid: globalPid,
                focused: false
            }
        })
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


    export function getByPid(pid: number) : OpenApp | undefined {
        return openApps?.find((it) => { return it?.props?.pid == pid })
    }

    export function focus(pid: number) {
        let app = getByPid(pid)
        if (!app) return
        openApps.forEach((it) => {
            it.props.focused = false
        })
        app.props.focused = true
        update()
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
                    let App = it.function
                    let element = <App {...it.props}></App>
                    console.log(it.props.pid)
                    console.log(`Processing app ${it.props.pid}`)
                    return <div key={it.props.pid}>{element}</div>
                })}
            </div>
        )
    }
}

export default AppManager;