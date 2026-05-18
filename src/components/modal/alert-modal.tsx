import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import type { ReactNode } from "react";

type AlertModalProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: ReactNode;
    description: ReactNode;
    firstButtonText: ReactNode;
    secondButtonText?: ReactNode;
};

const AlertModal = ({
    isOpen,
    onOpenChange,
    title,
    description,
    firstButtonText,
    secondButtonText,
}: AlertModalProps) => {
    return (
        <AlertDialog
            open={isOpen}
            onOpenChange={onOpenChange}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>

                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogAction
                        onClick={() => onOpenChange(false)}
                    >
                        {firstButtonText}
                    </AlertDialogAction>

                    {secondButtonText && (
                        <AlertDialogCancel>
                            {secondButtonText}
                        </AlertDialogCancel>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AlertModal;