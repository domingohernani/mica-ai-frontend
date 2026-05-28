import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileText, Upload, X } from "lucide-react";
import { useRef, useState } from "react";

const ApplyAttachResumeStep = ({
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

export default ApplyAttachResumeStep