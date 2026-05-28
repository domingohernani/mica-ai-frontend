import type { JobAvailability } from "@/features/job/enum/job-availability";

export interface Application {
  id?: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  dateOfBirth: Date | string;
  email: string;
  phoneNumber: string;
  currentAddress: string;
  currentJobTitle: string | null;
  currentCompany: string | null;
  yearsOfExperience: number;
  expectedSalary: number;
  availability: JobAvailability;
  professionalLinks: string | null;
  appliedAt?: Date;
  updatedAt?: Date;
  status?: string;

  job?: {
    position: string;
  };
  jobId: string;

  applicantEvaluation: {
    evaluation: {
      alignmentRationale: string;
      compatibilityScore: number;
      matchedRequirements: string[];
      missingCoreRequirements: string[];
    };
  };
}
