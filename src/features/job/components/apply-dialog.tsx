import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { type ApplicantDetails } from "../types/applicant-details.type"
import { type ApplyDialogProps } from "../types/apply-dialog.prop"
import ApplyStepIndicator from "./apply-step-indicator";
import ApplySignInStep from "./apply-signin-step";
import ApplyDetailsStep from "./apply-details-step";
import ApplyConfirmStep from "./apply-confirm-step";
import ApplyAttachResumeStep from "./apply-attach-resume-step";

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
            await onSubmit(file, details);
            setStep(3);
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

    const handleBack = () => {
        if (step > 0) setStep((prev) => (prev - 1) as 0 | 1 | 2 | 3);
    };

    const minStep = isAuthenticated ? 1 : 0;
    const canGoBack = step > minStep && step < 3;

    const indicatorStep = step === 3 ? 3 : step;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        {canGoBack && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="w-8 h-8 -ml-1 shrink-0"
                                onClick={handleBack}
                                aria-label="Go back"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                        )}
                        <div className="flex flex-col">
                            <DialogTitle>
                                {step === 3 ? "Submit Application" : "Apply for this Role"}
                            </DialogTitle>
                            {step !== 3 && (
                                <DialogDescription>
                                    {companyName} · {jobTitle}
                                </DialogDescription>
                            )}
                        </div>
                    </div>
                </DialogHeader>

                {step !== 3 && <ApplyStepIndicator current={indicatorStep} />}

                {isAuthenticated && step !== 3 && (
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
                    <ApplySignInStep
                        jobTitle={jobTitle}
                        companyName={companyName}
                        onAuth0Login={handleAuth0Login}
                    />
                )}
                {step === 1 && (
                    <ApplyDetailsStep
                        details={details}
                        onChange={patchDetails}
                        onNext={() => setStep(2)}
                    />
                )}
                {step === 2 && (
                    <ApplyAttachResumeStep
                        file={file}
                        onFileChange={setFile}
                        onRemoveFile={() => setFile(null)}
                        onNext={() => setStep(3)}
                    />
                )}
                {step === 3 && (
                    <ApplyConfirmStep
                        file={file}
                        details={details}
                        jobTitle={jobTitle}
                        companyName={companyName}
                        onSubmit={handleSubmit}
                        submitting={submitting}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ApplyDialog;