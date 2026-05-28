import { api } from "@/utils/axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { DateTime } from "luxon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    CalendarIcon,
    ClockIcon,
    MailIcon,
    PhoneIcon,
    MapPinIcon,
    BriefcaseIcon,
    PhilippinePeso,
    CheckCircle2Icon,
    UserIcon,
    SendIcon,
    LinkIcon,
    FileTextIcon,
    CalendarCheckIcon,
    BuildingIcon,
    InfoIcon,
    XCircleIcon,
    AlignLeftIcon,
    AlertTriangleIcon,
    ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import PageHeader from "@/components/layout/page-header";
import Gemini from "@/assets/logos/gemini";
import AVAILABILITY_OPTIONS from "@/features/job/constants/availability-options.constant";
import { getScoreStyle } from "@/utils/scoreStyle";
import SIDEBAR_ITEMS from "@/layout/constants/sidebar-items.constant";
import { type Application, type ApplicantEvaluation } from "../../interfaces/application.interface";

const TIME_SLOTS = [
    "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM",
    "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
];

const INTERVIEW_DURATIONS = [
    { value: "30", label: "30 min" },
    { value: "45", label: "45 min" },
    { value: "60", label: "1 hr" },
    { value: "90", label: "1.5 hr" },
];

const InfoRow = ({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: React.ReactNode;
}) => {
    return (
        <div className="flex items-center gap-3 mb-2">
            <Icon className="size-3.5 text-muted-foreground shrink-0" />
            <p className="text-sm text-muted-foreground shrink-0">{label}:</p>
            <p className="text-sm font-medium truncate text-foreground">{value}</p>
        </div>
    );
}

const ScoreRing = ({ score }: { score: number }) => {
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const { strokeColor, label, labelCls } = getScoreStyle(score);

    return (
        <div className="flex flex-col items-center gap-3 py-2">
            <div className="relative w-24 h-24">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-muted/20"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-semibold leading-none">{score}</span>
                    <span className="text-xs text-muted-foreground mt-0.5">/ 100</span>
                </div>
            </div>
            <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full", labelCls)}>
                {label}
            </span>
        </div>
    );
};

const GeminiEvaluationSection = ({ evaluation }: { evaluation: ApplicantEvaluation }) => {
    const {
        alignmentRationale,
        compatibilityScore,
        matchedRequirements,
        missingCoreRequirements,
    } = evaluation;
    return (
        <div className="col-span-12 space-y-3">
            <div className="flex items-center gap-2">
                <Gemini size={15} />
                <h3 className="text-sm font-semibold text-foreground">Gemini Evaluation</h3>
            </div>
            <div className="grid grid-cols-12 gap-3">
                <Card className="col-span-12 md:col-span-3">
                    <CardHeader>
                        <CardTitle>Compatibility Score</CardTitle>
                        <CardDescription>Overall job fit rating</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <ScoreRing score={compatibilityScore} />
                    </CardContent>
                </Card>

                <Card className="col-span-12 md:col-span-9">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-1.5">
                            <AlignLeftIcon className="size-3.5" />
                            Alignment Rationale
                        </CardTitle>
                        <CardDescription>AI-generated assessment of candidate fit</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            {alignmentRationale}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-12 gap-3">
                <Card className="col-span-12 md:col-span-7">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-1.5">
                            <CheckCircle2Icon className="size-3.5" />
                            Matched Requirements
                        </CardTitle>
                        <CardDescription>
                            Requirements the candidate satisfies
                            <Badge className="ml-2">
                                {matchedRequirements.length}
                            </Badge>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                            {matchedRequirements.map((req, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                    <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                    {req}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card className="col-span-12 md:col-span-5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-1.5">
                            <XCircleIcon className="size-3.5" />
                            Missing Requirements
                        </CardTitle>
                        <CardDescription>
                            Core requirements not met
                            <Badge
                                className="ml-2 font-medium normal-case"
                            >
                                {missingCoreRequirements.length}
                            </Badge>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {missingCoreRequirements.length === 0 ? (
                            <div className="flex items-center gap-2 text-sm rounded-md border px-3 py-2.5 text-muted-foreground">
                                <CheckCircle2Icon className="size-4 shrink-0" />
                                All core requirements matched.
                            </div>
                        ) : (
                            <>
                                <ul className="space-y-2">
                                    {missingCoreRequirements.map((req, i) => (
                                        <li
                                            key={i}
                                            className="flex items-center gap-2.5 text-sm font-medium text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2"
                                        >
                                            <AlertTriangleIcon className="size-3.5 shrink-0" />
                                            {req}
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

const HiringScheduleInterviewPage = () => {
    const { jobId, applicationId } = useParams();
    const navigate = useNavigate();

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [selectedDuration, setSelectedDuration] = useState<string>("60");

    const fetchApplicant = async (): Promise<Application | null> => {
        if (!applicationId) return null;
        const { data } = await api.get(`/jobs/${jobId}/applications/${applicationId}`);
        return data;
    };

    const { data: applicant, isLoading, error } = useQuery({
        queryKey: ["applicant", jobId, applicationId],
        queryFn: fetchApplicant,
    });

    const scheduleMutation = useMutation({
        mutationFn: async () => {
            const { data } = await api.post(
                `/jobs/${jobId}/applications/${applicationId}/schedule-interview`,
                {
                    scheduledDate: selectedDate,
                    scheduledTime: selectedTime,
                    durationMinutes: Number(selectedDuration),
                },
            );
            return data;
        },
    });

    const canSchedule = selectedDate && selectedTime && selectedDuration;

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <div className="w-8 h-8 border-2 rounded-full animate-spin border-primary border-t-transparent" />
                    <p className="text-sm">Loading applicant details…</p>
                </div>
            </div>
        );
    }

    if (error || !applicant) {
        return (
            <Alert variant="destructive" className="max-w-md">
                <AlertDescription>
                    Failed to load applicant details. Please try again.
                </AlertDescription>
            </Alert>
        );
    }

    const fullName = [applicant.firstName, applicant.middleName, applicant.lastName]
        .filter(Boolean)
        .join(" ");

    const age = Math.floor(
        Math.abs(
            (
                typeof applicant.dateOfBirth === "string"
                    ? DateTime.fromISO(applicant.dateOfBirth)
                    : DateTime.fromJSDate(applicant.dateOfBirth)
            ).diffNow("years").years
        )
    );

    const appliedAt =
        applicant.appliedAt
            ? typeof applicant.appliedAt === "string"
                ? DateTime.fromISO(applicant.appliedAt)
                : DateTime.fromJSDate(applicant.appliedAt)
            : null;

    // Navigate to parent page
    const handleBackBtn = () => {
        const talentAcquisitionSection = SIDEBAR_ITEMS.find((sidebar) => sidebar.label === 'Talent Acquisition')
        const candidatesPage = talentAcquisitionSection?.items.find((page) => page.title === 'Candidates')
        if (!candidatesPage) return;
        navigate(candidatesPage.href);
    }

    return (
        <div className="space-y-4">
            {/* Page Header */}
            <section>
                <PageHeader
                    title="Schedule Interview"
                    subtitle="Set the interview date and time for the selected applicant."
                />
            </section>
            {/* Candidate identity header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-bold tracking-tight">{fullName}</h1>
                            <Badge variant="secondary">{applicant.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {applicant.currentJobTitle} • Applied{" "}
                            {appliedAt ? appliedAt.toFormat("MMMM d, yyyy") : "—"}
                        </p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBackBtn}
                    className="shrink-0"
                >
                    <ArrowLeft className="w-4 h-4" />
                </Button>

            </div>

            <div className="grid grid-cols-12 gap-4">
                {/* Contact */}
                <Card className="col-span-12 md:col-span-4">
                    <CardHeader>
                        <CardTitle>Contact</CardTitle>
                        <CardDescription>How to reach this applicant</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <InfoRow icon={MailIcon} label="Email" value={applicant.email} />
                        <InfoRow icon={PhoneIcon} label="Phone" value={applicant.phoneNumber} />
                        <InfoRow icon={MapPinIcon} label="Address" value={applicant.currentAddress} />
                    </CardContent>
                </Card>

                {/* Professional Details */}
                <Card className="col-span-12 md:col-span-8">
                    <CardHeader>
                        <CardTitle>Professional Details</CardTitle>
                        <CardDescription>Current role, experience, and expectations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-x-4">
                            <InfoRow icon={BuildingIcon} label="Company" value={applicant.currentCompany} />
                            <InfoRow
                                icon={BriefcaseIcon}
                                label="Experience"
                                value={`${applicant.yearsOfExperience} ${applicant.yearsOfExperience === 1 ? "year" : "years"}`}
                            />
                            <InfoRow
                                icon={PhilippinePeso}
                                label="Expected"
                                value={`₱${applicant.expectedSalary.toLocaleString()}`}
                            />
                            <InfoRow
                                icon={ClockIcon}
                                label="Availability"
                                value={
                                    AVAILABILITY_OPTIONS.find(
                                        (option) => option.value === applicant.availability
                                    )?.label ?? applicant.availability
                                }
                            />
                            <InfoRow icon={UserIcon} label="Age" value={`${age} years old`} />
                            {applicant.resumePath && (
                                <InfoRow
                                    icon={FileTextIcon}
                                    label="Resume"
                                    value={
                                        <a
                                            href={`/files/${applicant.resumePath}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
                                        >
                                            View <LinkIcon className="w-3 h-3" />
                                        </a>
                                    }
                                />
                            )}
                        </div>
                    </CardContent>
                </Card>
                {/* Gemini AI Evaluation — only renders when data is present */}
                {applicant.applicantEvaluation && (
                    <GeminiEvaluationSection evaluation={applicant.applicantEvaluation.evaluation} />
                )}
                {/* Interview Date */}
                <Card className="col-span-12 md:col-span-5">
                    <CardHeader>
                        <CardTitle>Interview Date</CardTitle>
                        <CardDescription>Pick a date for the interview session</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center px-3 pb-3">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                            className="w-full"
                        />
                    </CardContent>
                </Card>

                {/* Start Time */}
                <Card className="col-span-12 md:col-span-4">
                    <CardHeader>
                        <CardTitle>Start Time</CardTitle>
                        <CardDescription>Select a preferred time slot</CardDescription>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                        <div className="grid grid-cols-4 gap-1.5">
                            {TIME_SLOTS.map((slot) => (
                                <button
                                    key={slot}
                                    onClick={() => setSelectedTime(slot)}
                                    className={cn(
                                        "text-sm px-1 py-2 rounded-md border transition-colors text-center",
                                        selectedTime === slot
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "border-border text-muted-foreground hover:border-foreground hover:text-foreground bg-background"
                                    )}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                {/* Duration & Confirm */}
                <Card className="flex flex-col col-span-12 md:col-span-3">
                    <CardHeader>
                        <CardTitle>Duration & Confirm</CardTitle>
                        <CardDescription>Set the length and confirm the booking</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1 gap-4 px-4 pb-4">
                        {/* Duration pill buttons */}
                        <div className="grid grid-cols-2 gap-1.5">
                            {INTERVIEW_DURATIONS.map((d) => (
                                <button
                                    key={d.value}
                                    onClick={() => setSelectedDuration(d.value)}
                                    className={cn(
                                        "text-sm px-2 py-2 rounded-md border transition-colors text-center",
                                        selectedDuration === d.value
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "border-border text-muted-foreground hover:border-foreground hover:text-foreground bg-background"
                                    )}
                                >
                                    {d.label}
                                </button>
                            ))}
                        </div>

                        <div className="border-t" />

                        {/* Summary */}
                        <div className={cn("space-y-1.5 flex-1 transition-opacity", canSchedule ? "opacity-100" : "opacity-40")}>
                            <p className="mb-2 text-sm font-semibold text-muted-foreground">
                                Summary
                            </p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CalendarIcon className="w-3 h-3 text-primary shrink-0" />
                                <span>
                                    {selectedDate
                                        ? DateTime.fromJSDate(selectedDate).toFormat("MMM d, yyyy")
                                        : "Pick a date"}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <ClockIcon className="w-3 h-3 text-primary shrink-0" />
                                <span>
                                    {selectedTime || "Pick a time"}
                                    {selectedTime && ` · ${INTERVIEW_DURATIONS.find((d) => d.value === selectedDuration)?.label}`}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <SendIcon className="w-3 h-3 text-primary shrink-0" />
                                <span className="truncate">→ {applicant.email}</span>
                            </div>
                        </div>

                        {/* Confirm button */}
                        <Button
                            className="w-full"
                            disabled={!canSchedule || scheduleMutation.isPending}
                            onClick={() => scheduleMutation.mutate()}
                        >
                            {scheduleMutation.isPending ? (
                                <>
                                    <div className="w-3.5 h-3.5 mr-2 border-2 rounded-full animate-spin border-primary-foreground border-t-transparent" />
                                    Scheduling…
                                </>
                            ) : (
                                <>
                                    <CalendarCheckIcon className="w-3.5 h-3.5 mr-2" />
                                    Confirm
                                </>
                            )}
                        </Button>

                        {/* Info note */}
                        <div className="flex items-start gap-2 rounded-md bg-muted p-2.5">
                            <InfoIcon className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                {applicant.firstName} receives a calendar invite and interview link via email once confirmed.
                            </p>
                        </div>

                        {scheduleMutation.isError && (
                            <Alert variant="destructive">
                                <AlertDescription className="text-sm">
                                    Failed to schedule the interview. Please try again.
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default HiringScheduleInterviewPage;