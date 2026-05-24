import { api } from "@/utils/axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { DateTime } from "luxon";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    ChevronLeft,
    InfoIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import PageHeader from "@/components/layout/page-header";

interface Applicant {
    id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    currentAddress: string;
    currentCompany: string;
    currentJobTitle: string;
    expectedSalary: number;
    yearsOfExperience: number;
    availability: string;
    status: string;
    resumePath: string;
    professionalLinks: string;
    appliedAt: string;
    updatedAt: string;
    jobId: string;
    organizationId: string;
}

const AVAILABILITY_LABELS: Record<string, string> = {
    immediately: "Immediately",
    within_2_weeks: "Within 2 Weeks",
    within_1_month: "Within 1 Month",
    more_than_1_month: "More than 1 Month",
};

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

function InfoRow({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className="flex items-center gap-3 mb-2">
            <Icon className="size-3.5 text-muted-foreground shrink-0" />
            <p className="text-sm text-muted-foreground shrink-0">{label}:</p>
            <p className="text-sm font-medium truncate text-foreground">{value}</p>
        </div>
    );
}

const HiringScheduleInterviewPage = () => {
    const { jobId, applicationId } = useParams();

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [selectedDuration, setSelectedDuration] = useState<string>("60");
    const [scheduled, setScheduled] = useState(false);

    const fetchApplicant = async (): Promise<Applicant | null> => {
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
        onSuccess: () => setScheduled(true),
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

    const initials = [applicant.firstName?.[0], applicant.lastName?.[0]]
        .filter(Boolean)
        .join("")
        .toUpperCase();

    const age = Math.floor(
        Math.abs(DateTime.fromISO(applicant.dateOfBirth).diffNow("years").years)
    );

    return (
        <div className="space-y-4">

            {/* Page Header */}
            <section className="flex items-center justify-between">
                <PageHeader
                    title="Schedule Interview"
                    subtitle={`Set the interview date and time for ${fullName}'s application.`}
                />
                <Button variant="outline" className="gap-2">
                    <ChevronLeft className="w-4 h-4" />
                    Back
                </Button>
            </section>

            {/* Success banner */}
            {scheduled && (
                <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                    <CardContent className="flex items-start gap-3 py-4">
                        <CheckCircle2Icon className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                        <div>
                            <p className="font-semibold text-green-800 dark:text-green-200">Interview Scheduled!</p>
                            <p className="mt-0.5 text-sm text-green-700 dark:text-green-300">
                                {applicant.firstName} will receive their interview link at{" "}
                                <span className="font-medium">{applicant.email}</span> on{" "}
                                {selectedDate && DateTime.fromJSDate(selectedDate).toFormat("MMMM d, yyyy")}{" "}
                                at {selectedTime}.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ── BENTO GRID ── */}
            <div className="grid grid-cols-12 gap-3">

                {/* ── Row 1 ── */}

                {/* Profile card — col 1-3 */}
                <Card className="col-span-12 md:col-span-3">
                    <CardContent className="flex flex-col items-center pt-6 text-center">
                        <Avatar className="w-14 h-14">
                            <AvatarImage alt={fullName} />
                            <AvatarFallback className="text-base font-semibold bg-primary/10 text-primary">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <h2 className="mt-3 text-sm font-semibold leading-tight">{fullName}</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">{applicant.currentJobTitle}</p>
                        <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                            <Badge variant="secondary" className="text-xs">{applicant.status}</Badge>
                            <Badge variant="outline" className="text-xs">
                                Applied {DateTime.fromISO(applicant.appliedAt).toFormat("MMM d, yyyy")}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Contact card — col 4-6 */}
                <Card className="col-span-12 md:col-span-3">
                    <CardHeader className="px-4 pt-4 pb-2">
                        <CardTitle className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                            Contact
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                        <InfoRow icon={MailIcon} label="Email" value={applicant.email} />
                        <InfoRow icon={PhoneIcon} label="Phone" value={applicant.phoneNumber} />
                        <InfoRow icon={MapPinIcon} label="Address" value={applicant.currentAddress} />
                    </CardContent>
                </Card>

                {/* Professional card — col 7-12 */}
                <Card className="col-span-12 md:col-span-6">
                    <CardHeader className="px-4 pt-4 pb-2">
                        <CardTitle className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                            Professional Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
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
                                value={AVAILABILITY_LABELS[applicant.availability] ?? applicant.availability}
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

                {/* ── Row 2 ── */}

                {/* Calendar — col 1-5 */}
                <Card className="col-span-12 md:col-span-5">
                    <CardHeader className="px-4 pt-4 pb-2">
                        <CardTitle className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                            Interview Date
                        </CardTitle>
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

                {/* Time slots — col 6-9 */}
                <Card className="col-span-12 md:col-span-4">
                    <CardHeader className="px-4 pt-4 pb-2">
                        <CardTitle className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                            Start Time
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                        <div className="grid grid-cols-4 gap-1.5">
                            {TIME_SLOTS.map((slot) => (
                                <button
                                    key={slot}
                                    onClick={() => setSelectedTime(slot)}
                                    className={cn(
                                        "text-xs px-1 py-2 rounded-md border transition-colors text-center",
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

                {/* Duration + Summary + Confirm — col 10-12 */}
                <Card className="flex flex-col col-span-12 md:col-span-3">
                    <CardHeader className="px-4 pt-4 pb-2">
                        <CardTitle className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                            Duration
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1 gap-4 px-4 pb-4">

                        {/* Duration pill buttons */}
                        <div className="grid grid-cols-2 gap-1.5">
                            {INTERVIEW_DURATIONS.map((d) => (
                                <button
                                    key={d.value}
                                    onClick={() => setSelectedDuration(d.value)}
                                    className={cn(
                                        "text-xs px-2 py-2 rounded-md border transition-colors text-center",
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
                            <p className="mb-2 text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                                Summary
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <CalendarIcon className="w-3 h-3 text-primary shrink-0" />
                                <span>
                                    {selectedDate
                                        ? DateTime.fromJSDate(selectedDate).toFormat("MMM d, yyyy")
                                        : "Pick a date"}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <ClockIcon className="w-3 h-3 text-primary shrink-0" />
                                <span>
                                    {selectedTime || "Pick a time"}
                                    {selectedTime && ` · ${INTERVIEW_DURATIONS.find((d) => d.value === selectedDuration)?.label}`}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <SendIcon className="w-3 h-3 text-primary shrink-0" />
                                <span className="truncate">→ {applicant.email}</span>
                            </div>
                        </div>

                        {/* Confirm button */}
                        <Button
                            className="w-full"
                            disabled={!canSchedule || scheduleMutation.isPending || scheduled}
                            onClick={() => scheduleMutation.mutate()}
                        >
                            {scheduleMutation.isPending ? (
                                <>
                                    <div className="w-3.5 h-3.5 mr-2 border-2 rounded-full animate-spin border-primary-foreground border-t-transparent" />
                                    Scheduling…
                                </>
                            ) : scheduled ? (
                                <>
                                    <CheckCircle2Icon className="w-3.5 h-3.5 mr-2" />
                                    Scheduled
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
                            <p className="text-xs leading-relaxed text-muted-foreground">
                                {applicant.firstName} receives a calendar invite and interview link via email once confirmed.
                            </p>
                        </div>

                        {scheduleMutation.isError && (
                            <Alert variant="destructive">
                                <AlertDescription className="text-xs">
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