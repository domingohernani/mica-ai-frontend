import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = ["Sign In", "Details", "Resume", "Submit"];

const ApplyStepIndicator = ({ current }: { current: number }) => (
    <div className="flex items-center gap-0 mb-6">
        {steps.map((label, i) => {
            const done = i < current;
            const active = i === current;
            return (
                <div key={label} className="flex items-center">
                    <div className="flex flex-col items-center gap-1">
                        <div
                            className={cn(
                                "w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium",
                                done && "bg-foreground text-background",
                                active && "border-2 border-foreground text-foreground",
                                !done && !active && "border border-border text-muted-foreground"
                            )}
                        >
                            {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                        </div>
                        <span
                            className={cn(
                                "text-[10px] font-medium",
                                active ? "text-foreground" : "text-muted-foreground"
                            )}
                        >
                            {label}
                        </span>
                    </div>
                    {i < steps.length - 1 && (
                        <div
                            className={cn(
                                "h-px w-10 mb-5 mx-1",
                                done ? "bg-foreground" : "bg-border"
                            )}
                        />
                    )}
                </div>
            );
        })}
    </div>
);
export default ApplyStepIndicator