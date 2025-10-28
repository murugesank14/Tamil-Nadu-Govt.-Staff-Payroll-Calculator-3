import { CityGrade, CityClass, PayScale, Post, PayRevision2010, PayScale5thPC, PayScale4thPC, PayScale3rdPC } from './types';

export const TN_GOVERNMENT_ORDERS = {
    // Fix: Added FOURTH_PC object to resolve property access error in payrollService.
    FOURTH_PC: {
        IMPLEMENTATION: 'G.O.Ms.No.555, Finance (Pay Cell) Dept, dated 10.06.1985',
    },
    FIFTH_PC: {
        IMPLEMENTATION: 'G.O.Ms.No.162, Finance (Pay Cell) Dept, dated 13.04.1998',
        SELECTION_SPECIAL_GRADE: 'G.O.(Ms) No.162, Finance (Pay Cell) Department, dated 13-04-1998, Schedule-II'
    },
    SIXTH_PC: {
        IMPLEMENTATION: 'G.O.Ms.No.234, Finance (Pay Cell) Dept, dated 01.06.2009',
        SELECTION_SPECIAL_GRADE: 'G.O.Ms.No.237, Finance (Pay Cell) Dept, dated 22.07.2013'
    },
    SEVENTH_PC: {
        IMPLEMENTATION: 'G.O.Ms.No.303, Finance (Pay Cell) Dept, dated 11.10.2017',
        SELECTION_SPECIAL_GRADE: 'G.O.Ms.No.303/2017, Para 15'
    },
    PROBATION: {
        INCREMENT_RULES: 'G.O.Ms.No.35998/D.O-I-FRI/93-3, PAR Dept',
        GENERAL_RULE: 'Rule 28 of General Rules',
        CONDITIONS_OF_SERVICE: 'Section 31(4), TN Govt Servants Act 2016'
    },
    STAGNATION: {
        RULE: 'Fundamental Rule 26 - Stagnation Increments'
    }
};

export const PAY_BAND_LIMITS_6TH_PC: { [gradePay: number]: { min: number, max: number } } = {
    1300: { min: 4800, max: 10000 }, 1400: { min: 4800, max: 10000 }, 1650: { min: 4800, max: 10000 },
    1800: { min: 5200, max: 20200 }, 1900: { min: 5200, max: 20200 }, 2000: { min: 5200, max: 20200 },
    2200: { min: 5200, max: 20200 }, 2400: { min: 5200, max: 20200 }, 2600: { min: 5200, max: 20200 }, 
    2800: { min: 5200, max: 20200 },
    4200: { min: 9300, max: 34800 }, 4300: { min: 9300, max: 34800 }, 4400: { min: 9300, max: 34800 },
    4450: { min: 9300, max: 34800 }, 4500: { min: 9300, max: 34800 }, 4600: { min: 9300, max: 34800 },
    4700: { min: 9300, max: 34800 }, 4800: { min: 9300, max: 34800 }, 4900: { min: 9300, max: 34800 },
    5100: { min: 9300, max: 34800 },
    5400: { min: 15600, max: 39100 }, 5700: { min: 15600, max: 39100 }, 6000: { min: 15600, max: 39100 },
    6600: { min: 15600, max: 39100 }, 7600: { min: 15600, max: 39100 }, 7700: { min: 15600, max: 39100 },
    8700: { min: 37400, max: 67000 }, 8800: { min: 37400, max: 67000 }, 8900: { min: 37400, max: 67000 },
    10000: { min: 37400, max: 67000 },
};


// Sorted by Level for easier dropdown navigation
export const POSTS: Post[] = [
    { id: 'office-assistant', name: 'Office Assistant', scaleId: 'PB1A-1300', level: 1 },
    { id: 'record-clerk', name: 'Record Clerk', scaleId: 'PB1A-1400', level: 2 },
    { id: 'record-assistant', name: 'Record Assistant', scaleId: 'PB1A-1400', level: 2 },
    { id: 'lab-asst-collegiate', name: 'Laboratory Assistant (Collegiate Education)', scaleId: 'PB1-1900', level: 5 },
    { id: 'assistant-secretariat', name: 'Assistant (Secretariat)', scaleId: 'PB1-2200', level: 7 },
    { id: 'jeep-driver', name: 'Jeep Driver', scaleId: 'PB1-2400', level: 8 },
    { id: 'junior-assistant', name: 'Junior Assistant', scaleId: 'PB1-2400', level: 8 },
    { id: 'asst-agri-officer', name: 'Assistant Agricultural Officer', scaleId: 'PB1-2400', level: 8 },
    { id: 'panchayat-clerk', name: 'Panchayat Clerk', scaleId: 'PB1-2400', level: 8 },
    { id: 'typist', name: 'Typist', scaleId: 'PB1-2400', level: 8 },
    { id: 'steno-typist-g3', name: 'Steno-Typist Grade-III', scaleId: 'PB1-2400', level: 8 },
    { id: 'assistant', name: 'Assistant', scaleId: 'PB2-4200', level: 11 },
    { id: 'accountant', name: 'Accountant', scaleId: 'PB2-4200', level: 11 },
    { id: 'superintendent', name: 'Superintendent', scaleId: 'PB2-4400', level: 13 },
    { id: 'jr-employment-officer', name: 'Junior Employment Officer', scaleId: 'PB2-4400', level: 13 },
    { id: 'manager', name: 'Manager', scaleId: 'PB2-4400', level: 13 },
    { id: 'assistant-inspector', name: 'Assistant Inspector', scaleId: 'PB2-4600', level: 16 },
    { id: 'deputy-inspector', name: 'Deputy Inspector', scaleId: 'PB2-4800', level: 18 },
    { id: 'inspector', name: 'Inspector', scaleId: 'PB3-5400', level: 22 },
    { id: 'assistant-director', name: 'Assistant Director', scaleId: 'PB3-6600', level: 25 },
    { id: 'deputy-director', name: 'Deputy Director', scaleId: 'PB3-7600', level: 26 },
];

export const PAY_REVISIONS_2010: PayRevision2010[] = [
  {
    postId: 'assistant-secretariat',
    revisedScaleId: 'PB1-2400',
    revisedLevel: 8,
    description: 'Pay revised from GP 2200 to GP 2400 (G.O.Ms.No.256)',
  },
  {
    postId: 'asst-agri-officer',
    revisedScaleId: 'PB1-2800',
    revisedLevel: 10,
    description: 'Pay revised from GP 2400 to GP 2800 (G.O.Ms.No.258)',
  },
  {
    postId: 'jr-employment-officer',
    revisedScaleId: 'PB2-4800',
    revisedLevel: 18,
    description: 'Pay revised from GP 4400 to GP 4800 (G.O.Ms.No.274)',
  },
  {
    postId: 'lab-asst-collegiate',
    revisedScaleId: 'PB2-4200',
    revisedLevel: 11,
    description: 'Pay revised from GP 1900 to GP 4200 (G.O.Ms.No.271)',
  },
];


export const GRADE_PAY_OPTIONS: number[] = [
    1300, 1400, 1650, 1800, 1900, 2000, 2200, 2400, 2600, 2800, 4200, 4300, 
    4400, 4450, 4500, 4600, 4700, 4800, 4900, 5100, 5200, 5400, 5700, 6000, 
    6600, 7600, 7700, 8700, 8800, 8900, 9500, 10000
];

export const GRADE_PAY_TO_LEVEL: { [key: number]: number } = {
    1300: 1, 1400: 2, 1650: 3, 1800: 4, 1900: 5, 2000: 6, 2200: 7, 2400: 8,
    2600: 9, 2800: 10, 4200: 11, 4300: 12, 4400: 13, 4450: 14, 4500: 15,
    4600: 16, 4700: 17, 4800: 18, 4900: 19, 5100: 20, 5200: 21, 5400: 22,
    5700: 23, 6000: 24, 6600: 25, 7600: 26, 7700: 27, 8700: 28, 8800: 29,
    8900: 30, 9500: 31, 10000: 32
};

export const PAY_MATRIX: { [level: number]: number[] } = {
    1: [15700, 16200, 16700, 17200, 17700, 18200, 18700, 19300, 19900, 20500, 21100, 21700, 22400, 23100, 23800, 24500, 25200, 26000, 26800, 27600, 28400, 29300, 30200, 31100, 32000, 33000, 34000, 35000, 36100, 37200, 38300, 39400, 40600, 41800, 43100, 44400, 45700, 47100, 48500, 50000],
    2: [15900, 16400, 16900, 17400, 17900, 18400, 19000, 19600, 20200, 20800, 21400, 22000, 22700, 23400, 24100, 24800, 25500, 26300, 27100, 27900, 28700, 29600, 30500, 31400, 32300, 33300, 34300, 35300, 36400, 37500, 38600, 39800, 41000, 42200, 43500, 44800, 46100, 47500, 48900, 50400],
    3: [16600, 17100, 17600, 18100, 18600, 19200, 19800, 20400, 21000, 21600, 22200, 22900, 23600, 24300, 25000, 25800, 26600, 27400, 28200, 29000, 29900, 30800, 31700, 32700, 33700, 34700, 35700, 36800, 37900, 39000, 40200, 41400, 42600, 43900, 45200, 46600, 48000, 49400, 50900, 52400],
    4: [18000, 18500, 19100, 19700, 20300, 20900, 21500, 22100, 22800, 23500, 24200, 24900, 25600, 26400, 27200, 28000, 28800, 29700, 30600, 31500, 32400, 33400, 34400, 35400, 36500, 37600, 38700, 39900, 41100, 42300, 43600, 44900, 46200, 47600, 49000, 50500, 52000, 53600, 55200, 56900],
    5: [18200, 18700, 19300, 19900, 20500, 21100, 21700, 22400, 23100, 23800, 24500, 25200, 26000, 26800, 27600, 28400, 29300, 30200, 31100, 32000, 33000, 34000, 35000, 36100, 37200, 38300, 39400, 40600, 41800, 43100, 44400, 45700, 47100, 48500, 50000, 51500, 53000, 54600, 56200, 57900],
    6: [18500, 19100, 19700, 20300, 20900, 21500, 22100, 22800, 23500, 24200, 24900, 25600, 26400, 27200, 28000, 28800, 29700, 30600, 31500, 32400, 33400, 34400, 35400, 36500, 37600, 38700, 39900, 41100, 42300, 43600, 44900, 46200, 47600, 49000, 50500, 52000, 53600, 55200, 56900, 58600],
    7: [19000, 19600, 20200, 20800, 21400, 22000, 22700, 23400, 24100, 24800, 25500, 26300, 27100, 27900, 28700, 29600, 30500, 31400, 32300, 33300, 34300, 35300, 36400, 37500, 38600, 39800, 41000, 42200, 43500, 44800, 46100, 47500, 48900, 50400, 51900, 53500, 55100, 56800, 58500, 60300],
    8: [19500, 20100, 20700, 21300, 21900, 22600, 23300, 24000, 24700, 25400, 26200, 27000, 27800, 28600, 29500, 30400, 31300, 32200, 33200, 34200, 35200, 36300, 37400, 38500, 39700, 40900, 42100, 43400, 44700, 46000, 47400, 48800, 50300, 51800, 53400, 55000, 56700, 58400, 60200, 62000],
    9: [20000, 20600, 21200, 21800, 22500, 23200, 23900, 24600, 25300, 26100, 26900, 27700, 28500, 29400, 30300, 31200, 32100, 33100, 34100, 35100, 36200, 37300, 38400, 39600, 40800, 42000, 43300, 44600, 45900, 47300, 48700, 50200, 51700, 53300, 54900, 56500, 58200, 59900, 61700, 63600],
    10: [20600, 21200, 21800, 22500, 23200, 23900, 24600, 25300, 26100, 26900, 27700, 28500, 29400, 30300, 31200, 32100, 33100, 34100, 35100, 36200, 37300, 38400, 39600, 40800, 42000, 43300, 44600, 45900, 47300, 48700, 50200, 51700, 53300, 54900, 56500, 58200, 59900, 61700, 65500],
    11: [35400, 36500, 37600, 38700, 39900, 41100, 42300, 43600, 44900, 46200, 47600, 49000, 50500, 52000, 53600, 55200, 56900, 58600, 60400, 62200, 64100, 66000, 68000, 70000, 72100, 74300, 76500, 78800, 81200, 83600, 86100, 88700, 91400, 94100, 96900, 99800, 102800, 105900, 109100, 112400],
    12: [35600, 36700, 37800, 38900, 40100, 41300, 42500, 43800, 45100, 46500, 47900, 49300, 50800, 52300, 53900, 55500, 57200, 58900, 60700, 62500, 64400, 66300, 68300, 70300, 72400, 74600, 76800, 79100, 81500, 83900, 86400, 89000, 91700, 94500, 97300, 100200, 103200, 106300, 109500, 112800],
    13: [35900, 37000, 38100, 39200, 40400, 41600, 42800, 44100, 45400, 46800, 48200, 49600, 51100, 52600, 54200, 55800, 57500, 59200, 61000, 62800, 64700, 66600, 68600, 70700, 72800, 75000, 77300, 79600, 82000, 84500, 87000, 89600, 92300, 95100, 98000, 100900, 103900, 107000, 110200, 113500],
    14: [36000, 37100, 38200, 39300, 40500, 41700, 43000, 44300, 45600, 47000, 48400, 49900, 51400, 52900, 54500, 56100, 57800, 59500, 61300, 63100, 65000, 67000, 69000, 71100, 73200, 75400, 77700, 80000, 82400, 84900, 87400, 90000, 92700, 95500, 98400, 101400, 104400, 107500, 110700, 114000],
    15: [36200, 37300, 38400, 39600, 40800, 42000, 43300, 44600, 45900, 47300, 48700, 50200, 51700, 53300, 54900, 56500, 58200, 59900, 61700, 63600, 65500, 67500, 69500, 71600, 73700, 75900, 78200, 80500, 82900, 85400, 88000, 90600, 93300, 96100, 99000, 102000, 105100, 108300, 111500, 114800],
    16: [36400, 37500, 38600, 39800, 41000, 42200, 43500, 44800, 46100, 47500, 48900, 50400, 51900, 53500, 55100, 56800, 58500, 60300, 62100, 64000, 65900, 67900, 69900, 72000, 74200, 76400, 78700, 81100, 83500, 86000, 88600, 91300, 94000, 96800, 99700, 102700, 105800, 109000, 112300, 115700],
    17: [36700, 37800, 38900, 40100, 41300, 42500, 43800, 45100, 46500, 47900, 49300, 50800, 52300, 53900, 55500, 57200, 58900, 60700, 62500, 64400, 66300, 68300, 70300, 72400, 74600, 76800, 79100, 81500, 83900, 86400, 89000, 91700, 94500, 97300, 100200, 103200, 106300, 109500, 112800, 116200],
    18: [36900, 38000, 39100, 40300, 41500, 42700, 44000, 45300, 46700, 48100, 49500, 51000, 52500, 54100, 55700, 57400, 59100, 60900, 62700, 64600, 66500, 68500, 70600, 72700, 74900, 77100, 79400, 81800, 84300, 86800, 89400, 92100, 94900, 97700, 100600, 103600, 106700, 109900, 113200, 116600],
    19: [37200, 38300, 39400, 40600, 41800, 43100, 44400, 45700, 47100, 48500, 50000, 51500, 53000, 54600, 56200, 57900, 59600, 61400, 63200, 65100, 67100, 69100, 71200, 73300, 75500, 77800, 80100, 82500, 85000, 87600, 90200, 92900, 95700, 98600, 101600, 104600, 107700, 110900, 114200, 117600],
    20: [37700, 38800, 40000, 41200, 42400, 43700, 45000, 46400, 47800, 49200, 50700, 52200, 53800, 55400, 57100, 58800, 60600, 62400, 64300, 66200, 68200, 70200, 72300, 74500, 76700, 79000, 81400, 83800, 86300, 88900, 91600, 94300, 97100, 100000, 103000, 106100, 109300, 112600, 116000, 119500],
    21: [55500, 57200, 58900, 60700, 62500, 64400, 66300, 68300, 70300, 72400, 74600, 76800, 79100, 81500, 83900, 86400, 89000, 91700, 94500, 97300, 100200, 103200, 106300, 109500, 112800, 116200, 119700, 123300, 127000, 130800, 134700, 138700, 142900, 147200, 151600, 156100, 160800, 165600, 170600, 175700],
    22: [56100, 57800, 59500, 61300, 63100, 65000, 67000, 69000, 71100, 73200, 75400, 77700, 80000, 82400, 84900, 87400, 90000, 92700, 95500, 98400, 101400, 104400, 107500, 110700, 114000, 117400, 120900, 124500, 128200, 132000, 136000, 140100, 144300, 148600, 153100, 157700, 162400, 167300, 172300, 177500],
    23: [56900, 58600, 60400, 62200, 64100, 66000, 68000, 70000, 72100, 74300, 76500, 78800, 81200, 83600, 86100, 88700, 91400, 94100, 96900, 99800, 102800, 105900, 109100, 112400, 115800, 119300, 122900, 126600, 130400, 134300, 138300, 142400, 146700, 151100, 155600, 160300, 165100, 170100, 175200, 180500],
    24: [57700, 59400, 61200, 63000, 64900, 66800, 68800, 70900, 73000, 75200, 77500, 79800, 82200, 84700, 87200, 89800, 92500, 95300, 98200, 101100, 104100, 107200, 110400, 113700, 117100, 120600, 124200, 127900, 131700, 135700, 139800, 144000, 148300, 152700, 157300, 162000, 166900, 171900, 177100, 182400],
    25: [59300, 61100, 62900, 64800, 66700, 68700, 70800, 72900, 75100, 77400, 79700, 82100, 84600, 87100, 89700, 92400, 95200, 98100, 101000, 104000, 107100, 110300, 113600, 117000, 120500, 124100, 127800, 131600, 135500, 139600, 143800, 148100, 152500, 157100, 161800, 166700, 171700, 176900, 182200, 187700],
    26: [61900, 63800, 65700, 67700, 69700, 71800, 74000, 76200, 78500, 80900, 83300, 85800, 88400, 91100, 93800, 96600, 99500, 102500, 105600, 108800, 112100, 115500, 119000, 122600, 126300, 130100, 134000, 138000, 142100, 146400, 150800, 155300, 160000, 164800, 169700, 174800, 180000, 185400, 191000, 196700],
    27: [62200, 64100, 66000, 68000, 70000, 72100, 74300, 76500, 78800, 81200, 83600, 86100, 88700, 91400, 94100, 96900, 99800, 102800, 105900, 109100, 112400, 115800, 119300, 122900, 126600, 130400, 134300, 138300, 142400, 146700, 151100, 155600, 160300, 165100, 170100, 175200, 180500, 185900, 191500, 197200],
    28: [123100, 126800, 130600, 134500, 138500, 142700, 147000, 151400, 155900, 160600, 165400, 170400, 175500, 180800, 186200, 191800, 197600, 203500, 209600, 215900],
    29: [123400, 127100, 130900, 134800, 138800, 143000, 147300, 151700, 156300, 161000, 165800, 170800, 175900, 181200, 186600, 192200, 198000, 203900, 210000, 216300],
    30: [123600, 127300, 131100, 135000, 139100, 143300, 147600, 152000, 156600, 161300, 166100, 171100, 176200, 181500, 186900, 192500, 198300, 204200, 210300, 216600],
    31: [125200, 129000, 132900, 136900, 141000, 145200, 149600, 154100, 158700, 163500, 168400, 173500, 178700, 184100, 189600, 195300, 201200, 207200, 213400, 219800],
    32: [128900, 132800, 136800, 140900, 145100, 149500, 154000, 158600, 163400, 168300, 173300, 178500, 183900, 189400, 195100, 201000, 207000, 213200, 219600, 225000]
};

export const LEVELS = Object.keys(PAY_MATRIX).map(Number);

export const PAY_SCALES_6TH_PC: PayScale[] = [
  { id: 'PB1A-1300', scale: '2550-55-2660-60-3200', payBand: 'PB-1A (4800-10000)', gradePay: 1300 },
  { id: 'PB1A-1400', scale: '2610-60-3150-65-3540', payBand: 'PB-1A (4800-10000)', gradePay: 1400 },
  { id: 'PB1A-1650', scale: '2650-65-3300-70-4000', payBand: 'PB-1A (4800-10000)', gradePay: 1650 },
  { id: 'PB1-1800', scale: '2750-70-3800-75-4400', payBand: 'PB-1 (5200-20200)', gradePay: 1800 },
  { id: 'PB1-1900', scale: '3050-75-3950-80-4590', payBand: 'PB-1 (5200-20200)', gradePay: 1900 },
  { id: 'PB1-2000', scale: '3200-85-4900', payBand: 'PB-1 (5200-20200)', gradePay: 2000 },
  { id: 'PB1-2200', scale: '3625-85-4900', payBand: 'PB-1 (5200-20200)', gradePay: 2200 },
  { id: 'PB1-2400', scale: '4000-100-6000', payBand: 'PB-1 (5200-20200)', gradePay: 2400 },
  { id: 'PB1-2600', scale: '4300-100-6000', payBand: 'PB-1 (5200-20200)', gradePay: 2600 },
  { id: 'PB1-2800', scale: '4500-125-7000', payBand: 'PB-1 (5200-20200)', gradePay: 2800 },
  { id: 'PB2-4200', scale: '5000-150-8000', payBand: 'PB-2 (9300-34800)', gradePay: 4200 },
  { id: 'PB2-4300', scale: '5300-150-8300', payBand: 'PB-2 (9300-34800)', gradePay: 4300 },
  { id: 'PB2-4400', scale: '5500-175-9000', payBand: 'PB-2 (9300-34800)', gradePay: 4400 },
  { id: 'PB2-4450', scale: '5700-175-9200', payBand: 'PB-2 (9300-34800)', gradePay: 4450 },
  { id: 'PB2-4500', scale: '5900-200-9900', payBand: 'PB-2 (9300-34800)', gradePay: 4500 },
  { id: 'PB2-4600', scale: '6500-200-10500', payBand: 'PB-2 (9300-34800)', gradePay: 4600 },
  { id: 'PB2-4700', scale: '6500-200-11100', payBand: 'PB-2 (9300-34800)', gradePay: 4700 },
  { id: 'PB2-4800', scale: '7000-225-11500', payBand: 'PB-2 (9300-34800)', gradePay: 4800 },
  { id: 'PB2-4900', scale: '7500-250-12000', payBand: 'PB-2 (9300-34800)', gradePay: 4900 },
  { id: 'PB3-5400', scale: '8000-275-13500', payBand: 'PB-3 (15600-39100)', gradePay: 5400 },
  { id: 'PB3-5700', scale: '9100-275-14050', payBand: 'PB-3 (15600-39100)', gradePay: 5700 },
  { id: 'PB3-6000', scale: '9650-300-15050', payBand: 'PB-3 (15600-39100)', gradePay: 6000 },
  { id: 'PB3-6600', scale: '10000-325-15200', payBand: 'PB-3 (15600-39100)', gradePay: 6600 },
  { id: 'PB3-7600', scale: '12000-375-16500', payBand: 'PB-3 (15600-39100)', gradePay: 7600 },
  { id: 'PB3-7700', scale: '12750-375-16500', payBand: 'PB-3 (15600-39100)', gradePay: 7700 },
  { id: 'PB4-8700', scale: '14300-400-18300', payBand: 'PB-4 (37400-67000)', gradePay: 8700 },
  { id: 'PB4-8800', scale: '15000-400-18600', payBand: 'PB-4 (37400-67000)', gradePay: 8800 },
  { id: 'PB4-8900', scale: '16400-450-20000', payBand: 'PB-4 (37400-67000)', gradePay: 8900 },
  { id: 'PB4-10000', scale: '17400-500-21900', payBand: 'PB-4 (37400-67000)', gradePay: 10000 },
];

// Fix: Added missing PAY_SCALES_4TH_PC export to resolve import errors.
export const PAY_SCALES_4TH_PC: PayScale4thPC[] = [
    { id: '4th_750_900', scale: '750-12-870-15-900' },
    { id: '4th_800_1150', scale: '800-15-950-20-1150' },
    { id: '4th_950_1500', scale: '950-20-1150-25-1500' },
    { id: '4th_1200_2040', scale: '1200-30-1560-40-2040' },
    { id: '4th_1350_2200', scale: '1350-30-1440-40-1800-50-2200' },
    { id: '4th_1640_2900', scale: '1640-60-2600-75-2900' },
];

// Fix: Added missing PAY_SCALES_3RD_PC export to resolve import errors.
export const PAY_SCALES_3RD_PC: PayScale3rdPC[] = [
    { id: '3rd_190_300', scale: '190-5-240-6-300' },
    { id: '3rd_200_350', scale: '200-5-250-6-280-7-350' },
    { id: '3rd_250_500', scale: '250-10-350-15-500' },
    { id: '3rd_400_700', scale: '400-15-460-20-600-25-700' },
    { id: '3rd_450_800', scale: '450-20-650-25-800' },
    { id: '3rd_600_900', scale: '600-25-750-30-900' },
];

export const PAY_SCALES_5TH_PC: PayScale5thPC[] = PAY_SCALES_6TH_PC.map(p => ({
    id: p.id,
    scale: p.scale,
}));

// This mapping determines the next pay scale for an employee receiving a Selection Grade or Special Grade award during the 5th Pay Commission period.
// Source: G.O.(Ms) No.162, Finance (Pay Cell) Department, dated 13-04-1998, Schedule-II.
export const FIFTH_PC_SG_SP_GRADE_MAPPING: { [key: string]: { selection?: string; special?: string } } = {
  "2550-55-2660-60-3200": { selection: "2650-65-3300-70-4000", special: "2750-70-3800-75-4400" },
  "2610-60-3150-65-3540": { selection: "2750-70-3800-75-4400", special: "3050-75-3950-80-4590" },
  "2650-65-3300-70-4000": { selection: "3050-75-3950-80-4590", special: "3200-85-4900" },
  "2750-70-3800-75-4400": { selection: "3050-75-3950-80-4590", special: "3200-85-4900" },
  "3050-75-3950-80-4590": { selection: "4000-100-6000", special: "4300-100-6000" },
  "3200-85-4900": { selection: "4000-100-6000", special: "4300-100-6000" },
  "3625-85-4900": { selection: "4300-100-6000", special: "4500-125-7000" },
  "4000-100-6000": { selection: "5000-150-8000", special: "5500-175-9000" },
  "4300-100-6000": { selection: "5000-150-8000", special: "5500-175-9000" },
  "4500-125-7000": { selection: "5300-150-8300", special: "5900-200-9900" },
  "5000-150-8000": { selection: "5500-175-9000", special: "6500-200-10500" },
  "5300-150-8300": { selection: "6500-200-10500", special: "8000-275-13500" },
  "5500-175-9000": { selection: "6500-200-10500", special: "8000-275-13500" },
  "5900-200-9900": { selection: "8000-275-13500", special: "9100-275-14050" },
  "6500-200-10500": { selection: "8000-275-13500", special: "9100-275-14050" },
  "6500-200-11100": { selection: "9100-275-14050", special: "10000-325-15200" },
  "8000-275-13500": { selection: "9100-275-14050", special: "10000-325-15200" },
  "9100-275-14050": { selection: "10000-325-15200", special: "12000-375-16500" },
};

const DA_RATES_5TH_PC = [
  { date: new Date('1998-01-01T00:00:00Z'), rate: 27, commission: 5 },
  { date: new Date('1998-07-01T00:00:00Z'), rate: 32, commission: 5 },
  { date: new Date('1999-01-01T00:00:00Z'), rate: 41, commission: 5 },
  { date: new Date('1999-07-01T00:00:00Z'), rate: 45, commission: 5 },
  { date: new Date('2000-01-01T00:00:00Z'), rate: 49, commission: 5 },
  { date: new Date('2001-01-01T00:00:00Z'), rate: 53, commission: 5 },
  { date: new Date('2001-07-01T00:00:00Z'), rate: 55, commission: 5 },
  { date: new Date('2002-01-01T00:00:00Z'), rate: 59, commission: 5 },
  { date: new Date('2002-07-01T00:00:00Z'), rate: 64, commission: 5 },
  { date: new Date('2003-01-01T00:00:00Z'), rate: 67, commission: 5 },
  { date: new Date('2003-07-01T00:00:00Z'), rate: 71, commission: 5 },
  { date: new Date('2004-01-01T00:00:00Z'), rate: 74, commission: 5 },
  { date: new Date('2004-07-01T00:00:00Z'), rate: 79, commission: 5 },
  { date: new Date('2005-01-01T00:00:00Z'), rate: 82, commission: 5 },
  { date: new Date('2005-07-01T00:00:00Z'), rate: 85, commission: 5 },
];


const DA_RATES_6TH_PC = [
  // 6th Pay Commission
  { date: new Date('2006-01-01T00:00:00Z'), rate: 0, commission: 6 },
  { date: new Date('2006-07-01T00:00:00Z'), rate: 2, commission: 6 },
  { date: new Date('2007-01-01T00:00:00Z'), rate: 6, commission: 6 },
  { date: new Date('2007-07-01T00:00:00Z'), rate: 9, commission: 6 },
  { date: new Date('2008-01-01T00:00:00Z'), rate: 12, commission: 6 },
  { date: new Date('2008-07-01T00:00:00Z'), rate: 16, commission: 6 },
  { date: new Date('2009-01-01T00:00:00Z'), rate: 22, commission: 6 },
  { date: new Date('2009-07-01T00:00:00Z'), rate: 27, commission: 6 },
  { date: new Date('2010-01-01T00:00:00Z'), rate: 35, commission: 6 },
  { date: new Date('2010-07-01T00:00:00Z'), rate: 45, commission: 6 },
  { date: new Date('2011-01-01T00:00:00Z'), rate: 51, commission: 6 },
  { date: new Date('2011-07-01T00:00:00Z'), rate: 58, commission: 6 },
  { date: new Date('2012-01-01T00:00:00Z'), rate: 65, commission: 6 },
  { date: new Date('2012-07-01T00:00:00Z'), rate: 72, commission: 6 },
  { date: new Date('2013-01-01T00:00:00Z'), rate: 80, commission: 6 },
  { date: new Date('2013-07-01T00:00:00Z'), rate: 90, commission: 6 },
  { date: new Date('2014-01-01T00:00:00Z'), rate: 100, commission: 6 },
  { date: new Date('2014-07-01T00:00:00Z'), rate: 107, commission: 6 },
  { date: new Date('2015-01-01T00:00:00Z'), rate: 113, commission: 6 },
  { date: new Date('2015-07-01T00:00:00Z'), rate: 119, commission: 6 },
];

const DA_RATES_7TH_PC = [
  // 7th Pay Commission
  { date: new Date('2016-01-01T00:00:00Z'), rate: 0, commission: 7 },
  { date: new Date('2016-07-01T00:00:00Z'), rate: 2, commission: 7 },
  { date: new Date('2017-01-01T00:00:00Z'), rate: 4, commission: 7 },
  { date: new Date('2017-07-01T00:00:00Z'), rate: 5, commission: 7 },
  { date: new Date('2018-01-01T00:00:00Z'), rate: 7, commission: 7 },
  { date: new Date('2018-07-01T00:00:00Z'), rate: 9, commission: 7 },
  { date: new Date('2019-01-01T00:00:00Z'), rate: 12, commission: 7 },
  { date: new Date('2019-07-01T00:00:00Z'), rate: 17, commission: 7 },
  { date: new Date('2021-07-01T00:00:00Z'), rate: 28, commission: 7 }, // After COVID freeze
  { date: new Date('2021-10-01T00:00:00Z'), rate: 31, commission: 7 },
  { date: new Date('2022-01-01T00:00:00Z'), rate: 34, commission: 7 },
  { date: new Date('2022-07-01T00:00:00Z'), rate: 38, commission: 7 },
  { date: new Date('2023-01-01T00:00:00Z'), rate: 42, commission: 7 },
  { date: new Date('2023-07-01T00:00:00Z'), rate: 46, commission: 7 },
  { date: new Date('2024-01-01T00:00:00Z'), rate: 50, commission: 7 },
  { date: new Date('2024-07-01T00:00:00Z'), rate: 53, commission: 7 },
];

export const DA_RATES: { date: Date; rate: number; commission: number }[] = [...DA_RATES_5TH_PC, ...DA_RATES_6TH_PC, ...DA_RATES_7TH_PC].sort((a, b) => a.date.getTime() - b.date.getTime());

type HraSlab = {
  payRange: [number, number];
  rates: { [key in CityGrade]: number };
};

export const HRA_SLABS_7TH_PC: HraSlab[] = [
    { payRange: [0, 13600], rates: { [CityGrade.GRADE_I_A]: 1300, [CityGrade.GRADE_I_B]: 700, [CityGrade.GRADE_II]: 600, [CityGrade.GRADE_III]: 400, [CityGrade.GRADE_IV]: 250 } },
    { payRange: [13601, 17200], rates: { [CityGrade.GRADE_I_A]: 1500, [CityGrade.GRADE_I_B]: 1000, [CityGrade.GRADE_II]: 700, [CityGrade.GRADE_III]: 450, [CityGrade.GRADE_IV]: 300 } },
    { payRange: [17201, 21000], rates: { [CityGrade.GRADE_I_A]: 1800, [CityGrade.GRADE_I_B]: 1200, [CityGrade.GRADE_II]: 800, [CityGrade.GRADE_III]: 500, [CityGrade.GRADE_IV]: 350 } },
    { payRange: [21001, 23900], rates: { [CityGrade.GRADE_I_A]: 2100, [CityGrade.GRADE_I_B]: 1400, [CityGrade.GRADE_II]: 1000, [CityGrade.GRADE_III]: 700, [CityGrade.GRADE_IV]: 400 } },
    { payRange: [23901, 27200], rates: { [CityGrade.GRADE_I_A]: 2600, [CityGrade.GRADE_I_B]: 1700, [CityGrade.GRADE_II]: 1200, [CityGrade.GRADE_III]: 800, [CityGrade.GRADE_IV]: 400 } },
    { payRange: [27201, 30600], rates: { [CityGrade.GRADE_I_A]: 3100, [CityGrade.GRADE_I_B]: 2000, [CityGrade.GRADE_II]: 1500, [CityGrade.GRADE_III]: 1000, [CityGrade.GRADE_IV]: 450 } },
    { payRange: [30601, 35400], rates: { [CityGrade.GRADE_I_A]: 3600, [CityGrade.GRADE_I_B]: 2300, [CityGrade.GRADE_II]: 1700, [CityGrade.GRADE_III]: 1200, [CityGrade.GRADE_IV]: 500 } },
    { payRange: [35401, 37300], rates: { [CityGrade.GRADE_I_A]: 4200, [CityGrade.GRADE_I_B]: 2600, [CityGrade.GRADE_II]: 1800, [CityGrade.GRADE_III]: 1500, [CityGrade.GRADE_IV]: 550 } },
    { payRange: [37301, 41100], rates: { [CityGrade.GRADE_I_A]: 4700, [CityGrade.GRADE_I_B]: 3000, [CityGrade.GRADE_II]: 2300, [CityGrade.GRADE_III]: 1700, [CityGrade.GRADE_IV]: 600 } },
    { payRange: [41101, 44500], rates: { [CityGrade.GRADE_I_A]: 5200, [CityGrade.GRADE_I_B]: 3300, [CityGrade.GRADE_II]: 2600, [CityGrade.GRADE_III]: 1900, [CityGrade.GRADE_IV]: 650 } },
    { payRange: [44501, 50200], rates: { [CityGrade.GRADE_I_A]: 5700, [CityGrade.GRADE_I_B]: 3600, [CityGrade.GRADE_II]: 2900, [CityGrade.GRADE_III]: 2000, [CityGrade.GRADE_IV]: 650 } },
    { payRange: [50201, 51600], rates: { [CityGrade.GRADE_I_A]: 6200, [CityGrade.GRADE_I_B]: 3800, [CityGrade.GRADE_II]: 3100, [CityGrade.GRADE_III]: 2200, [CityGrade.GRADE_IV]: 700 } },
    { payRange: [51601, 54000], rates: { [CityGrade.GRADE_I_A]: 6800, [CityGrade.GRADE_I_B]: 4100, [CityGrade.GRADE_II]: 3200, [CityGrade.GRADE_III]: 2200, [CityGrade.GRADE_IV]: 750 } },
    { payRange: [54001, 55500], rates: { [CityGrade.GRADE_I_A]: 7300, [CityGrade.GRADE_I_B]: 4300, [CityGrade.GRADE_II]: 3200, [CityGrade.GRADE_III]: 2200, [CityGrade.GRADE_IV]: 800 } },
    { payRange: [55501, 56900], rates: { [CityGrade.GRADE_I_A]: 7500, [CityGrade.GRADE_I_B]: 4300, [CityGrade.GRADE_II]: 3200, [CityGrade.GRADE_III]: 2200, [CityGrade.GRADE_IV]: 850 } },
    { payRange: [56901, 64200], rates: { [CityGrade.GRADE_I_A]: 7800, [CityGrade.GRADE_I_B]: 4300, [CityGrade.GRADE_II]: 3200, [CityGrade.GRADE_III]: 2200, [CityGrade.GRADE_IV]: 850 } },
    { payRange: [64201, 999999], rates: { [CityGrade.GRADE_I_A]: 8300, [CityGrade.GRADE_I_B]: 4300, [CityGrade.GRADE_II]: 3200, [CityGrade.GRADE_III]: 2200, [CityGrade.GRADE_IV]: 850 } },
];

type HraSlab6thPC = {
    payRange: [number, number];
    rates: { [key: string]: number };
};

export const HRA_SLABS_5TH_PC: HraSlab6thPC[] = [
    { payRange: [0, 4000], rates: { 'Grade I(a)': 400, 'Grade I(b)': 350, 'Grade II': 200, 'Grade III': 150, 'Unclassified': 100 } },
    { payRange: [4001, 8000], rates: { 'Grade I(a)': 600, 'Grade I(b)': 500, 'Grade II': 350, 'Grade III': 250, 'Unclassified': 150 } },
    { payRange: [8001, 999999], rates: { 'Grade I(a)': 800, 'Grade I(b)': 700, 'Grade II': 500, 'Grade III': 300, 'Unclassified': 200 } },
];

// Fix: Added missing HRA_SLABS_4TH_PC export to resolve import errors.
export const HRA_SLABS_4TH_PC: HraSlab6thPC[] = [
    { payRange: [0, 1500], rates: { 'Grade I(a)': 200, 'Grade I(b)': 150, 'Grade II': 100, 'Grade III': 75, 'Unclassified': 50 } },
    { payRange: [1501, 3000], rates: { 'Grade I(a)': 300, 'Grade I(b)': 250, 'Grade II': 150, 'Grade III': 100, 'Unclassified': 75 } },
    { payRange: [3001, 999999], rates: { 'Grade I(a)': 400, 'Grade I(b)': 350, 'Grade II': 200, 'Grade III': 150, 'Unclassified': 100 } },
];

// Fix: Added missing HRA_SLABS_3RD_PC export to resolve import errors.
export const HRA_SLABS_3RD_PC: HraSlab6thPC[] = [
    { payRange: [0, 750], rates: { 'Grade I(a)': 100, 'Grade I(b)': 75, 'Grade II': 50, 'Grade III': 40, 'Unclassified': 30 } },
    { payRange: [751, 1500], rates: { 'Grade I(a)': 150, 'Grade I(b)': 125, 'Grade II': 75, 'Grade III': 50, 'Unclassified': 40 } },
    { payRange: [1501, 999999], rates: { 'Grade I(a)': 200, 'Grade I(b)': 175, 'Grade II': 100, 'Grade III': 75, 'Unclassified': 50 } },
];


export const HRA_SLABS_6TH_PC_PRE_2009: HraSlab6thPC[] = [
    { payRange: [0, 8000], rates: { 'Grade I(a)': 600, 'Grade I(b)': 600, 'Grade II': 400, 'Grade III': 200, 'Unclassified': 150 } },
    { payRange: [8001, 13500], rates: { 'Grade I(a)': 1000, 'Grade I(b)': 1000, 'Grade II': 600, 'Grade III': 300, 'Unclassified': 200 } },
    { payRange: [13501, 999999], rates: { 'Grade I(a)': 2000, 'Grade I(b)': 2000, 'Grade II': 1000, 'Grade III': 500, 'Unclassified': 300 } },
];

export const HRA_SLABS_6TH_PC: HraSlab6thPC[] = [
    { payRange: [0, 8000], rates: { 'Grade I(a)': 800, 'Grade I(b)': 800, 'Grade II': 500, 'Grade III': 250, 'Unclassified': 200 } },
    { payRange: [8001, 13500], rates: { 'Grade I(a)': 1200, 'Grade I(b)': 1200, 'Grade II': 750, 'Grade III': 350, 'Unclassified': 250 } },
    { payRange: [13501, 999999], rates: { 'Grade I(a)': 2500, 'Grade I(b)': 2500, 'Grade II': 1200, 'Grade III': 600, 'Unclassified': 350 } },
];

export const CCA_RATES: { [key in CityClass]: number } = {
    'A': 200,
    'B': 100,
    'C': 0,
};
