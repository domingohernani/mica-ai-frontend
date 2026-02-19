export interface OrganizationMember {
  id: string;
  userId: string;
  role: string;
  joinedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  members: OrganizationMember[];
}

export interface OrganizationStore {
  organizations: Organization[];
  currentOrganizationId: string | null;

  setOrganizations: (data: Organization[]) => void;
  setCurrentOrganizationId: (id: string) => void;
  clearCurrentOrganization: () => void;
}
