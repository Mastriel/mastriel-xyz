import React, { CSSProperties, PropsWithChildren, ReactElement, RefObject, useEffect, useState } from "react"
import { globalZIndex } from "../App"
import AppManager from "./AppManager"



interface ApplicationState {
    posX: number,
    posY: number,
    posRelativeToCursorX?: number,
    posRelativeToCursorY?: number
    titleBarPressed: boolean,
    zIndex: number
}
type ApplicationProps = PropsWithChildren<any> & {
    name: string,
    width?: number,
    height?: number,
    className: string,
    icon?: string,
    pid?: number
}
export type AppProps = {
    pid: number
}
type Nullable<T> = T | undefined | null
export class Application extends React.Component<ApplicationProps, ApplicationState> {

    public initialHeight : number = 300
    public initialWidth : number = 450

    public readonly titleBarRef : RefObject<HTMLDivElement>
    public readonly appWindowRef : RefObject<HTMLDivElement>

    constructor(props: ApplicationProps) {
        super(props)
        this.titleBarRef = React.createRef()
        this.appWindowRef = React.createRef()
        this.state = this.defaultApplicationState()
        this.onTitleBarPress.bind(this)
        this.onTitleBarUnpress.bind(this)
        this.onTitleBarMove.bind(this)
    }
    

    defaultApplicationState() : ApplicationState { 
        return {
            posX: 80,
            posY: 120,
            posRelativeToCursorX: undefined,
            posRelativeToCursorY: undefined,
            titleBarPressed: false,
            zIndex: 0,
        }
    }

    override componentDidMount() {
        console.log(`[APP] ${this.props.name} launched!`)
        this.titleBarRef.current?.addEventListener('touchstart', (ev) => {this.onTitleBarPress(ev)}, {passive: false});
        this.titleBarRef.current?.addEventListener('touchmove', (ev) => {this.onTitleBarMove(ev)}, {passive: false});
        this.titleBarRef.current?.addEventListener('touchend', (ev) => {this.onTitleBarUnpress(ev)}, {passive: false});
    }
    override componentWillUnmount() {
        console.log(`[APP] ${this.props.name} closed!`)
    }
    
    private renderTitleBar() : JSX.Element {
        return (
            <div className="bg-gray-800 flex rounded-t-lg -translate-y-10 justify-between"
                onMouseDown={(e) => this.onTitleBarPress(e.nativeEvent)}
                onMouseUp={(e) => this.onTitleBarUnpress(e.nativeEvent)}
                onMouseMove={(e) => this.onTitleBarMove(e.nativeEvent)}
                ref={this.titleBarRef}
                >
                <div>
                    <p className="pl-4 pt-2 pb-2">{this.props.name} (PID: {this.props.pid})</p>
                </div>
                <div className="flex justify-center items-center">
                    {/* <WindowButton defaultColor="#fcff4e" hoverColor=""/> */}
                    <WindowButton defaultColor="#ff9b9b" hoverColor="#e04f4f" onPress={() => {this.kill()}}/>
                </div>
            </div>
        )
    }
    private kill() {
        AppManager.killApp(this.props.pid)
    }

    override render() : ReactElement<typeof this> {
        let style : CSSProperties = {
            height: this.initialHeight+"px",
            width: this.initialWidth+"px",
            position: 'absolute',
            left: this.state.posX,
            top: this.state.posY,
            zIndex: this.state.zIndex
        }
        
        return (
            <div className={this.props.className} style={style}
                onMouseDown={(e) => this.increaseZIndex()}
                ref={this.appWindowRef}>
                {this.renderTitleBar()}
                {this.props.children}
            </div>
        )
    }

    private increaseZIndex() {
        globalZIndex.value++
        this.setState({
            zIndex: globalZIndex.value,
        })

    }

    private pageXY(e: MouseEvent | TouchEvent) : [number, number] {
        
        let pageX : number = 0
        let pageY : number = 0
        if (e instanceof MouseEvent) {
            pageX = e.pageX
            pageY = e.pageY
        } else if (e instanceof TouchEvent) {
            const touch = e.touches[0]
            pageX = touch.pageX
            pageY = touch.pageY
        }
        return [pageX, pageY]
    }

    private onTitleBarPress(e: MouseEvent | TouchEvent) {
        if (e instanceof MouseEvent && e.button !== 0) return
        
        let [pageX, pageY] = this.pageXY(e)

        const ref : Nullable<HTMLDivElement> = this.appWindowRef.current
        const body = document.body;
        const box = ref?.getBoundingClientRect();
        if (box == null) throw new Error("No ref found for app window "+this.props.name)
        this.setState({
            posRelativeToCursorX: pageX - (box.left + body.scrollLeft - body.clientLeft),
            posRelativeToCursorY: pageY - (box.top + body.scrollTop - body.clientTop),
            titleBarPressed: true
        });
        if (e instanceof MouseEvent) {
            e.preventDefault()
        }
        

        document.addEventListener('mousemove', (ev) => {this.onTitleBarMove(ev)});
        document.addEventListener('mouseup', (ev) => {this.onTitleBarUnpress(ev)});
        
        document.addEventListener('touchmove', (ev) => {this.onTitleBarMove(ev)}, {passive: false});
        document.addEventListener('touchend', (ev) => {this.onTitleBarUnpress(ev)}, {passive: false});

    }

    private onTitleBarUnpress(e: MouseEvent | TouchEvent) {
        if (e instanceof MouseEvent && e.button !== 0) return
        this.setState({titleBarPressed: false})

        if (e instanceof MouseEvent) {
            e.preventDefault()
        }

        document.removeEventListener('mousemove', (ev) => {this.onTitleBarMove(ev)});
        document.removeEventListener('mouseup', (ev) => {this.onTitleBarUnpress(ev)});

        
        document.removeEventListener('touchmove', (ev) => {this.onTitleBarMove(ev)});
        document.removeEventListener('touchend', (ev) => {this.onTitleBarUnpress(ev)});
    }

    private onTitleBarMove(e: MouseEvent | TouchEvent) {

        if (!this.state.titleBarPressed) return

        let [pageX, pageY] = this.pageXY(e)

        if (this.state.zIndex <= globalZIndex.value) {
            this.increaseZIndex()
        }


        this.setState((state) => ({
            posX: pageX - (state.posRelativeToCursorX ?? 0),
            posY: pageY - (state.posRelativeToCursorY ?? 0)
        }))
        

        e.preventDefault()

    }
    
}

type WindowButtonProps = {
    defaultColor: string,
    hoverColor: string,
    onPress?: () => void
}

export function WindowButton(props: WindowButtonProps) {
    
    let [color, setColor] = useState(props.defaultColor)

    return (
        <svg height={18} width={18} viewBox="0 0 18 18" className="mr-3" xmlns="http://www.w3.org/2000/svg" 
            onClick={() => {props.onPress?.()}} 
            onTouchStart={() => {props.onPress?.()}}
            onMouseOver={() => {setColor(props.hoverColor)}}
            onMouseOut={() => {setColor(props.defaultColor)}}>
            <circle cx="9" cy="9" r="9" fill={color}/>
        </svg>
    )
}


