export interface Job {
  id: string;
  organizationId: string;
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
  applicationDeadline?: string;
  skills?: string[];
  createdAt: string;
  updatedAt: string;
}
