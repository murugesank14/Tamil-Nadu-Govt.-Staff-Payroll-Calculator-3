export interface Post {
  id: string;
  name: string;
  scaleId: string;
  level: number;
}

export interface PayRevision2010 {
  postId: string;
  revisedScaleId: string;
  revisedLevel: number;
  description: string;
}

export interface Promotion {
  id: string; // for key prop
  date: string;
  post: string;
  gradePay?: number; // for pre-2016
  level?: string; // for post-2016
}

export interface AnnualIncrementChange {
  id: string;
  effectiveDate: string;
  incrementMonth: 'jan' | 'apr' | 'jul' | 'oct';
}

export interface BreakInService {
  id: string;
  startDate: string;
  endDate: string;
}

export type CityClass = 'A' | 'B' | 'C';


export interface EmployeeInput {
  employeeName: string;
  fatherName: string;
  employeeNo: string;
  cpsGpfNo: string;
  panNumber: string;
  bankAccountNumber: string;
  dateOfBirth: string;
  retirementAge: '58' | '60';
  dateOfJoining: string;
  dateOfJoiningInOffice: string;
  dateOfRelief?: string;
  annualIncrementChanges: AnnualIncrementChange[];

  // Pay at time of joining
  joiningPostId?: string;
  joiningPostCustomName?: string;
  joiningBasicPay5thPC?: number; // For pre-2006 joiners
  joiningScaleId5thPC?: string; // For pre-2006 joiners
  joiningPayInPayBand?: number; // For 6th PC joiners
  joiningScaleId6thPC?: string; // For 6th PC joiners
  joiningLevel?: string; // For 7th PC joiners

  selectionGradeDate: string;
  selectionGradeTwoIncrements: boolean;
  specialGradeDate: string;
  specialGradeTwoIncrements: boolean;
  superGradeDate: string;
  stagnationIncrementDate?: string;

  promotions: Promotion[];
  breaksInService: BreakInService[];
  incrementEligibilityMonths: number;

  cityClass: CityClass;
  daOverride?: number;
  
  calculationStartDate: string;
  calculationEndDate: string;

  // For Last Pay Certificate (LPC)
  festivalAdvance?: number;
  carAdvance?: number;
  twoWheelerAdvance?: number;
  computerAdvance?: number;
  otherPayables?: number;
  
  // Allowances & Deductions
  medicalAllowance: number;
  cpsGpfContributionRate: number;
  professionalTax: number;
  gisContribution: number;
}

export interface PayScale {
  id: string;
  scale: string;
  payBand: string;
  gradePay: number;
}

export interface PayScale5thPC {
  id: string;
  scale: string;
}

export enum CityGrade {
  GRADE_I_A = 'Grade I(a)',
  GRADE_I_B = 'Grade I(b)',
  GRADE_II = 'Grade II',
  GRADE_III = 'Grade III',
  GRADE_IV = 'Grade IV (Unclassified)',
}

export interface Deduction {
    name: string;
    amount: number;
}
export interface PayrollPeriod {
  period: string;
  basicPay: number;
  daRate: number;
  daAmount: number;
  hra: number;
  cca: number;
  medicalAllowance: number;
  grossPay: number;
  deductions: Deduction[];
  totalDeductions: number;
  netPay: number;
  remarks: string[];
  commission: 5 | 6 | 7;
  payInPayBand?: number; // Optional for 6th PC
  gradePay?: number; // Optional for 6th PC
}

export interface PayrollYear {
  year: number;
  periods: PayrollPeriod[];
}

export interface EmployeeDetails {
    employeeName: string;
    fatherName: string;
    employeeNo: string;
    cpsGpfNo: string;
    panNumber: string;
    bankAccountNumber: string;
    dateOfBirth: string;
    dateOfJoining: string;
    dateOfJoiningInOffice: string;
    dateOfRelief?: string;
    joiningPost?: string;
    retirementDate: string;
    retirementAge: '58' | '60';
    promotions: { post: string; date: string }[];
    payRevisions: { description: string; date: string }[];
    selectionGradeDate?: string;
    specialGradeDate?: string;
    superGradeDate?: string;
    stagnationIncrementDates?: string[];
    // For Last Pay Certificate (LPC)
    festivalAdvance?: number;
    carAdvance?: number;
    twoWheelerAdvance?: number;
    computerAdvance?: number;
    otherPayables?: number;
}


export interface PayrollResult {
  employeeDetails: EmployeeDetails;
  fixation6thPC?: {
    basicPay2005: number;
    multipliedPay: number;
    initialPayInPayBand: number;
    initialGradePay: number;
    initialRevisedBasicPay: number;
  };
  fixation7thPC?: {
    oldBasicPay: number;
    multipliedPay: number;
    initialRevisedPay: number;
    level: number;
  };
  yearlyCalculations: PayrollYear[];
  appliedRevisions: { description: string, date: Date }[];
}