import { UserApplication } from "../windows/Application";




export class UserConsole extends UserApplication {
    public override name: string = "Console"
    public override icon?: string
    public override className?: string = "bg-black"

    override renderApplication() {
        return (
            <p>Test</p>
        )
    }
    
}