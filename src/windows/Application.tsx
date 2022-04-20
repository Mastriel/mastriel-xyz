import React, { CSSProperties, ReactElement, RefObject } from "react"
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
type Nullable<T> = T | undefined | null
export abstract class Application <Props> extends React.Component<Props, ApplicationState> {
    public abstract name : string 
    public abstract icon? : string

    public className? : string 

    public initialHeight : number = 300
    public initialWidth : number = 450

    public readonly titleBarRef : RefObject<HTMLDivElement>
    public readonly appWindowRef : RefObject<HTMLDivElement>

    constructor(props: Props) {
        super(props)
        this.titleBarRef = React.createRef()
        this.appWindowRef = React.createRef()
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
        this.onTitleBarPress.bind(this)
        this.onTitleBarUnpress.bind(this)
        this.onTitleBarMove.bind(this)
    }

    override componentDidMount() {
        console.log(`[APP] ${this.name} launched!`)
        this.titleBarRef.current?.addEventListener('touchstart', (ev) => {this.onTitleBarPress(ev)}, {passive: false});
        this.titleBarRef.current?.addEventListener('touchmove', (ev) => {this.onTitleBarMove(ev)}, {passive: false});
        this.titleBarRef.current?.addEventListener('touchend', (ev) => {this.onTitleBarUnpress(ev)}, {passive: false});
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
                onMouseDown={(e) => this.onTitleBarPress(e.nativeEvent)}
                onMouseUp={(e) => this.onTitleBarUnpress(e.nativeEvent)}
                onMouseMove={(e) => this.onTitleBarMove(e.nativeEvent)}
                ref={this.titleBarRef}
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

    override render() : ReactElement<typeof this> {
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
                onMouseDown={(e) => this.increaseZIndex()}
                ref={this.appWindowRef}>
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
        if (box == null) throw new Error("No ref found for app window "+this.name)
        this.setState({
            posRelativeToCursor: {
                x: pageX - (box.left + body.scrollLeft - body.clientLeft),
                y: pageY - (box.top + body.scrollTop - body.clientTop)
            },
            titleBarPressed: true
        });
        if (e instanceof MouseEvent) {
            e.stopPropagation()
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
            e.stopPropagation()
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
            pos: {
                x: pageX - (state.posRelativeToCursor.x ?? 0),
                y: pageY - (state.posRelativeToCursor.y ?? 0)
            }
        }))
        
        if (e instanceof MouseEvent) {
            e.stopPropagation()
        }
        e.preventDefault()

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

