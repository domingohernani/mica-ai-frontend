import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";


const ApplySignInStep = ({
    jobTitle,
    companyName,
    onAuth0Login,
}: {
    jobTitle: string;
    companyName: string;
    onAuth0Login: () => void;
}) => (
    <div className="flex flex-col gap-5">
        <div className="px-4 py-3 border rounded-lg bg-muted/40">
            <p className="text-sm text-muted-foreground">Applying for</p>
            <p className="text-sm font-semibold mt-0.5">{jobTitle}</p>
            <p className="text-sm text-muted-foreground">{companyName}</p>
        </div>

        <Separator />

        <div className="space-y-3">
            <p className="text-sm text-center text-muted-foreground">
                Please sign in to continue your application. You'll be redirected to the
                login page to continue.
            </p>
            <Button className="w-full" onClick={onAuth0Login}>
                Continue
            </Button>
            <p className="text-sm text-center text-muted-foreground">
                By continuing, you agree to our{" "}
                <span className="underline cursor-pointer">Terms of Service</span> and{" "}
                <span className="underline cursor-pointer">Privacy Policy</span>.
            </p>
        </div>
    </div>
);

export default ApplySignInStep