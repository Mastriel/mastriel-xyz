import { Application } from "../windows/Application";




export class UserConsole extends Application<{}> {
    public override name: string = "Console"
    public override icon?: string
    public override className?: string = "bg-black"

    override renderApplication() {
        return (
            <p>Test</p>
        )
    }
    
}