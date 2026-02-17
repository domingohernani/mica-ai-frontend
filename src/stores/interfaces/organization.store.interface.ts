export interface Organization {
  id: string;
  name: string;
}

export interface OrganizationStore {
  organizations: Organization[];
  currentOrganizationId: string | null;

  setOrganizations: (data: Organization[]) => void;
  setCurrentOrganization: (id: string) => void;
  clearCurrentOrganization: () => void;
}
