import {Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function LoginForm() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your email and password</CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="Email" required />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <a className="hover:underline inline-block ml-auto text-sm" href="#">Forgot password?</a>
                            </div>
                            <Input id="password" type="password" placeholder="Password" required />
                        </div>
                        <Button type="submit" className="w-full">Login</Button>
                    </div>
                </form>
            </CardContent>
            <CardFooter>
                <p className="text-sm">Don't have an account? <a className="underline" href="#">Sign up</a></p>
            </CardFooter>
        </Card>
    )
}