import React from 'react'
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { ApplicantDetails } from '../types/applicant-details.type';
import ApplySectionHeader from './apply-section-header';
import AVAILABILITY_OPTIONS from '../constants/availability-options.constant';

const ApplyDetailsStep = ({
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
            <div>
                <ApplySectionHeader
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
                <ApplySectionHeader
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
                <ApplySectionHeader
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
                <ApplySectionHeader
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

export default ApplyDetailsStep