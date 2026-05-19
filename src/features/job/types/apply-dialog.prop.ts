import type { User } from "@auth0/auth0-react";
import type { ApplicantDetails } from "./applicant-details.type";

export type ApplyDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobTitle: string;
  companyName: string;
  onAuth0Login: () => void;
  applicant: User | undefined;
  isAuthenticated: boolean;
  onSubmit: (file: File, details: ApplicantDetails) => Promise<void>;
};
