import { EmployeeInput, PayrollResult, PayrollYear, PayrollPeriod, CityGrade, CityClass, Promotion, Post, PayRevision2010, PayScale, Deduction, AccountTestPass } from '../types';
import { 
    PAY_MATRIX, GRADE_PAY_TO_LEVEL, DA_RATES, 
    HRA_SLABS_7TH_PC, HRA_SLABS_6TH_PC, HRA_SLABS_6TH_PC_PRE_2009, HRA_SLABS_5TH_PC, HRA_SLABS_4TH_PC, HRA_SLABS_3RD_PC,
    PAY_SCALES_6TH_PC, PAY_SCALES_5TH_PC, PAY_SCALES_4TH_PC, PAY_SCALES_3RD_PC,
    POSTS, PAY_REVISIONS_2010, CCA_RATES, 
    FIFTH_PC_SG_SP_GRADE_MAPPING, TN_GOVERNMENT_ORDERS, PAY_BAND_LIMITS_6TH_PC
} from '../constants';

// TN 7th PC Pay Fixation: (6th PC Basic Pay as on 31.12.2015) × 2.57, then find next higher or equal pay in the new Level matrix.
// Reference: G.O.Ms.No.303, Finance (Pay Cell) Department, dated 11.10.2017
const FITMENT_FACTOR_7TH_PC = 2.57;

// TN 6th PC Pay Fixation: (5th PC Basic Pay as on 31.12.2005) × 1.86, rounded to nearest rupee. This becomes the Pay in Pay Band.
// Then Grade Pay is added: Total Revised Pay = Pay in Pay Band + Grade Pay
// Reference: G.O.Ms.No.234, Finance (Pay Cell) Department, dated 01.06.2009, Schedule-I & II
const FITMENT_MULTIPLIER_6TH_PC_TN = 1.86;

// Helper to parse YYYY-MM-DD string as a UTC date at midnight to avoid timezone issues.
const parseDateUTC = (dateString?: string): Date | undefined => {
  if (!dateString) return undefined;
  // Appending 'T00:00:00Z' ensures the date is parsed as UTC midnight.
  return new Date(`${dateString}T00:00:00Z`);
};

const mapCityClassToGrade = (cityClass: CityClass): CityGrade => {
    switch (cityClass) {
        case 'A': return CityGrade.GRADE_I_A;
        case 'B': return CityGrade.GRADE_I_B;
        case 'C':
        default:
            return CityGrade.GRADE_II; // A sensible default for "Others"
    }
}

// --- Pay Calculation Helpers ---

function findPayInMatrix(pay: number, level: number): number {
  const levelPayScale = PAY_MATRIX[level];
  if (!levelPayScale) throw new Error(`Invalid level: ${level}`);
  const newPay = levelPayScale.find(p => p >= pay);
  return newPay || levelPayScale[levelPayScale.length - 1];
}

function parseScale(scale: string): { stages: { from: number, to: number, inc: number }[], max: number, start: number } {
    const parts = scale.replace(/\s/g, '').split('-').map(Number);
    if (parts.some(isNaN)) return { stages: [], max: 0, start: 0 };
    const stages = [];
    for (let i = 0; i < parts.length - 2; i += 2) {
        stages.push({ from: parts[i], to: parts[i+2], inc: parts[i+1] });
    }
    return { stages, start: parts[0], max: parts[parts.length - 1] };
}

function findNextHigherStageInScale(currentPay: number, newScaleString: string): number {
    const scale = parseScale(newScaleString);
    if (scale.stages.length === 0) return currentPay;
    if (currentPay >= scale.max) return scale.max;

    let pay = scale.start;
    if (currentPay < pay) return pay;

    while (pay <= currentPay && pay < scale.max) {
        let incrementApplied = false;
        for (const stage of scale.stages) {
            if (pay < stage.to) {
                pay += stage.inc;
                incrementApplied = true;
                break;
            }
        }
        if (!incrementApplied && scale.stages.length > 0) {
            pay += scale.stages[scale.stages.length - 1].inc;
        }
    }
    return Math.min(pay, scale.max);
}


function getIncrementInScale(currentPay: number, scaleString: string, steps: number = 1): number {
    let newPay = currentPay;
    const scale = parseScale(scaleString);
    if(scale.stages.length === 0) return newPay;
    
    for (let i = 0; i < steps; i++) {
        if (newPay >= scale.max) {
            newPay = scale.max;
            break;
        }
        let incrementApplied = false;
        for (const stage of scale.stages) {
            if (newPay < stage.to) {
                newPay += stage.inc;
                incrementApplied = true;
                break;
            }
        }
        if (!incrementApplied && scale.stages.length > 0) {
             newPay += scale.stages[scale.stages.length - 1].inc;
        }
        
        if(newPay > scale.max) newPay = scale.max;
    }
    return newPay;
}

// Fix: Changed `commission` type from `6 | 7` to `number` to resolve call-site type errors.
// Added explicit checks for commission 6 and 7, with a fallback error for unsupported values.
function getIncrement(currentPay: number, level: number, steps: number, commission: number, gradePay?: number): { newPay: number, newPipb?: number } {
    if (commission === 7) {
        const levelPayScale = PAY_MATRIX[level];
        if (!levelPayScale) throw new Error(`Invalid level for 7th PC increment: ${level}`);
        const currentIndex = levelPayScale.indexOf(currentPay);
        
        let newIndex = -1;
        if (currentIndex === -1) {
             const nextStepIndex = levelPayScale.findIndex(p => p > currentPay);
             if(nextStepIndex === -1) return { newPay: currentPay }; // Already at max
             newIndex = Math.min(nextStepIndex + steps - 1, levelPayScale.length - 1);
        } else {
            newIndex = Math.min(currentIndex + steps, levelPayScale.length - 1);
        }
        return { newPay: levelPayScale[newIndex] };
    } else if (commission === 6) { // 6th PC
        if (gradePay === undefined) throw new Error("Grade Pay is required for 6th PC increment");
        let payInPayBand = currentPay - gradePay;
        const payBandLimits = PAY_BAND_LIMITS_6TH_PC[gradePay];
        
        for (let i = 0; i < steps; i++) {
             if (payBandLimits && payInPayBand >= payBandLimits.max) {
                 break;
             }
             const incrementAmount = Math.round((payInPayBand + gradePay) * 0.03);
             payInPayBand += incrementAmount;
        }

        if (payBandLimits && payInPayBand > payBandLimits.max) {
            payInPayBand = payBandLimits.max;
        }
        return { newPay: payInPayBand + gradePay, newPipb: payInPayBand };
    }
    throw new Error(`getIncrement was called with an invalid pay commission: ${commission}. Only 6th and 7th PC are supported.`);
}

function getHra(basicPay: number, cityGrade: CityGrade, date: Date): number {
    const is7thPC = date >= new Date('2016-01-01T00:00:00Z');
    const is6thPC = date >= new Date('2006-01-01T00:00:00Z');
    const is5thPC = date >= new Date('1996-01-01T00:00:00Z');
    const is4thPC = date >= new Date('1986-01-01T00:00:00Z');
    
    let slabs;
    if (is7thPC) {
        slabs = HRA_SLABS_7TH_PC;
    } else if (is6thPC) {
        slabs = date < new Date('2009-06-01T00:00:00Z') ? HRA_SLABS_6TH_PC_PRE_2009 : HRA_SLABS_6TH_PC;
    } else if (is5thPC) {
        slabs = HRA_SLABS_5TH_PC;
    } else if (is4thPC) {
        slabs = HRA_SLABS_4TH_PC;
    } else { // 3rd PC
        slabs = HRA_SLABS_3RD_PC;
    }

    const slab = slabs.find(s => basicPay >= s.payRange[0] && basicPay <= s.payRange[1]);
    if (!slab) return 0;
    return slab.rates[cityGrade as any] || slab.rates['Unclassified'] || 0;
}

interface ProbationEligibilityCheck {
  incrementNumber: number;
  probationPeriodType: '1 Year' | '2 Years' | 'Custom';
  probationPeriodMonths?: number;
  hasTestRequirement: boolean;
  testStatus?: 'Not Appeared' | 'Pending' | 'Passed' | 'Failed' | 'Exempted';
  testPassedDate?: Date;
  normalIncrementDate: Date;
  probationStartDate: Date;
}

interface EligibilityResult {
  eligible: boolean;
  effectiveDate: Date;
  remarks: string;
}

const calculateProbationIncrementEligibility = (params: ProbationEligibilityCheck): EligibilityResult => {
    const {
        incrementNumber, probationPeriodType, probationPeriodMonths,
        hasTestRequirement, testStatus, testPassedDate, normalIncrementDate,
        probationStartDate
    } = params;

    const fiveYearsInMs = 5 * 365.25 * 24 * 60 * 60 * 1000;
    if (hasTestRequirement && testStatus !== 'Passed' && testStatus !== 'Exempted') {
        if (normalIncrementDate.getTime() - probationStartDate.getTime() > fiveYearsInMs) {
            return {
                eligible: false,
                effectiveDate: normalIncrementDate,
                remarks: `CRITICAL: PROBATION TERMINATED. Test not passed within the maximum 5-year period. Employee should be reverted or discharged. (Ref: ${TN_GOVERNMENT_ORDERS.PROBATION.CONDITIONS_OF_SERVICE})`
            };
        }
    }

    const result: EligibilityResult = {
        eligible: true,
        effectiveDate: normalIncrementDate,
        remarks: `Increment eligible under normal rules. (Ref: ${TN_GOVERNMENT_ORDERS.PROBATION.GENERAL_RULE})`
    };
    
    if (!hasTestRequirement) {
        result.remarks = "Increments granted on normal dates as no test requirement specified.";
        return result;
    }

    let probationYears;
    if (probationPeriodType === '1 Year') probationYears = 1;
    else if (probationPeriodType === '2 Years') probationYears = 2;
    else probationYears = (probationPeriodMonths || 24) <= 18 ? 1 : 2;

    const testIsPassed = testStatus === 'Passed' && testPassedDate;

    if (probationYears === 1) {
        if (incrementNumber === 1) {
            if (testIsPassed) {
                result.eligible = true;
                result.effectiveDate = new Date(Math.max(normalIncrementDate.getTime(), testPassedDate.getTime()));
                result.remarks = `First increment sanctioned after passing test. Effective from ${result.effectiveDate.toLocaleDateString('en-GB')}.`;
            } else {
                result.eligible = false;
                result.remarks = "First increment withheld until the prescribed test is passed.";
            }
        } else {
             result.remarks = `Increment #${incrementNumber} granted on normal date as test applies only to first increment.`;
        }
    } else { // 2 Years Probation
         if (incrementNumber === 1) {
            result.remarks = "First increment granted normally as test requirement applies only to second increment for two-year probationers.";
        } else if (incrementNumber === 2) {
             if (testIsPassed) {
                result.eligible = true;
                result.effectiveDate = new Date(Math.max(normalIncrementDate.getTime(), testPassedDate.getTime()));
                result.remarks = `Second increment sanctioned after passing test. Effective from ${result.effectiveDate.toLocaleDateString('en-GB')}.`;
            } else {
                result.eligible = false;
                result.remarks = "Second increment withheld until the prescribed test is passed.";
            }
        } else {
            result.remarks = `Increment #${incrementNumber} granted on normal date as test applies only to second increment.`;
        }
    }
    
    return result;
};


export const calculateFullPayroll = (data: EmployeeInput): PayrollResult => {
    // --- 1. SETUP & INITIALIZATION ---
    const { dateOfJoining, calculationStartDate, calculationEndDate, promotions, annualIncrementChanges, breaksInService, selectionGradeDate, specialGradeDate, accountTestPasses, cityClass, incrementEligibilityMonths, joiningPostId, joiningPostCustomName, selectionGradeTwoIncrements, specialGradeTwoIncrements, ...employeeDetails } = data;
    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
    
    const doj = parseDateUTC(dateOfJoining);
    const calcStartDate = parseDateUTC(calculationStartDate);
    let calcEndDate = parseDateUTC(calculationEndDate);
    const reliefDate = parseDateUTC(employeeDetails.dateOfRelief);
    const cityGrade = mapCityClassToGrade(cityClass);

    if (!doj || !calcStartDate || !calcEndDate) {
      throw new Error('Missing Required Fields: Please provide:\n1. Date of Joining\n2. Calculation Start Date\n3. Calculation End Date');
    }
     if (doj < new Date('1980-01-01T00:00:00Z')) {
        throw new Error('Calculations before 01-01-1980 are not supported.');
    }

    if(reliefDate && reliefDate < calcEndDate) {
        calcEndDate = reliefDate;
    }
    
    // --- State Variables for Simulation ---
    let currentPay: number;
    let currentCommission: 3 | 4 | 5 | 6 | 7;
    let currentLevel: number = 0;
    let currentPipb: number | undefined = undefined;
    let currentGradePay: number | undefined = undefined;
    let currentScaleString: string | undefined = undefined;
    let currentOrdinaryScaleString: string | undefined = undefined; // For 5th PC SG/SpG
    let currentPostId: string | undefined = joiningPostId;

    let fixation4thPC: PayrollResult['fixation4thPC'] | undefined = undefined;
    let fixation5thPC: PayrollResult['fixation5thPC'] | undefined = undefined;
    let fixation6thPC: PayrollResult['fixation6thPC'] | undefined = undefined;
    let fixation7thPC: PayrollResult['fixation7thPC'] | undefined = undefined;
    const appliedRevisions: { description: string, date: Date }[] = [];
    const incrementAnalysis = { regular: 0, selectionGrade: 0, specialGrade: 0, promotion: 0, accountTest: 0, total: 0 };
    
    let accountTestIncrementPending = false;

    // --- 2. INITIAL PAY FIXATION (at Date of Joining) ---
    const fixedDate1986 = new Date('1986-01-01T00:00:00Z');
    const fixedDate1996 = new Date('1996-01-01T00:00:00Z');
    const fixedDate2006 = new Date('2006-01-01T00:00:00Z');
    const fixedDate2016 = new Date('2016-01-01T00:00:00Z');
    
    if (doj < fixedDate1986) {
        currentCommission = 3;
        const { joiningBasicPay3rdPC, joiningScaleId3rdPC } = data;
        if (joiningBasicPay3rdPC === undefined || !joiningScaleId3rdPC) throw new Error("For pre-1986 joiners, provide 3rd PC Scale and Basic Pay.");
        const scaleInfo = PAY_SCALES_3RD_PC.find(s => s.id === joiningScaleId3rdPC);
        if(!scaleInfo) throw new Error(`Invalid 3rd PC Scale ID: ${joiningScaleId3rdPC}`);
        currentPay = joiningBasicPay3rdPC;
        currentScaleString = scaleInfo.scale;
    } else if (doj < fixedDate1996) {
        currentCommission = 4;
        const { joiningBasicPay4thPC, joiningScaleId4thPC } = data;
        if (joiningBasicPay4thPC === undefined || !joiningScaleId4thPC) throw new Error("For 1986-1995 joiners, provide 4th PC Scale and Basic Pay.");
        const scaleInfo = PAY_SCALES_4TH_PC.find(s => s.id === joiningScaleId4thPC);
        if(!scaleInfo) throw new Error(`Invalid 4th PC Scale ID: ${joiningScaleId4thPC}`);
        currentPay = joiningBasicPay4thPC;
        currentScaleString = scaleInfo.scale;
    } else if (doj < fixedDate2006) {
        currentCommission = 5;
        const { joiningBasicPay5thPC, joiningScaleId5thPC } = data;
        if (joiningBasicPay5thPC === undefined || !joiningScaleId5thPC) throw new Error("For pre-2006 joiners, provide 5th PC Scale and Basic Pay.");
        const scaleInfo = PAY_SCALES_5TH_PC.find(s => s.id === joiningScaleId5thPC);
        if(!scaleInfo) throw new Error(`Invalid 5th PC Scale ID: ${joiningScaleId5thPC}`);
        currentPay = joiningBasicPay5thPC;
        currentScaleString = scaleInfo.scale;
        currentOrdinaryScaleString = scaleInfo.scale;
    } else if (doj < fixedDate2016) {
        currentCommission = 6;
        const { joiningPayInPayBand, joiningScaleId6thPC } = data;
        if (joiningPayInPayBand === undefined || !joiningScaleId6thPC) throw new Error("For 2006-2015 joiners, provide 6th PC Pay Band and Pay in Pay Band.");
        const scaleInfo = PAY_SCALES_6TH_PC.find(s => s.id === joiningScaleId6thPC);
        if (!scaleInfo) throw new Error(`Invalid 6th PC Scale ID: ${joiningScaleId6thPC}`);
        currentPipb = joiningPayInPayBand;
        currentGradePay = scaleInfo.gradePay;
        currentPay = currentPipb + currentGradePay;
    } else {
        currentCommission = 7;
        const { joiningLevel } = data;
        if (!joiningLevel) throw new Error("For post-2016 joiners, provide the Pay Level.");
        currentLevel = parseInt(joiningLevel, 10);
        currentPay = PAY_MATRIX[currentLevel][0];
    }
    
    // --- Calculate total postponement from breaks in service ---
    const totalBreakDays = breaksInService.reduce((total, b) => {
        const start = parseDateUTC(b.startDate);
        const end = parseDateUTC(b.endDate);
        if (start && end && end > start) {
            return total + (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
        }
        return total;
    }, 0);

    // --- 3. BUILD CHRONOLOGICAL EVENT LIST ---
    const events: { date: Date, type: string, data?: any, priority: number }[] = [
        ...DA_RATES.map(da => ({ date: da.date, type: 'DA_CHANGE', data: da, priority: 1 })),
        { date: fixedDate1986, type: 'PAY_COMMISSION_4', priority: 2 },
        { date: fixedDate1996, type: 'PAY_COMMISSION_5', priority: 2 },
        { date: fixedDate2006, type: 'PAY_COMMISSION_6', priority: 2 },
        { date: fixedDate2016, type: 'PAY_COMMISSION_7', priority: 2 },
    ];
    if (selectionGradeDate) events.push({ date: parseDateUTC(selectionGradeDate)!, type: 'SELECTION_GRADE', data: { applyFixation: selectionGradeTwoIncrements }, priority: 3 });
    if (specialGradeDate) events.push({ date: parseDateUTC(specialGradeDate)!, type: 'SPECIAL_GRADE', data: { applyFixation: specialGradeTwoIncrements }, priority: 3 });
    promotions.forEach(p => p.date && events.push({ date: parseDateUTC(p.date)!, type: 'PROMOTION', data: p, priority: 3 }));
    accountTestPasses.forEach(at => at.passDate && events.push({ date: parseDateUTC(at.passDate)!, type: 'ACCOUNT_TEST_PASS', data: at, priority: 3}));
    PAY_REVISIONS_2010.forEach(rev => events.push({ date: new Date('2010-08-01T00:00:00Z'), type: 'PAY_REVISION_2010', data: rev, priority: 3 }));
    
    // --- 4. THE SIMULATION LOOP ---
    const yearlyCalculationsMap: Map<number, PayrollPeriod[]> = new Map();
    let currentDate = new Date(doj);
    let currentDaRate = 0;
    const sortedIncrementChanges = [...annualIncrementChanges].filter(c => c.effectiveDate).sort((a, b) => parseDateUTC(a.effectiveDate)!.getTime() - parseDateUTC(b.effectiveDate)!.getTime());
    
    let incrementsGranted = 0;
    let nextScheduledIncrementDate: Date | null = null;
    if (doj && sortedIncrementChanges.length > 0) {
        const firstIncrementMonthName = sortedIncrementChanges[0].incrementMonth;
        const firstEligibleDate = new Date(doj);
        firstEligibleDate.setUTCMonth(firstEligibleDate.getUTCMonth() + (incrementEligibilityMonths ?? 6));
        
        const firstIncrementMonth = { 'jan': 0, 'apr': 3, 'jul': 6, 'oct': 9 }[firstIncrementMonthName];
        
        let year = firstEligibleDate.getUTCFullYear();
        
        if (firstEligibleDate.getUTCMonth() > firstIncrementMonth) {
            year++;
        }
        nextScheduledIncrementDate = new Date(Date.UTC(year, firstIncrementMonth, 1));
        if (totalBreakDays > 0) {
            nextScheduledIncrementDate.setUTCDate(nextScheduledIncrementDate.getUTCDate() + totalBreakDays);
        }
    }


    while (currentDate <= calcEndDate) {
        let remarks: string[] = [];
        let didIncrementThisMonth = false;

        // --- Process Events for the current month ---
        const monthEvents = events.filter(e => e.date.getUTCFullYear() === currentDate.getUTCFullYear() && e.date.getUTCMonth() === currentDate.getUTCMonth()).sort((a,b) => a.priority - b.priority);
        
        for (const event of monthEvents) {
            const eventDate = event.date;
            const eventType = event.type;
            
            // --- PAY COMMISSION FIXATION ---
            if (eventType === 'PAY_COMMISSION_4' && currentCommission === 3) {
                 const basicPay1986 = currentPay;
                 const daPortion = 0; // DA merger for 4th PC was complex. Simplified here.
                 const totalPay = basicPay1986 + daPortion;
                 const corresponding4thPCScale = PAY_SCALES_4TH_PC.find(s => s.id.endsWith(currentScaleString!)); // Heuristic match
                 if(!corresponding4thPCScale) throw new Error(`Could not map 3rd PC scale ${currentScaleString} to 4th PC.`);
                 currentPay = findNextHigherStageInScale(totalPay, corresponding4thPCScale.scale);
                 currentScaleString = corresponding4thPCScale.scale;
                 currentCommission = 4;
                 fixation4thPC = { basicPay1986, daPortion, totalPay, initialRevisedPay: currentPay };
                 remarks.push(`Pay fixed in 4th Pay Commission. (Ref: ${TN_GOVERNMENT_ORDERS.FOURTH_PC.IMPLEMENTATION})`);
            }
             if (eventType === 'PAY_COMMISSION_5' && currentCommission === 4) {
                 const basicPay1995 = currentPay;
                 const daPortion = 958; // DA as on 1.1.96 + IR amounts
                 const interimRelief = 100;
                 const totalPay = basicPay1995 + daPortion + interimRelief;
                 const corresponding5thPCScale = PAY_SCALES_5TH_PC.find(s => s.id.endsWith(currentScaleString!)); // Heuristic match
                 if(!corresponding5thPCScale) throw new Error(`Could not map 4th PC scale ${currentScaleString} to 5th PC.`);
                 currentPay = findNextHigherStageInScale(totalPay, corresponding5thPCScale.scale);
                 currentScaleString = corresponding5thPCScale.scale;
                 currentOrdinaryScaleString = currentScaleString;
                 currentCommission = 5;
                 fixation5thPC = { basicPay1995, daPortion, totalPay, interimRelief, initialRevisedPay: currentPay };
                 remarks.push(`Pay fixed in 5th Pay Commission. (Ref: ${TN_GOVERNMENT_ORDERS.FIFTH_PC.IMPLEMENTATION})`);
            }

            if (eventType === 'PAY_COMMISSION_6' && currentCommission === 5) {
                const basicPay2005 = currentPay;
                const multipliedPay = Math.round(basicPay2005 * FITMENT_MULTIPLIER_6TH_PC_TN);
                const scaleInfo = PAY_SCALES_6TH_PC.find(s => s.scale === currentScaleString);
                if (!scaleInfo) throw new Error(`Could not map 5th PC scale ${currentScaleString} to 6th PC.`);
                
                currentPipb = multipliedPay;
                currentGradePay = scaleInfo.gradePay;
                currentPay = currentPipb + currentGradePay;
                currentCommission = 6;
                fixation6thPC = { basicPay2005, multipliedPay, initialPayInPayBand: currentPipb, initialGradePay: currentGradePay, initialRevisedBasicPay: currentPay };
                remarks.push(`Pay fixed in 6th Pay Commission. (Ref: ${TN_GOVERNMENT_ORDERS.SIXTH_PC.IMPLEMENTATION})`);
            }

            if (eventType === 'PAY_COMMISSION_7' && currentCommission === 6) {
                const oldBasicPay = currentPay;
                const multipliedPay = Math.round(oldBasicPay * FITMENT_FACTOR_7TH_PC);
                const levelFor7PC = GRADE_PAY_TO_LEVEL[currentGradePay!];
                if (!levelFor7PC) throw new Error(`Could not find a level for Grade Pay ${currentGradePay} at 7th PC transition.`);
                
                currentLevel = levelFor7PC;
                currentPay = findPayInMatrix(multipliedPay, currentLevel);
                currentPipb = undefined;
                currentGradePay = undefined;
                currentCommission = 7;
                fixation7thPC = { oldBasicPay, multipliedPay, initialRevisedPay: currentPay, level: currentLevel };
                remarks.push(`Pay fixed in 7th Pay Commission. (Ref: ${TN_GOVERNMENT_ORDERS.SEVENTH_PC.IMPLEMENTATION})`);
                remarks.push(`CCA abolished and merged with Basic Pay in 7th PC.`);
            }

            if(eventType === 'DA_CHANGE') {
                const daData = event.data;
                 if (daData.commission === currentCommission || (currentCommission < 6 && daData.commission === 5) ) { // 3rd/4th PC followed 5th PC DA pattern pre-2006
                    currentDaRate = employeeDetails.daOverride ?? daData.rate;
                    if(employeeDetails.daOverride) remarks.push(`DA Override applied.`);
                 }
            }
            
            if(eventType === 'ACCOUNT_TEST_PASS') {
                accountTestIncrementPending = true;
                remarks.push(`Account Test Passed on ${event.date.toLocaleDateString('en-GB')}. Increment due on next regular increment date.`);
            }

            // --- Other Events (Promotions, Increments etc.) ---
             if (eventType.startsWith('PAY_REVISION_2010') && currentCommission === 6 && (event.data as PayRevision2010).postId === currentPostId) {
                // ... logic as before ...
            }

            if ((eventType === 'SELECTION_GRADE' || eventType === 'SPECIAL_GRADE') && !didIncrementThisMonth) {
                const eventName = eventType.replace('_', ' ');
                const oldPay = currentPay;
                const isSelection = eventType === 'SELECTION_GRADE';

                if (currentCommission < 6) {
                    if (currentCommission === 5 && event.data.applyFixation && currentOrdinaryScaleString) {
                         const gradeType = isSelection ? 'selection' : 'special';
                         const scaleMapping = FIFTH_PC_SG_SP_GRADE_MAPPING[currentOrdinaryScaleString];
                         const newScaleString = scaleMapping ? scaleMapping[gradeType] : undefined;
                         
                         if (newScaleString) {
                            const newPay = findNextHigherStageInScale(oldPay, newScaleString);
                            remarks.push(`${eventName}: Pay moved from scale ${currentScaleString} to ${newScaleString}. Old Pay: ${formatCurrency(oldPay)}, New Pay: ${formatCurrency(newPay)}. (Ref: ${TN_GOVERNMENT_ORDERS.FIFTH_PC.SELECTION_SPECIAL_GRADE}).`);
                            currentPay = newPay;
                            currentScaleString = newScaleString;
                         } else {
                            currentPay = getIncrementInScale(oldPay, currentScaleString, 1);
                             remarks.push(`${eventName} (1 increment) applied. No scale mapping found for ordinary scale ${currentOrdinaryScaleString}.`);
                         }
                    } else if (currentScaleString) {
                        currentPay = getIncrementInScale(oldPay, currentScaleString, 1);
                        remarks.push(`${eventName} (1 increment) applied.`);
                    }
                } else { // 6th or 7th PC
                     const steps = event.data.applyFixation ? 2 : 1;
                     const { newPay, newPipb } = getIncrement(oldPay, currentLevel, steps, currentCommission, currentGradePay);
                     currentPay = newPay;
                     if (newPipb !== undefined) currentPipb = newPipb;
                     const ref = currentCommission === 6 ? TN_GOVERNMENT_ORDERS.SIXTH_PC.SELECTION_SPECIAL_GRADE : TN_GOVERNMENT_ORDERS.SEVENTH_PC.SELECTION_SPECIAL_GRADE;
                     remarks.push(`${eventName} (${steps} increment${steps > 1 ? 's' : ''}) applied. Old: ${formatCurrency(oldPay)}, New: ${formatCurrency(newPay)}. (Ref: ${ref})`);
                }
                didIncrementThisMonth = true;
                if(isSelection) incrementAnalysis.selectionGrade++; else incrementAnalysis.specialGrade++;
                incrementAnalysis.total++;
            } 

            if (eventType === 'PROMOTION' && !didIncrementThisMonth) {
                const promoData = event.data as Promotion;
                const oldPay = currentPay;
                remarks.push(`Promotion to ${promoData.post}.`);
                incrementAnalysis.promotion++;
                incrementAnalysis.total++;

                if (currentCommission === 7) {
                    const { newPay: notionallyIncrementedPay } = getIncrement(oldPay, currentLevel, 1, 7);
                    const newLevel = parseInt(promoData.level!, 10);
                    if (isNaN(newLevel) || !PAY_MATRIX[newLevel]) throw new Error(`Invalid level for promotion: ${promoData.level}`);
                    currentPay = findPayInMatrix(notionallyIncrementedPay, newLevel);
                    currentLevel = newLevel;
                    remarks.push(`Pay fixed on promotion: Notional increment to ${formatCurrency(notionallyIncrementedPay)}, fixed in new Level ${newLevel} at ${formatCurrency(currentPay)}.`);
                } else if (currentCommission === 6) {
                     const { newPay: notionallyIncrementedPay, newPipb: notionallyIncrementedPipb } = getIncrement(oldPay, 0, 1, 6, currentGradePay);
                     const newScaleInfo = PAY_SCALES_6TH_PC.find(s => s.gradePay === promoData.gradePay);
                     if(!newScaleInfo) throw new Error(`Invalid Grade Pay for promotion: ${promoData.gradePay}`);
                     currentGradePay = newScaleInfo.gradePay;
                     currentPipb = Math.max(notionallyIncrementedPipb!, PAY_BAND_LIMITS_6TH_PC[currentGradePay].min);
                     currentPay = currentPipb + currentGradePay;
                     remarks.push(`Pay fixed on promotion: Notional increment to ${formatCurrency(notionallyIncrementedPay)}, fixed in new GP ${currentGradePay} at ${formatCurrency(currentPay)}.`);
                } else { // 3rd, 4th, 5th PC
                    const notionallyIncrementedPay = getIncrementInScale(oldPay, currentScaleString!, 1);
                    // This is a simplification; promotion to a specific scale is needed.
                    remarks.push(`Promotion logic for pre-2006 is simplified. Notional increment applied.`);
                    currentPay = notionallyIncrementedPay;
                }
                didIncrementThisMonth = true;
            }
        } // End of event loop for the month

        // --- Annual Increment ---
        if (nextScheduledIncrementDate && currentDate >= nextScheduledIncrementDate && !didIncrementThisMonth) {
            const eligibility = calculateProbationIncrementEligibility({
                ...data,
                incrementNumber: incrementsGranted + 1,
                normalIncrementDate: nextScheduledIncrementDate,
                testPassedDate: parseDateUTC(data.testPassedDate),
                probationStartDate: parseDateUTC(data.probationStartDate)!
            });

            if (eligibility.eligible && currentDate >= eligibility.effectiveDate) {
                // Regular Increment
                if(currentCommission < 6) {
                    currentPay = getIncrementInScale(currentPay, currentScaleString!);
                } else {
                    const { newPay, newPipb } = getIncrement(currentPay, currentLevel, 1, currentCommission, currentGradePay);
                    currentPay = newPay;
                    if(newPipb !== undefined) currentPipb = newPipb;
                }
                remarks.push(`Annual Increment #${incrementsGranted + 1} applied. ${eligibility.remarks}`);
                incrementsGranted++;
                incrementAnalysis.regular++;
                incrementAnalysis.total++;

                // Account Test Increment (if pending)
                if (accountTestIncrementPending) {
                     if(currentCommission < 6) {
                        currentPay = getIncrementInScale(currentPay, currentScaleString!);
                    } else {
                        const { newPay, newPipb } = getIncrement(currentPay, currentLevel, 1, currentCommission, currentGradePay);
                        currentPay = newPay;
                        if(newPipb !== undefined) currentPipb = newPipb;
                    }
                    remarks.push(`Additional increment for passing Account Test applied.`);
                    accountTestIncrementPending = false;
                    incrementAnalysis.accountTest++;
                    incrementAnalysis.total++;
                }

                didIncrementThisMonth = true;

                const applicableChange = sortedIncrementChanges.filter(c => parseDateUTC(c.effectiveDate)! <= currentDate).pop() || sortedIncrementChanges[sortedIncrementChanges.length - 1];
                const nextMonth = { 'jan': 0, 'apr': 3, 'jul': 6, 'oct': 9 }[applicableChange.incrementMonth];

                const nextDate = new Date(nextScheduledIncrementDate);
                nextDate.setUTCFullYear(nextDate.getUTCFullYear() + 1);
                nextDate.setUTCMonth(nextMonth);
                nextScheduledIncrementDate = nextDate;

            } else if (!eligibility.eligible) {
                remarks.push(`Annual Increment #${incrementsGranted + 1} withheld. Reason: ${eligibility.remarks}`);
            }
        }
        
        // --- Store Monthly Calculation ---
        if (currentDate >= calcStartDate) {
            const year = currentDate.getUTCFullYear();
            if (!yearlyCalculationsMap.has(year)) yearlyCalculationsMap.set(year, []);

            const daAmount = Math.round(currentPay * (currentDaRate / 100));
            const hra = getHra(currentPay, cityGrade, currentDate);
            const cca = currentCommission >= 7 ? 0 : (CCA_RATES[cityClass] || 0);
            const medicalAllowance = employeeDetails.medicalAllowance || 0;
            const grossPay = currentPay + daAmount + hra + cca + medicalAllowance;
            
            const deductions: Deduction[] = [];
            const cpsGpfAmount = Math.round((currentPay + daAmount) * (employeeDetails.cpsGpfContributionRate / 100));
            deductions.push({ name: 'CPS/GPF', amount: cpsGpfAmount });
            if (employeeDetails.professionalTax > 0) {
                 deductions.push({ name: 'Professional Tax', amount: employeeDetails.professionalTax });
            }
            if (employeeDetails.gisContribution > 0) {
                 deductions.push({ name: 'GIS', amount: employeeDetails.gisContribution });
            }
            
            const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);
            const netPay = grossPay - totalDeductions;

            yearlyCalculationsMap.get(year)!.push({
                period: currentDate.toLocaleString('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' }),
                basicPay: currentPay,
                daRate: currentDaRate,
                daAmount,
                hra,
                cca,
                medicalAllowance,
                grossPay,
                deductions,
                totalDeductions,
                netPay,
                remarks,
                commission: currentCommission,
                payInPayBand: currentPipb,
                gradePay: currentGradePay
            });
        }
        
        // Advance to next month
        currentDate.setUTCMonth(currentDate.getUTCMonth() + 1);
    } // End of main simulation loop

    // --- 5. FORMAT FINAL OUTPUT ---
    const yearlyCalculations = Array.from(yearlyCalculationsMap.entries()).map(([year, periods]) => ({ year, periods }));
    
    let probationPeriod: string = data.probationPeriodType;
    let probationEndsOn: string | undefined;
    const probationStartDate = parseDateUTC(data.probationStartDate);

    if (probationStartDate) {
        let monthsToAdd = 0;
        if (data.probationPeriodType === '1 Year') {
            monthsToAdd = 12;
        } else if (data.probationPeriodType === '2 Years') {
            monthsToAdd = 24;
        } else {
            probationPeriod = `${data.probationPeriodMonths} Months (Custom)`;
            monthsToAdd = data.probationPeriodMonths || 0;
        }
        const endDate = new Date(probationStartDate);
        endDate.setUTCMonth(endDate.getUTCMonth() + monthsToAdd);
        endDate.setUTCDate(endDate.getUTCDate() - 1);
        probationEndsOn = endDate.toLocaleDateString('en-GB', { timeZone: 'UTC' });
    }

    let testDetails = 'Not Required';
    if(data.hasTestRequirement) {
        testDetails = `${data.testType || ''} (${data.testName || 'N/A'}) - Status: ${data.testStatus}`;
        if (data.testStatus === 'Passed') {
            testDetails += ` on ${parseDateUTC(data.testPassedDate)?.toLocaleDateString('en-GB', { timeZone: 'UTC' })}`;
        }
    }

    
    const retirementDateStr = employeeDetails.dateOfBirth ? new Date(Date.UTC(parseDateUTC(employeeDetails.dateOfBirth)!.getUTCFullYear() + parseInt(employeeDetails.retirementAge, 10), parseDateUTC(employeeDetails.dateOfBirth)!.getUTCMonth() + 1, 0)).toLocaleDateString('en-GB', { timeZone: 'UTC' }) : 'N/A';
    const joiningPostName = joiningPostId === 'custom' ? joiningPostCustomName : POSTS.find(p => p.id === joiningPostId)?.name;
    
    return {
        employeeDetails: {
            ...employeeDetails,
            dateOfBirth: parseDateUTC(employeeDetails.dateOfBirth)!.toLocaleDateString('en-GB', { timeZone: 'UTC' }),
            dateOfJoining: doj.toLocaleDateString('en-GB', { timeZone: 'UTC' }),
            dateOfJoiningInOffice: parseDateUTC(employeeDetails.dateOfJoiningInOffice)!.toLocaleDateString('en-GB', { timeZone: 'UTC' }),
            dateOfRelief: reliefDate ? reliefDate.toLocaleDateString('en-GB', { timeZone: 'UTC' }) : undefined,
            retirementDate: retirementDateStr,
            joiningPost: joiningPostName || 'N/A',
            promotions: promotions.map(p => ({post: p.post, date: parseDateUTC(p.date)!.toLocaleDateString('en-GB', { timeZone: 'UTC' })})),
            payRevisions: appliedRevisions.map(r => ({ description: r.description, date: r.date.toLocaleDateString('en-GB', { timeZone: 'UTC' }) })),
            selectionGradeDate: selectionGradeDate ? parseDateUTC(selectionGradeDate)!.toLocaleDateString('en-GB', { timeZone: 'UTC' }) : undefined,
            specialGradeDate: specialGradeDate ? parseDateUTC(specialGradeDate)!.toLocaleDateString('en-GB', { timeZone: 'UTC' }) : undefined,
            accountTestPasses: accountTestPasses.map(at => ({
                passDate: parseDateUTC(at.passDate)!.toLocaleDateString('en-GB', {timeZone: 'UTC'}),
                description: at.description
            })),
            probationPeriod,
            probationEndsOn,
            hasTestRequirement: data.hasTestRequirement,
            testDetails
        },
        fixation4thPC,
        fixation5thPC,
        fixation6thPC,
        fixation7thPC,
        yearlyCalculations,
        appliedRevisions,
        incrementAnalysis,
    };
};
