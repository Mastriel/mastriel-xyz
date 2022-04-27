import React, { PropsWithChildren, ReactElement, ReactNode } from "react";
import { Application } from "./Application";
import { HelloApp } from "./apps/HelloApp";



type AppManagerProps = {
    children?: ReactNode
}

type AppManagerState = {
    openApps: Application[]
}

export class AppManagerComponent extends React.Component<AppManagerProps, AppManagerState> {
    static #instance : AppManagerComponent 
    static get instance() { return AppManagerComponent.#instance }

    private constructor(props: AppManagerProps) {
        super(props)
        this.state = {
            openApps: [new HelloApp()]
        }
        if (AppManagerComponent.#instance === undefined) {
            return AppManagerComponent.#instance
        }
        AppManagerComponent.#instance = this
    
    }

    override componentDidMount() {
        this.spawnApp.bind(this)
        this.killApp.bind(this)
    }


    killApp(app: Application) {

    }

    private globalPID = 0

    spawnApp(app: Application) {
        this.setState((state) => {
            let openApps = [...state.openApps]
            app.setState({
                pid: this.globalPID+1
            })
            this.globalPID++
            openApps.push(app)

            this.setState({
                openApps: openApps
            });
        })
    }

    get applications() : Application[] {
        return this.applications
    }

    override render() : JSX.Element {
        if (this.state.openApps == undefined) return <div></div>
        return (
            <div>
                {this.state.openApps.map((it) => { 
                    let element = React.createElement(typeof it, it.props)

                    return <ul key={it.state.pid}>{element}</ul>
                })}
            </div>
        )
    }



}

export function appManager() {
    return AppManagerComponent.instance
}