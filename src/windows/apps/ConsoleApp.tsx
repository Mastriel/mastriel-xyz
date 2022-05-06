import { ReactElement, useState } from "react";
import { Application, AppProps } from "../Application";
import { DesktopIcon } from "../Desktop";
import { DummyApp } from "./DummyApp";



export function ConsoleApp(props: AppProps) : ReactElement {

    return (
        <Application name="Console" className="bg-black" icon="./logo192.png" {...props}>
            <div>
                <div className="flex items-start justify-evenly">
                    <DesktopIcon name="Console" icon="./logo192.png" app={ConsoleApp}/>
                    <DesktopIcon name="Dummy" icon="./logo192.png" app={DummyApp}/>
                </div>
            </div>
        </Application>
    )
}
