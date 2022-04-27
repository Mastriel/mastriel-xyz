import { Application, ApplicationState } from "../Application";
import { appManager } from "../AppManager";
import { ConsoleApp } from "./ConsoleApp";



interface HelloAppState extends ApplicationState {
    counter1: number,
    counter2: number
}
export class HelloApp extends Application<{}, HelloAppState> {
    public override name: string = "Welcome"

    public override icon?: string = undefined
    public override className?: string = "bg-slate-900"

    public override initialHeight: number = 500;
    public override initialWidth: number = 800;

    constructor() {
        super({})

        this.state = {
            ...this.defaultApplicationState(),
            counter1: 1,
            counter2: 2
        }
    }

    
    override renderApplication(): JSX.Element {
        return (
            <div className="flex items-center justify-center">
                <h1 className="text-white text-3xl">Hello!</h1>
                <button onClick={this.handleClick}>Spawn Console</button>
            </div>
        )
    }

    private handleClick = () => {
        appManager().spawnApp(new ConsoleApp({}))
    }

}