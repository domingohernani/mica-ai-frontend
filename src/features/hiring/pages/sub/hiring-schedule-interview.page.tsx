import { api } from "@/utils/axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { DateTime } from "luxon";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
    CalendarIcon,
    ClockIcon,
    MailIcon,
    PhoneIcon,
    MapPinIcon,
    BriefcaseIcon,
    DollarSignIcon,
    InfoIcon,
    CheckCircle2Icon,
    UserIcon,
    SendIcon,
    LinkIcon,
    FileTextIcon,
    CalendarCheckIcon,
    BuildingIcon,
    ChevronLeft,
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
    { value: "30", label: "30 minutes" },
    { value: "45", label: "45 minutes" },
    { value: "60", label: "1 hour" },
    { value: "90", label: "1.5 hours" },
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
            <div className="flex items-center justify-center rounded-md size-7 shrink-0">
                <Icon className="size-3.5 text-muted-foreground" />
            </div>
            <div className="flex gap-2 items-base">
                <p className="text-sm font-medium text-muted-foreground">
                    {label}:
                </p>
                <p className="text-sm font-medium text-foreground">{value}</p>
            </div>
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

    const {
        data: applicant,
        isLoading,
        error,
    } = useQuery({
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
        <>
            {/* Page Header */}
            <section className="flex items-center justify-between">
                <PageHeader
                    title="Schedule Interview"
                    subtitle={`Set the interview date and time for ${fullName}'s application.`}
                />
                <Button className="gap-2">
                    <ChevronLeft className="w-4 h-4" />
                    Back
                </Button>
            </section>
            {/* Info cards row */}
            <div className="flex gap-4 my-4">
                <Card className="flex-1">
                    <CardContent className="flex items-start gap-3">
                        <InfoIcon className="size-4 shrink-0 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-semibold">Schedule Information</p>
                            <p className="text-sm text-muted-foreground">
                                Once you set the interview schedule,{" "}
                                <span className="font-medium text-foreground">{applicant.firstName}</span>{" "}
                                will automatically receive an email with a link to take the interview at
                                the scheduled date and time.
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="flex-1">
                    <CardContent className="flex items-start gap-3">
                        <FileTextIcon className="size-4 shrink-0 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-semibold">Interview Questions</p>
                            <p className="text-sm text-muted-foreground">
                                {applicant.firstName} will be asked the screening questions you configured
                                when creating this job post. You can review or edit those questions from
                                the job post settings.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Success state */}
            {scheduled && (
                <Card>
                    <CardContent className="flex items-start gap-3 pt-5 pb-5">
                        <CheckCircle2Icon className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                        <div>
                            <p className="font-semibold">Interview Scheduled!</p>
                            <p className="mt-0.5 text-sm text-muted-foreground">
                                {applicant.firstName} will receive their interview link at{" "}
                                <span className="font-medium text-foreground">{applicant.email}</span> on{" "}
                                {selectedDate && DateTime.fromJSDate(selectedDate).toFormat("MMMM d, yyyy")}{" "}
                                at {selectedTime}.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Main content grid */}
            <div className="grid gap-5 lg:grid-cols-3">

                <div className="space-y-4">

                    {/* Profile summary */}
                    <Card>
                        <CardContent>
                            <div className="flex flex-col items-center text-center">
                                <Avatar className="w-16 h-16">
                                    <AvatarImage
                                        // src={applicant.}
                                        alt={fullName}
                                    />
                                    <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <h2 className="mt-3 text-base font-semibold">{fullName}</h2>
                                <p className="text-sm text-muted-foreground">{applicant.currentJobTitle}</p>
                                <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                                    <Badge variant="secondary" className="text-xs">
                                        {applicant.status}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                        Applied {DateTime.fromISO(applicant.appliedAt).toFormat("MMM d, yyyy")}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold">Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <InfoRow icon={MailIcon} label="Email" value={applicant.email} />
                            <InfoRow icon={PhoneIcon} label="Phone" value={applicant.phoneNumber} />
                            <InfoRow icon={MapPinIcon} label="Address" value={applicant.currentAddress} />
                        </CardContent>
                    </Card>

                    {/* Professional */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold">Professional Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <InfoRow icon={BuildingIcon} label="Current Company" value={applicant.currentCompany} />
                            <InfoRow
                                icon={BriefcaseIcon}
                                label="Experience"
                                value={`${applicant.yearsOfExperience} ${applicant.yearsOfExperience === 1 ? "year" : "years"}`}
                            />
                            <InfoRow
                                icon={DollarSignIcon}
                                label="Expected Salary"
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
                                            className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
                                        >
                                            View Resume
                                            <LinkIcon className="w-3 h-3" />
                                        </a>
                                    }
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <CalendarCheckIcon className="w-4 h-4 text-primary" />
                                Set Interview Schedule
                            </CardTitle>
                            <CardDescription>
                                Choose a date, time, and duration for {applicant.firstName}'s interview.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-2">

                            {/* Date picker */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Interview Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !selectedDate && "text-muted-foreground",
                                            )}
                                        >
                                            <CalendarIcon className="w-4 h-4 mr-2" />
                                            {selectedDate
                                                ? DateTime.fromJSDate(selectedDate).toFormat("MMMM d, yyyy")
                                                : "Pick a date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={selectedDate}
                                            onSelect={setSelectedDate}
                                            disabled={(date) =>
                                                date < new Date(new Date().setHours(0, 0, 0, 0))
                                            }
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* Time + Duration */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Start Time</Label>
                                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select time" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <ScrollArea className="h-[200px]">
                                                {TIME_SLOTS.map((slot) => (
                                                    <SelectItem key={slot} value={slot}>
                                                        {slot}
                                                    </SelectItem>
                                                ))}
                                            </ScrollArea>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2 ">
                                    <Label className="text-sm font-medium">Duration</Label>
                                    <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select duration" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {INTERVIEW_DURATIONS.map((d) => (
                                                <SelectItem key={d.value} value={d.value}>
                                                    {d.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Summary preview */}
                            {canSchedule && (
                                <div className="p-4 border border-dashed rounded-lg">
                                    <p className="mb-2 text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                                        Summary
                                    </p>
                                    <div className="space-y-1.5 text-sm">
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon className="h-3.5 w-3.5 text-primary" />
                                            <span>
                                                {DateTime.fromJSDate(selectedDate!).toFormat("EEEE, MMMM d, yyyy")}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <ClockIcon className="h-3.5 w-3.5 text-primary" />
                                            <span>
                                                {selectedTime} &bull;{" "}
                                                {INTERVIEW_DURATIONS.find((d) => d.value === selectedDuration)?.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <SendIcon className="h-3.5 w-3.5 text-primary" />
                                            <span>
                                                Invite sent to{" "}
                                                <span className="font-medium">{applicant.email}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <Button
                                variant="default"
                                className="w-full mt-4"
                                disabled={!canSchedule || scheduleMutation.isPending || scheduled}
                                onClick={() => scheduleMutation.mutate()}
                            >
                                {scheduleMutation.isPending ? (
                                    <>
                                        <div className="w-4 h-4 mr-2 border-2 rounded-full animate-spin border-primary-foreground border-t-transparent" />
                                        Scheduling…
                                    </>
                                ) : scheduled ? (
                                    <>
                                        <CheckCircle2Icon className="w-4 h-4 mr-2" />
                                        Interview Scheduled
                                    </>
                                ) : (
                                    <>
                                        <CalendarCheckIcon className="w-4 h-4 mr-2" />
                                        Confirm
                                    </>
                                )}
                            </Button>

                            {scheduleMutation.isError && (
                                <Alert variant="destructive">
                                    <AlertDescription>
                                        Failed to schedule the interview. Please try again.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default HiringScheduleInterviewPage;