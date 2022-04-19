import React, { CSSProperties, ReactElement, useRef } from "react"
import ReactDOM, { findDOMNode } from "react-dom"
import { globalZIndex } from "../App"



export interface ApplicationState {
    width: number,
    height: number,
    pos: {
        x: number,
        y: number
    }
    posRelativeToCursor: {
        x?: number,
        y?: number
    },
    titleBarPressed: boolean,
    zIndex: number
}
export abstract class Application extends React.Component<any, ApplicationState> {
    public abstract name : string 
    public abstract icon? : string

    public className? : string 

    public initialHeight : number = 300
    public initialWidth : number = 450

    constructor() {
        super({})
        this.state = {
            width: this.initialWidth,
            height: this.initialHeight,
            pos: {
                x: 80,
                y: 120
            },
            posRelativeToCursor: {
                x: undefined,
                y: undefined,
            },
            titleBarPressed: false,
            zIndex: 0
        }
        this.onMouseDown.bind(this)
        this.onMouseUp.bind(this)
        this.handleMovement.bind(this)
    }

    override componentDidMount() {
        console.log(`[APP] ${this.name} launched!`)
    }
    override componentWillUnmount() {
        console.log(`[APP] ${this.name} closed!`)
    }

    public renderIcon() : ReactElement<DesktopIcon> {
        return <DesktopIcon icon={this.icon} name={this.name}/>
    }
    
    private renderTitleBar() : JSX.Element {
        return (
            <div className="bg-gray-800 flex rounded-t-lg -translate-y-10 justify-between"
                onMouseDown={(e) => this.onMouseDown(e.nativeEvent)}
                onMouseUp={(e) => this.onMouseUp(e.nativeEvent)}
                onMouseMove={(e) => this.handleMovement(e.nativeEvent)}
                onTouchStart={(e) => this.onMouseDown(e.nativeEvent)}
                onTouchEnd={(e) => this.onMouseUp(e.nativeEvent)}
                onTouchMove={(e) => this.handleMovement(e.nativeEvent)}
                >
                <div>
                    <p className="pl-4 pt-2 pb-2">Console</p>
                </div>
                <div className="flex justify-center items-center">
                    <WindowButton color="#fcff4e"/>
                    <WindowButton color="#ff9b9b"/>
                </div>
            </div>
        )
    }

    abstract renderApplication() : JSX.Element

    override render() : ReactElement<Application> {
        let style : CSSProperties = {
            height: this.initialHeight+"px",
            width: this.initialWidth+"px",
            position: 'absolute',
            left: this.state.pos.x,
            top: this.state.pos.y,
            zIndex: this.state.zIndex
        }
        
        return (
            <div className={this.className} style={style}
                onMouseDown={(e) => this.increaseZIndex()}>
                {this.renderTitleBar()}
                {this.renderApplication()}
            </div>
        )
    }

    private increaseZIndex() {
        globalZIndex.value++
        this.setState({
            zIndex: globalZIndex.value
        })

    }

    private pageXY(e: MouseEvent | TouchEvent) : [number, number] {
        
        let pageX : number = 0
        let pageY : number = 0
        if (e instanceof MouseEvent) {
            pageX = e.pageX
            pageY = e.pageY
        } else if (e instanceof TouchEvent) {
            let touch = e.touches[0]
            pageX = touch.pageX
            pageY = touch.pageY
        }
        return [pageX, pageY]
    }

    private onMouseDown(e: MouseEvent | TouchEvent) {
        if (e instanceof MouseEvent && e.button !== 0) return
        
        let [pageX, pageY] = this.pageXY(e)

        const ref : any = ReactDOM.findDOMNode(this);
        const body = document.body;
        const box = ref?.getBoundingClientRect();
        this.setState({
            posRelativeToCursor: {
                x: pageX - (box.left + body.scrollLeft - body.clientLeft),
                y: pageY - (box.top + body.scrollTop - body.clientTop)
            },
            titleBarPressed: true
        });
        try {
            e.stopPropagation()
            e.preventDefault()
        } catch (ignored) {}
        

        document.addEventListener('mousemove', (ev) => {this.handleMovement(ev)});
        document.addEventListener('mouseup', (ev) => {this.onMouseUp(ev)});
        
        document.addEventListener('touchmove', (ev) => {this.handleMovement(ev)});
        document.addEventListener('touchend', (ev) => {this.onMouseUp(ev)});

    }

    private onMouseUp(e: MouseEvent | TouchEvent) {
        if (e instanceof MouseEvent && e.button !== 0) return
        this.setState({titleBarPressed: false})
        try {
            e.stopPropagation()
            e.preventDefault()
        } catch (ignored) {}

        document.removeEventListener('mousemove', (ev) => {this.handleMovement(ev)});
        document.removeEventListener('mouseup', (ev) => {this.onMouseUp(ev)});

        
        document.removeEventListener('touchmove', (ev) => {this.handleMovement(ev)});
        document.removeEventListener('touchend', (ev) => {this.onMouseUp(ev)});
    }

    private handleMovement(e: MouseEvent | TouchEvent) {

        if (!this.state.titleBarPressed) return

        let [pageX, pageY] = this.pageXY(e)


        this.setState((state) => ({
            pos: {
                x: pageX - (state.posRelativeToCursor.x ?? 0),
                y: pageY - (state.posRelativeToCursor.y ?? 0)
            }
        }))
        
        try {
            e.stopPropagation()
            e.preventDefault()
        } catch (ignored) {}
    }
    
}

type WindowButtonProps = {
    color: string
}

export function WindowButton(props: WindowButtonProps) {
    return (
        <svg height={18} width={18} viewBox="0 0 18 18" className="mr-3" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9" cy="9" r="9" fill={props.color}/>
        </svg>
    )
}


type DesktopIconProps = {
    icon?: string,
    name: string
}
export class DesktopIcon extends React.Component<DesktopIconProps> {
    constructor(props: DesktopIconProps) {
        super(props)
    }

    public render() : ReactElement<DesktopIcon> {
        return (
            <div className="flex w-20 h-20 justify-center items-center">
                <img src={this.props.icon} height={48} width={48}/>
                <p>{this.props.name}</p>

            </div>
        )
    }
}

