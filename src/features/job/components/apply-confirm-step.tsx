import React from 'react'
import type { ApplicantDetails } from '../types/applicant-details.type';
import AVAILABILITY_OPTIONS from '../constants/availability-options.constant';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const ApplyConfirmStep = ({
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


export default ApplyConfirmStep