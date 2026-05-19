import { useRef, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Upload, FileText, X, CheckCircle2 } from "lucide-react";
import { type User, } from "@auth0/auth0-react";
import { cn } from "@/lib/utils";

type ApplyDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    jobTitle: string;
    companyName: string;
    onAuth0Login: () => void;
    applicant: User | undefined,
    isAuthenticated: boolean;
    onSubmit: (file: File) => Promise<void>;
};

const steps = ["Sign In", "Resume", "Submit"];

const StepIndicator = ({ current }: { current: number }) => (
    <div className="flex items-center gap-0 mb-6">
        {steps.map((label, i) => {
            const done = i < current;
            const active = i === current;
            return (
                <div key={label} className="flex items-center">
                    <div className="flex flex-col items-center gap-1">
                        <div
                            className={cn(
                                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium",
                                done && "bg-foreground text-background",
                                active && "border-2 border-foreground text-foreground",
                                !done && !active && "border border-border text-muted-foreground"
                            )}
                        >
                            {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                        </div>
                        <span
                            className={cn(
                                "text-[10px] font-medium tracking-wide",
                                active ? "text-foreground" : "text-muted-foreground"
                            )}
                        >
                            {label}
                        </span>
                    </div>
                    {i < steps.length - 1 && (
                        <div
                            className={cn(
                                "h-px w-12 mb-5 mx-1",
                                done ? "bg-foreground" : "bg-border"
                            )}
                        />
                    )}
                </div>
            );
        })}
    </div>
);

const SignInStep = ({
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
            <p className="text-xs text-muted-foreground">{companyName}</p>
        </div>

        <Separator />

        <div className="space-y-3">
            <p className="text-sm text-center text-muted-foreground">
                Please sign in to continue your application. You'll be redirected to the login page to continue.
            </p>
            <Button className="w-full" onClick={onAuth0Login}>
                Continue
            </Button>
            <p className="text-xs text-center text-muted-foreground">
                By continuing, you agree to our{" "}
                <span className="underline cursor-pointer">Terms of Service</span> and{" "}
                <span className="underline cursor-pointer">Privacy Policy</span>.
            </p>
        </div>
    </div>
);

const AttachResumeStep = ({
    file,
    onFileChange,
    onRemoveFile,
    onNext,
}: {
    file: File | null;
    onFileChange: (f: File) => void;
    onRemoveFile: () => void;
    onNext: () => void;
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files?.[0];
        if (f && f.type === "application/pdf") onFileChange(f);
    };

    return (
        <div className="flex flex-col gap-5">
            <div className="space-y-1">
                <p className="text-sm font-medium">Upload your resume</p>
                <p className="text-xs text-muted-foreground">PDF only · Max 10 MB</p>
            </div>

            {!file ? (
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    className={cn(
                        "flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 cursor-pointer transition-colors",
                        dragging ? "border-foreground bg-muted/50" : "border-border hover:border-foreground/30 hover:bg-muted/30"
                    )}
                >
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <p className="text-sm text-center text-muted-foreground">
                        Drop your file here, or{" "}
                        <span className="font-medium text-foreground">browse</span>
                    </p>
                    <input
                        ref={inputRef}
                        type="file"
                        accept=".pdf,application/pdf"
                        className="hidden"
                        onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) onFileChange(f);
                        }}
                    />
                </div>
            ) : (
                <div className="flex items-center gap-3 rounded-lg border px-3 py-2.5">
                    <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
                        onClick={onRemoveFile}
                    >
                        <X className="w-3.5 h-3.5" />
                    </Button>
                </div>
            )}

            <Button disabled={!file} onClick={onNext} className="w-full">
                Continue
            </Button>
        </div>
    );
};

const ConfirmStep = ({
    file,
    jobTitle,
    companyName,
    onSubmit,
    submitting,
}: {
    file: File | null;
    jobTitle: string;
    companyName: string;
    onSubmit: () => void;
    submitting: boolean;
}) => (
    <div className="flex flex-col gap-5">
        <div className="space-y-1">
            <p className="text-sm font-medium">Review your application</p>
            <p className="text-xs text-muted-foreground">Confirm the details below before submitting.</p>
        </div>

        <div className="text-sm border divide-y rounded-lg">
            <div className="flex items-center justify-between px-3 py-2.5">
                <span className="text-muted-foreground">Position</span>
                <span className="font-medium">{jobTitle}</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2.5">
                <span className="text-muted-foreground">Company</span>
                <span className="font-medium">{companyName}</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2.5">
                <span className="text-muted-foreground">Resume</span>
                <Badge variant="secondary" className="max-w-[180px] truncate font-normal">
                    {file?.name ?? "—"}
                </Badge>
            </div>
        </div>

        <p className="text-xs text-muted-foreground">
            The recruiter will reach out via the email linked to your account.
        </p>

        <Button onClick={onSubmit} disabled={submitting} className="w-full">
            {submitting ? "Submitting…" : "Submit Application"}
        </Button>
    </div>
);

const SuccessScreen = ({
    jobTitle,
    companyName,
    onClose,
}: {
    jobTitle: string;
    companyName: string;
    onClose: () => void;
}) => (
    <div className="flex flex-col items-center gap-5 py-2 text-center">
        <CheckCircle2 className="w-10 h-10 text-foreground" />
        <div className="space-y-1.5">
            <p className="text-sm font-semibold">Application submitted</p>
            <p className="max-w-xs text-sm text-muted-foreground">
                Your application for <span className="font-medium text-foreground">{jobTitle}</span> at{" "}
                <span className="font-medium text-foreground">{companyName}</span> has been sent.
            </p>
        </div>
        <p className="text-xs text-muted-foreground">
            Keep an eye on your inbox — the recruiter will be in touch soon.
        </p>
        <Button variant="outline" className="w-full" onClick={onClose}>
            Close
        </Button>
    </div>
);

export const ApplyDialog = ({
    open,
    onOpenChange,
    jobTitle,
    companyName,
    onAuth0Login,
    applicant,
    isAuthenticated,
    onSubmit,
}: ApplyDialogProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [step, setStep] = useState<0 | 1 | 2 | 3>(isAuthenticated ? 1 : 0);
    const [submitting, setSubmitting] = useState(false);

    const handleAuth0Login = () => {
        onAuth0Login();
        setStep(1);
    };

    const handleSubmit = async () => {
        if (!file) return;
        setSubmitting(true);
        try {
            await onSubmit(file);
            setStep(3);
        } finally {
            setSubmitting(false);
        }
    };

    const handleOpenChange = (v: boolean) => {
        if (!v) {
            setFile(null);
            setStep(isAuthenticated ? 1 : 0);
        }
        onOpenChange(v);
    };

    const handleChangeAccount = async () => {
        onAuth0Login()
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {step === 3 ? "Application Submitted" : "Apply for this Role"}
                    </DialogTitle>
                    {step !== 3 && (
                        <DialogDescription>
                            {companyName} · {jobTitle}
                        </DialogDescription>
                    )}
                </DialogHeader>

                {step !== 3 && <StepIndicator current={step} />}

                {
                    isAuthenticated && <div className="flex flex-col items-stretch justify-between gap-2 p-4 border rounded-xl bg-muted/40">
                        <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">
                                Currently signed in as
                            </span>
                            <span className="font-medium">
                                {applicant?.email}
                            </span>
                        </div>

                        <div>
                            <Button variant="outline" className="w-full" onClick={handleChangeAccount}>
                                Choose Different Account
                            </Button>
                        </div>
                    </div>
                }

                {step === 0 && (
                    <SignInStep
                        jobTitle={jobTitle}
                        companyName={companyName}
                        onAuth0Login={handleAuth0Login}
                    />
                )}
                {step === 1 && (
                    <AttachResumeStep
                        file={file}
                        onFileChange={setFile}
                        onRemoveFile={() => setFile(null)}
                        onNext={() => setStep(2)}
                    />
                )}
                {step === 2 && (
                    <ConfirmStep
                        file={file}
                        jobTitle={jobTitle}
                        companyName={companyName}
                        onSubmit={handleSubmit}
                        submitting={submitting}
                    />
                )}
                {step === 3 && (
                    <SuccessScreen
                        jobTitle={jobTitle}
                        companyName={companyName}
                        onClose={() => handleOpenChange(false)}
                    />
                )}

            </DialogContent>
        </Dialog>
    );
};

export default ApplyDialog;