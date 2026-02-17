import type { OrganizationStore } from "@/stores/interfaces/organization.store.interface";
import type { StateCreator } from "zustand";

export const organization: StateCreator<OrganizationStore> = (set) => ({
  organizations: [],

  currentOrganizationId: null,

  setOrganizations: (data) => set({ organizations: data }),

  setCurrentOrganization: (id) => set({ currentOrganizationId: id }),

  clearCurrentOrganization: () => set({ currentOrganizationId: null }),
});
