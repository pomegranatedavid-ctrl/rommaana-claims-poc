import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-xl border-t-4 border-t-[#be123c]">
                <CardHeader className="text-center">
                    <img
                        src="https://static.wixstatic.com/media/2dc74f_9ffb3f627ced42538647f70532f450f5~mv2.png/v1/fill/w_590,h_170,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/RommaanaAsset%201.png"
                        alt="Rommaana Logo"
                        className="h-12 w-auto object-contain mx-auto mb-4"
                    />
                    <CardTitle className="text-2xl">Welcome Back</CardTitle>
                    <CardDescription>Login to manage your policies and claims</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="national-id">
                            National ID / Iqama
                        </label>
                        <Input id="national-id" placeholder="10xxxxxxxx" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="phone">
                            Phone Number
                        </label>
                        <Input id="phone" placeholder="05xxxxxxxx" />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Link href="/claims/new" className="w-full">
                        <Button className="w-full h-11 text-base">Login with Absher</Button>
                    </Link>
                    <p className="text-xs text-center text-muted-foreground">
                        By logging in, you agree to our Terms of Use and Privacy Policy.
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
