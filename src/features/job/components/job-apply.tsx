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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Upload, FileText, X, CheckCircle2 } from "lucide-react";
import { type User } from "@auth0/auth0-react";
import { cn } from "@/lib/utils";

export type ApplicantDetails = {
    firstName: string;
    lastName: string;
    middleName: string;
    dateOfBirth: string;
    email: string;
    phoneNumber: string;
    currentAddress: string;
    currentJobTitle: string;
    currentCompany: string;
    yearsOfExperience: number;
    expectedSalary: number;
    availability: "immediate" | "15_days" | "1_month" | "more_than_1_month";
    professionalLinks: string;
};

type ApplyDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    jobTitle: string;
    companyName: string;
    onAuth0Login: () => void;
    applicant: User | undefined;
    isAuthenticated: boolean;
    onSubmit: (file: File, details: ApplicantDetails) => Promise<void>;
};

const steps = ["Sign In", "Details", "Resume", "Submit"];

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

const SectionHeader = ({ title, description }: { title: string; description?: string }) => (
    <div className="mb-3">
        <p className="font-semibold">{title}</p>
        {description && (
            <p className="mt-0.5 text-sm">{description}</p>
        )}
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

const defaultDetails = (email: string): ApplicantDetails => ({
    firstName: "",
    lastName: "",
    middleName: "",
    dateOfBirth: "",
    email,
    phoneNumber: "",
    currentAddress: "",
    currentJobTitle: "",
    currentCompany: "",
    yearsOfExperience: 0,
    expectedSalary: 0,
    availability: "immediate",
    professionalLinks: "",
});

const AVAILABILITY_OPTIONS: { value: ApplicantDetails["availability"]; label: string }[] = [
    { value: "immediate", label: "Immediately available" },
    { value: "15_days", label: "Within 15 days" },
    { value: "1_month", label: "Within 1 month" },
    { value: "more_than_1_month", label: "More than 1 month" },
];

const DetailsStep = ({
    details,
    onChange,
    onNext,
}: {
    details: ApplicantDetails;
    onChange: (d: Partial<ApplicantDetails>) => void;
    onNext: () => void;
}) => {
    const field = (
        id: keyof ApplicantDetails,
        label: string,
        props: React.InputHTMLAttributes<HTMLInputElement> & { optional?: boolean }
    ) => {
        const { optional, ...inputProps } = props;
        return (
            <div className="flex flex-col gap-1.5">
                <Label htmlFor={id} className="text-sm font-medium">
                    {label}
                    {optional && (
                        <span className="ml-1 font-normal text-muted-foreground">(optional)</span>
                    )}
                </Label>
                <Input
                    id={id}
                    value={String(details[id] ?? "")}
                    onChange={(e) =>
                        onChange({
                            [id]:
                                id === "yearsOfExperience"
                                    ? Number(e.target.value)
                                    : e.target.value,
                        })
                    }
                    className="text-sm h-9"
                    {...inputProps}
                />
            </div>
        );
    };

    // Validate required fields
    const isValid =
        details.firstName.trim() &&
        details.lastName.trim() &&
        details.dateOfBirth &&
        details.phoneNumber.trim() &&
        details.currentAddress.trim() &&
        details.expectedSalary > 0 &&
        details.availability;

    return (
        <div className="flex flex-col gap-6">
            {/* ── Basic Personal Details ── */}
            <div>
                <SectionHeader
                    title="Personal Details"
                    description="Your legal name and date of birth."
                />
                <div className="grid grid-cols-2 gap-3">
                    {field("firstName", "First Name", { placeholder: "Juan" })}
                    {field("lastName", "Last Name", { placeholder: "dela Cruz" })}
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                    {field("middleName", "Middle Name / Initial", {
                        placeholder: "Santos",
                        optional: true,
                    })}
                    {field("dateOfBirth", "Date of Birth", { type: "date" })}
                </div>
            </div>

            <Separator />

            {/* ── Contact Information ── */}
            <div>
                <SectionHeader
                    title="Contact Information"
                    description="How recruiters can reach you."
                />
                <div className="flex flex-col gap-3">
                    {/* Email — uneditable */}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="email" className="text-sm font-medium">
                            Email Address
                        </Label>
                        <Input
                            id="email"
                            value={details.email}
                            disabled
                            className="text-sm cursor-not-allowed h-9 bg-muted text-muted-foreground"
                        />
                    </div>

                    {field("phoneNumber", "Phone Number", {
                        placeholder: "+63 912 345 6789",
                        type: "tel",
                    })}
                    {field("currentAddress", "Current Address", {
                        placeholder: "Makati City, Metro Manila, Philippines",
                    })}
                </div>
            </div>

            <Separator />

            {/* ── Professional Information ── */}
            <div>
                <SectionHeader
                    title="Professional Information"
                    description="Your current work status."
                />
                <div className="flex flex-col gap-3">
                    {field("currentJobTitle", "Current Job Title", {
                        placeholder: "Software Engineer",
                        optional: true,
                    })}
                    {field("currentCompany", "Current Company", {
                        placeholder: "Acme Corp",
                        optional: true,
                    })}

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="yearsOfExperience" className="text-sm font-medium">
                            Years of Experience
                        </Label>
                        <Input
                            id="yearsOfExperience"
                            type="number"
                            min={0}
                            value={details.yearsOfExperience}
                            onChange={(e) =>
                                onChange({ yearsOfExperience: Math.max(0, Number(e.target.value)) })
                            }
                            className="text-sm h-9"
                        />
                    </div>
                </div>
            </div>

            <Separator />

            {/* ── Job Eligibility ── */}
            <div>
                <SectionHeader
                    title="Job Eligibility"
                    description="Compensation and availability details."
                />
                <div className="flex flex-col gap-3">
                    {/* Expected Salary — number only */}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="expectedSalary" className="text-sm font-medium">
                            Expected Salary
                        </Label>
                        <Input
                            id="expectedSalary"
                            type="number"
                            min={0}
                            placeholder="e.g. 60000"
                            value={details.expectedSalary === 0 ? "" : details.expectedSalary}
                            onChange={(e) =>
                                onChange({
                                    expectedSalary: e.target.value === ""
                                        ? 0
                                        : Math.max(0, Number(e.target.value)),
                                })
                            }
                            onKeyDown={(e) => {
                                // Block non-numeric characters (allow: digits, backspace, delete,
                                // tab, arrows, home/end, and the decimal point)
                                const allowed = [
                                    "Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight",
                                    "ArrowUp", "ArrowDown", "Home", "End",
                                ];
                                if (
                                    !allowed.includes(e.key) &&
                                    !/^\d$/.test(e.key) &&
                                    !(e.key === "." && !String(details.expectedSalary).includes("."))
                                ) {
                                    e.preventDefault();
                                }
                            }}
                            className="text-sm h-9"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="availability" className="text-sm font-medium">
                            Availability
                        </Label>
                        <Select
                            value={details.availability}
                            onValueChange={(v) =>
                                onChange({ availability: v as ApplicantDetails["availability"] })
                            }
                        >
                            <SelectTrigger id="availability" className="text-sm h-9">
                                <SelectValue placeholder="Select availability" />
                            </SelectTrigger>
                            <SelectContent>
                                {AVAILABILITY_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {field("professionalLinks", "LinkedIn / Portfolio Links", {
                        placeholder: "https://linkedin.com/in/yourprofile",
                        optional: true,
                        type: "url",
                    })}
                </div>
            </div>

            <Button disabled={!isValid} onClick={onNext} className="w-full">
                Continue
            </Button>
        </div>
    );
};

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
                <p className="text-sm text-muted-foreground">PDF only · Max 10 MB</p>
            </div>

            {!file ? (
                <div
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    className={cn(
                        "flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 cursor-pointer transition-colors",
                        dragging
                            ? "border-foreground bg-muted/50"
                            : "border-border hover:border-foreground/30 hover:bg-muted/30"
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
                        <p className="text-sm text-muted-foreground">
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
    details,
    jobTitle,
    companyName,
    onSubmit,
    submitting,
}: {
    file: File | null;
    details: ApplicantDetails;
    jobTitle: string;
    companyName: string;
    onSubmit: () => void;
    submitting: boolean;
}) => {
    const availabilityLabel =
        AVAILABILITY_OPTIONS.find((o) => o.value === details.availability)?.label ?? "—";

    const rows: { label: string; value: React.ReactNode }[] = [
        { label: "Position", value: jobTitle },
        { label: "Company", value: companyName },
        {
            label: "Name",
            value: [details.firstName, details.middleName, details.lastName]
                .filter(Boolean)
                .join(" "),
        },
        { label: "Email", value: details.email },
        { label: "Phone", value: details.phoneNumber },
        { label: "Address", value: details.currentAddress },
        {
            label: "Experience",
            value: `${details.yearsOfExperience} yr${details.yearsOfExperience !== 1 ? "s" : ""}`,
        },
        {
            label: "Expected Salary",
            value: details.expectedSalary > 0
                ? `PHP ${details.expectedSalary.toLocaleString()}`
                : "—",
        },
        { label: "Availability", value: availabilityLabel },
        {
            label: "Resume",
            value: (
                <Badge variant="secondary" className="max-w-[180px] truncate font-normal">
                    {file?.name ?? "—"}
                </Badge>
            ),
        },
    ];

    return (
        <div className="flex flex-col gap-5">
            <div className="space-y-1">
                <p className="text-sm font-medium">Review your application</p>
                <p className="text-sm text-muted-foreground">
                    Confirm the details below before submitting.
                </p>
            </div>

            <div className="text-sm border divide-y rounded-lg">
                {rows.map(({ label, value }) => (
                    <div
                        key={label}
                        className="flex items-center justify-between gap-3 px-3 py-2"
                    >
                        <span className="text-muted-foreground shrink-0">{label}</span>
                        <span className="font-medium text-right truncate">{value}</span>
                    </div>
                ))}
            </div>

            <p className="text-sm text-muted-foreground">
                The recruiter will reach out via the email linked to your account.
            </p>

            <Button onClick={onSubmit} disabled={submitting} className="w-full">
                {submitting ? "Submitting…" : "Submit Application"}
            </Button>
        </div>
    );
};

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
                Your application for{" "}
                <span className="font-medium text-foreground">{jobTitle}</span> at{" "}
                <span className="font-medium text-foreground">{companyName}</span> has been
                sent.
            </p>
        </div>
        <p className="text-sm text-muted-foreground">
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
    const [step, setStep] = useState<0 | 1 | 2 | 3 | 4>(isAuthenticated ? 1 : 0);
    const [submitting, setSubmitting] = useState(false);
    const [details, setDetails] = useState<ApplicantDetails>(
        defaultDetails(applicant?.email ?? "")
    );

    const patchDetails = (patch: Partial<ApplicantDetails>) =>
        setDetails((prev) => ({ ...prev, ...patch }));

    const handleAuth0Login = () => {
        onAuth0Login();
        setStep(1);
    };

    const handleSubmit = async () => {
        if (!file) return;
        setSubmitting(true);
        try {
            console.log("Submitting application:", { file, details });
            await onSubmit(file, details);
            setStep(4);
        } catch (error) {
            console.error("Failed to submit application:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleOpenChange = (v: boolean) => {
        if (!v) {
            setFile(null);
            setStep(isAuthenticated ? 1 : 0);
            setDetails(defaultDetails(applicant?.email ?? ""));
        }
        onOpenChange(v);
    };

    const handleChangeAccount = () => {
        onAuth0Login();
    };

    const indicatorStep = step === 4 ? 4 : step;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {step === 4 ? "Application Submitted" : "Apply for this Role"}
                    </DialogTitle>
                    {step !== 4 && (
                        <DialogDescription>
                            {companyName} · {jobTitle}
                        </DialogDescription>
                    )}
                </DialogHeader>

                {step !== 4 && <StepIndicator current={indicatorStep} />}

                {isAuthenticated && step !== 4 && (
                    <div className="flex flex-col items-stretch justify-between gap-2 p-4 mb-1 border rounded-xl bg-muted/40">
                        <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">
                                Currently signed in as
                            </span>
                            <span className="font-medium">{applicant?.email}</span>
                        </div>
                        <div>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={handleChangeAccount}
                            >
                                Choose Different Account
                            </Button>
                        </div>
                    </div>
                )}

                {step === 0 && (
                    <SignInStep
                        jobTitle={jobTitle}
                        companyName={companyName}
                        onAuth0Login={handleAuth0Login}
                    />
                )}
                {step === 1 && (
                    <DetailsStep
                        details={details}
                        onChange={patchDetails}
                        onNext={() => setStep(2)}
                    />
                )}
                {step === 2 && (
                    <AttachResumeStep
                        file={file}
                        onFileChange={setFile}
                        onRemoveFile={() => setFile(null)}
                        onNext={() => setStep(3)}
                    />
                )}
                {step === 3 && (
                    <ConfirmStep
                        file={file}
                        details={details}
                        jobTitle={jobTitle}
                        companyName={companyName}
                        onSubmit={handleSubmit}
                        submitting={submitting}
                    />
                )}
                {step === 4 && (
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