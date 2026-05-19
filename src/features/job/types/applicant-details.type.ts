export type ApplicantDetails = {
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  currentAddress: string;
  currentJobTitle: string;
  currentCompany: string;
  yearsOfExperience: number;
  expectedSalary: number;
  availability: "immediate" | "15_days" | "1_month" | "more_than_1_month";
  professionalLinks: string;
};
