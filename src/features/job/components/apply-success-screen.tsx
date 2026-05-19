import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

const ApplySuccessScreen = ({
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
export default ApplySuccessScreen