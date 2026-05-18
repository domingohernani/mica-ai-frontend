import { api } from "@/utils/axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Briefcase,
    Building2,
    Calendar,
    Clock3,
    Coins,
    MapPin,
    Users,
    BadgeCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import AlertModal from "@/components/modal/alert-modal";

type Job = {
    id: string;
    createdBy: string;
    position: string;
    department: string;
    location: string;
    employmentType: string;
    experienceLevel: string;
    description: string;
    requirements: string;
    assignedRecruiter: string;
    status: string;
    salaryMin?: number;
    salaryMax?: number;
    benefits?: string;
    openPositions: number;
    applicationDeadline: string;
    skills: string[];
    createdAt: string;
    updatedAt: string;
    organization: {
        name: string;
    };
    organizationId: string;
};

const JobPosting = () => {
    const { id } = useParams();
    const [job, setJob] = useState<Job | null>(null);

    // Resume upload when applying
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Dialog state
    const [confirmSubmitDialogOpen, setConfirmSubmitDialogOpen] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const { data } = await api.get(`/jobs/${id}`);
                console.log(data);

                setJob(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchJob();
    }, [id]);

    const handleAttachButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const selectedFile = e.target.files?.[0];

        if (!selectedFile) return;
        setFile(selectedFile);
    };

    const handleSubmitButtonClick = () => {
        setConfirmSubmitDialogOpen(true);
    };

    if (!job) {
        return (
            <div className="px-4 py-20 mx-auto max-w-7xl">
                <div className="space-y-4">
                    <Skeleton className="h-10 w-80" />
                    <Skeleton className="h-5 w-60" />
                    <Skeleton className="h-72 rounded-xl" />
                </div>
            </div>
        );
    }

    const salary = new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        maximumFractionDigits: 0,
    });

    return (
        <section className="px-4 py-10 mx-auto max-w-7xl">
            {/* Header */}
            <header className="pb-10">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-5">
                        {/* Company */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center text-lg font-semibold border rounded-full h-14 w-14 bg-muted">
                                {job.organization.name.charAt(0)}
                            </div>
                            <div>
                                <p className="flex items-center gap-2 text-lg font-medium text-muted-foreground">
                                    {job.organization.name}
                                    <BadgeCheck className="w-5 h-5 text-blue-500" />
                                    <span>is hiring</span>
                                </p>
                                <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                                    {job.position}
                                </h1>
                            </div>
                        </div>

                        {/* Metadata */}
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
                            <InfoCard
                                icon={<Briefcase className="w-4 h-4" />}
                                label="TYPE"
                                value={job.employmentType}
                            />
                            <InfoCard
                                icon={<Building2 className="w-4 h-4" />}
                                label="DEPARTMENT"
                                value={job.department}
                            />
                            <InfoCard
                                icon={<Coins className="w-4 h-4" />}
                                label="SALARY"
                                value={`${salary.format(
                                    job.salaryMin ?? 0
                                )} - ${salary.format(job.salaryMax ?? 0)}`}
                            />
                            <InfoCard
                                icon={<MapPin className="w-4 h-4" />}
                                label="LOCATION"
                                value={job.location}
                            />
                            <InfoCard
                                icon={<Clock3 className="w-4 h-4" />}
                                label="POSTED"
                                value={new Date(job.createdAt).toLocaleDateString()}
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <Badge
                            variant="outline"
                            className="px-4 py-2 text-sm font-medium border-emerald-200 bg-emerald-50 text-emerald-700"
                        >
                            {job.status}
                        </Badge>
                    </div>
                </div>
            </header>

            <Separator className="mb-10" />

            {/* Body */}
            <div className="grid gap-10 lg:grid-cols-12">
                {/* Main Content */}
                <main className="space-y-10 lg:col-span-8">
                    <Section title="Job Description">
                        <p className="leading-8 text-muted-foreground">
                            {job.description}
                        </p>
                    </Section>
                    <Section title="Requirements">
                        <p className="leading-8 text-muted-foreground">
                            {job.requirements}
                        </p>
                    </Section>
                    <Section title="Benefits & Perks">
                        <p className="leading-8 text-muted-foreground">
                            {job.benefits || "No benefits listed."}
                        </p>
                    </Section>
                    <Section title="Required Skills">
                        <div className="flex flex-wrap gap-3">
                            {job.skills.map((skill) => (
                                <Badge
                                    key={skill}
                                    variant="secondary"
                                    className="px-4 py-2 text-sm font-medium rounded-full"
                                >
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </Section>
                </main>

                {/* Sidebar */}
                <aside className="lg:col-span-4">
                    <div className="sticky space-y-6 top-6">
                        {/* Apply Card */}
                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                <Button
                                    onClick={handleAttachButtonClick}
                                    className="w-full"
                                    size="lg"
                                >
                                    {file ? (
                                        <span className="underline">Attached file: {file.name}</span>
                                    ) : (
                                        "Apply Now"
                                    )}
                                </Button>
                                {file && (
                                    <Button
                                        onClick={handleSubmitButtonClick}
                                        className="w-full"
                                        size="lg"
                                        variant="default"
                                    >
                                        Submit
                                    </Button>
                                )}
                                <p className="text-sm text-muted-foreground">
                                    Join{" "}
                                    <span className="font-medium text-foreground">
                                        {job.organization.name}
                                    </span>{" "}
                                    as a <span className="font-medium">{job.position}</span> by{" "}
                                    <span className="text-foreground">attaching your resume</span>.
                                </p>
                                <p className="text-sm italic underline text-muted-foreground">
                                    Please upload your resume in PDF format only.
                                </p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,application/pdf"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </CardContent>
                        </Card>

                        {/* Job Details */}
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                                    Job Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                <SidebarItem
                                    icon={<Users className="w-5 h-5" />}
                                    label="Open Positions"
                                    value={String(job.openPositions)}
                                />
                                <SidebarItem
                                    icon={<Calendar className="w-5 h-5" />}
                                    label="Deadline"
                                    value={new Date(
                                        job.applicationDeadline
                                    ).toLocaleDateString()}
                                />
                                <SidebarItem
                                    icon={<Briefcase className="w-5 h-5" />}
                                    label="Experience"
                                    value={job.experienceLevel}
                                />
                                <SidebarItem
                                    icon={<Users className="w-5 h-5" />}
                                    label="Recruiter"
                                    value={job.assignedRecruiter}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </aside>
            </div>
            {/* Submit confirmation dialog */}
            <AlertModal
                key={"confimation-modal"}
                isOpen={confirmSubmitDialogOpen}
                onOpenChange={setConfirmSubmitDialogOpen}
                title="Submit Application"
                description={<>You're about to submit your application for <strong>{job.position}</strong> at <strong>{job.organization.name}</strong> with the attached resume <strong>{file?.name}</strong>. Are you sure you want to proceed?</>}
                firstButtonText="Confirm"
                secondButtonText="Cancel"
            />
        </section>
    );
};

export default JobPosting;

type InfoCardProps = {
    label: string;
    value: string;
    icon: React.ReactNode;
};

const InfoCard = ({ label, value, icon }: InfoCardProps) => {
    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                {icon}
                {label}
            </div>
            <p className="text-base font-medium">{value}</p>
        </div>
    );
};

const Section = ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) => {
    return (
        <section>
            <h2 className="mb-4 text-2xl font-bold">{title}</h2>
            {children}
        </section>
    );
};

const SidebarItem = ({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon: React.ReactNode;
}) => {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-1 text-muted-foreground">{icon}</div>
            <div>
                <p className="text-xs tracking-wide uppercase text-muted-foreground">
                    {label}
                </p>
                <p className="font-medium">{value}</p>
            </div>
        </div>
    );
};