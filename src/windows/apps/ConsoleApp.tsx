import { Application } from "../Application";




export class ConsoleApp extends Application<{}> {
    public override name: string = "Console"
    public override icon?: string
    public override className?: string = "bg-black"

    override renderApplication() : JSX.Element {
        return (
            <p>Test</p>
        )
    }
    
}