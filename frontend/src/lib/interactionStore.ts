/**
 * Sahaara (NHAA-Care) Interaction & Caseload Telemetry Store
 * 
 * Maps citizen chat sessions, voice journal reflections, and behavioral telemetry
 * to assigned counselors, enabling real-time clinical triage and complete DB dossiers.
 */

export interface InteractionTurn {
  id: string;
  caseId: string;
  timestamp: string;
  channel: 'WEB_CHAT' | 'VOICE_JOURNAL' | 'IVRS_OUTBOUND' | 'WHATSAPP_BOT';
  userPrompt: string;
  aiResponse: string;
  emotion: string;
  autonomicArousal: number; // 0 to 100 percentage
  isSafetyEscalation: boolean;
  isTerse: boolean;
}

export interface CompensationRecord {
  stage: string;
  description: string;
  sanctionedAmount: number;
  disbursedAmount: number;
  status: 'DISBURSED' | 'PENDING_APPROVAL' | 'SCHEDULED';
  disbursementDate?: string;
  statutoryDaysElapsed: number;
}

export interface WitnessProtectionRecord {
  threatLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  section15AOrdered: boolean;
  policeEscortAssigned: boolean;
  safeTransitRouteVerified: boolean;
  cctvMonitoringAtResidence: boolean;
  lastPatrolCheckin: string;
  nodalOfficer: string;
}

export interface CompleteUserDossier {
  caseId: string;
  caseNumber: string;
  firNumber: string;
  firDate: string;
  policeStation: string;
  district: string;
  state: string;
  specialCourt: string;
  judgeName: string;
  investigatingOfficer: string;
  ipcSections: string[];
  poaSections: string[];
  
  // Demographics & Vault
  anonymizedIdentifier: string;
  casteCategory: string;
  villageTehsil: string;
  dependentsCount: number;
  economicVulnerability: 'EXTREME' | 'HIGH' | 'MODERATE';
  assignedCounselorId: string;
  assignedCounselorName: string;

  // Longitudinal Metrics
  currentDdsScore: number;
  deltaVelocity14d: number;
  milestoneContext: string;
  milestoneDueDate: string;
  
  // Behavioral Telemetry
  averageArousal: number;
  guardednessAlert: boolean;
  lastActiveTimestamp: string;

  // Sub-records
  compensationRecords: CompensationRecord[];
  witnessProtection: WitnessProtectionRecord;
  interactionHistory: InteractionTurn[];
}

// Initial Assigned Caseload Dataset (3 distinct citizens mapped to Dr. Ananya Verma)
const INITIAL_DOSSIERS: Record<string, CompleteUserDossier> = {
  'NHAA/2026/UP/VNS/00492': {
    caseId: 'alt-vns-9041',
    caseNumber: 'NHAA/2026/UP/VNS/00492',
    firNumber: 'FIR-482/2026 (Chitaipur PS)',
    firDate: '2026-08-14',
    policeStation: 'Chitaipur Police Station, Varanasi',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    specialCourt: 'Special Atrocities Court No. 2, Varanasi District Judiciary',
    judgeName: 'Hon. Justice V. K. Mishra',
    investigatingOfficer: 'DySP Rajeshwar Singh (CO Bhelupur)',
    ipcSections: ['Section 352 BNS (Assault)', 'Section 351(2) BNS (Criminal Intimidation)'],
    poaSections: ['Section 3(1)(r) (Public Humiliation)', 'Section 3(1)(s) (Verbal Abuse)', 'Section 3(2)(va) (Offence with intent)'],
    
    anonymizedIdentifier: 'VAULT-VNS-P779 (Priya Devi)',
    casteCategory: 'Scheduled Caste (Chamar)',
    villageTehsil: 'Rohaniya Block, Varanasi Rural',
    dependentsCount: 3,
    economicVulnerability: 'HIGH',
    assignedCounselorId: 'usr-c-002',
    assignedCounselorName: 'Dr. Ananya Verma',

    currentDdsScore: 84,
    deltaVelocity14d: 32,
    milestoneContext: 'Witness Deposition Hearing in 9 days',
    milestoneDueDate: '2026-09-17',

    averageArousal: 78,
    guardednessAlert: true,
    lastActiveTimestamp: '15 mins ago',

    compensationRecords: [
      {
        stage: 'Stage 1 (FIR Lodgement)',
        description: 'Initial subsistence relief sanctioned under Rule 12(4)',
        sanctionedAmount: 250000,
        disbursedAmount: 250000,
        status: 'DISBURSED',
        disbursementDate: '2026-08-18',
        statutoryDaysElapsed: 4,
      },
      {
        stage: 'Stage 2 (Chargesheet Filing)',
        description: 'Investigation completion compensation',
        sanctionedAmount: 500000,
        disbursedAmount: 0,
        status: 'PENDING_APPROVAL',
        statutoryDaysElapsed: 24,
      },
      {
        stage: 'Stage 3 (Special Court Verdict)',
        description: 'Post-judgement rehabilitation relief',
        sanctionedAmount: 250000,
        disbursedAmount: 0,
        status: 'SCHEDULED',
        statutoryDaysElapsed: 0,
      }
    ],

    witnessProtection: {
      threatLevel: 'CRITICAL',
      section15AOrdered: true,
      policeEscortAssigned: true,
      safeTransitRouteVerified: true,
      cctvMonitoringAtResidence: true,
      lastPatrolCheckin: '06:30 AM Today (PRV-0492)',
      nodalOfficer: 'SP Rural Varanasi (Nodal Atrocities Cell)',
    },

    interactionHistory: [
      {
        id: 'turn-01',
        caseId: 'NHAA/2026/UP/VNS/00492',
        timestamp: 'Today, 08:15 AM',
        channel: 'WEB_CHAT',
        userPrompt: 'kal shaam ko unke aadmi aaye the. Bole ki gawaahi wapas le le nahi toh ghar jala denge. Hum bahut dare hue hain.',
        aiResponse: 'आपकी सुरक्षा और शांति हमारे लिए सबसे महत्वपूर्ण है। आपने जो साझा किया—हम आपकी स्थिति की गंभीरता को समझते हैं। सहारा के विशेष परामर्शदाता 24x7 उपलब्ध हैं।',
        emotion: 'terrified',
        autonomicArousal: 86,
        isSafetyEscalation: true,
        isTerse: false,
      },
      {
        id: 'turn-02',
        caseId: 'NHAA/2026/UP/VNS/00492',
        timestamp: 'Yesterday, 07:45 PM',
        channel: 'VOICE_JOURNAL',
        userPrompt: 'bache baar baar pooch rahe hain ki kya hum gaon chhod denge. Mujhse kuch bola nahi gaya.',
        aiResponse: 'We hear the immense weight you carry for your children. Take a gentle, grounding breath. You are protecting your family with courage, and you are not alone.',
        emotion: 'overwhelmed',
        autonomicArousal: 74,
        isSafetyEscalation: false,
        isTerse: false,
      }
    ]
  },

  'NHAA/2026/UP/VNS/00381': {
    caseId: 'alt-vns-8812',
    caseNumber: 'NHAA/2026/UP/VNS/00381',
    firNumber: 'FIR-312/2026 (Shivpur PS)',
    firDate: '2026-07-29',
    policeStation: 'Shivpur Police Station, Varanasi',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    specialCourt: 'Special Atrocities Court No. 1, Varanasi District Judiciary',
    judgeName: 'Hon. Justice S. N. Pandey',
    investigatingOfficer: 'CO Shivpur Circle',
    ipcSections: ['Section 115(2) BNS (Voluntarily Causing Hurt)'],
    poaSections: ['Section 3(1)(g) (Wrongful dispossession of land)', 'Section 3(1)(r)'],
    
    anonymizedIdentifier: 'VAULT-VNS-S412 (Sunita Bharti)',
    casteCategory: 'Scheduled Caste (Pasi)',
    villageTehsil: 'Harahua Tehsil, Varanasi',
    dependentsCount: 2,
    economicVulnerability: 'HIGH',
    assignedCounselorId: 'usr-c-002',
    assignedCounselorName: 'Dr. Ananya Verma',

    currentDdsScore: 61,
    deltaVelocity14d: 14,
    milestoneContext: 'Chargesheet Filed (Compensation Stage 2 Pending)',
    milestoneDueDate: '2026-09-22',

    averageArousal: 58,
    guardednessAlert: false,
    lastActiveTimestamp: '2 hours ago',

    compensationRecords: [
      {
        stage: 'Stage 1 (FIR Lodgement)',
        description: 'First relief installment',
        sanctionedAmount: 200000,
        disbursedAmount: 200000,
        status: 'DISBURSED',
        disbursementDate: '2026-08-04',
        statutoryDaysElapsed: 6,
      },
      {
        stage: 'Stage 2 (Chargesheet Filing)',
        description: 'Chargesheet submitted to Court',
        sanctionedAmount: 400000,
        disbursedAmount: 0,
        status: 'PENDING_APPROVAL',
        statutoryDaysElapsed: 18,
      }
    ],

    witnessProtection: {
      threatLevel: 'MODERATE',
      section15AOrdered: true,
      policeEscortAssigned: false,
      safeTransitRouteVerified: true,
      cctvMonitoringAtResidence: false,
      lastPatrolCheckin: 'Yesterday 10:00 PM (Beat Officer)',
      nodalOfficer: 'SP Rural Varanasi',
    },

    interactionHistory: [
      {
        id: 'turn-03',
        caseId: 'NHAA/2026/UP/VNS/00381',
        timestamp: '2 hours ago',
        channel: 'WEB_CHAT',
        userPrompt: 'muavza abhi tak nahi mila hai, advocate sahab se baat nahi ho pa rahi hai. Bacho ki fees deni hai.',
        aiResponse: 'हमने आपकी बात को समझा। आर्थिक तनाव मन को बहुत भारी कर देता है। सहारा टीम आपके ज़िला कल्याण अधिकारी से संपर्क कर राहत राशि की स्थिति सत्यापित कर रही है।',
        emotion: 'distressed',
        autonomicArousal: 58,
        isSafetyEscalation: false,
        isTerse: false,
      }
    ]
  },

  'NHAA/2026/UP/VNS/00215': {
    caseId: 'alt-vns-7719',
    caseNumber: 'NHAA/2026/UP/VNS/00215',
    firNumber: 'FIR-188/2026 (Mirzamurad PS)',
    firDate: '2026-06-11',
    policeStation: 'Mirzamurad Police Station, Varanasi',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    specialCourt: 'Special Atrocities Court No. 2, Varanasi District Judiciary',
    judgeName: 'Hon. Justice V. K. Mishra',
    investigatingOfficer: 'Inspector R. S. Yadav',
    ipcSections: ['Section 190 BNS (Unlawful assembly)'],
    poaSections: ['Section 3(1)(za)(C) (Obstruction of public premises)'],
    
    anonymizedIdentifier: 'VAULT-VNS-R891 (Ramesh Paswan)',
    casteCategory: 'Scheduled Caste (Dusadh / Paswan)',
    villageTehsil: 'Kashi Vidyapeeth Block, Varanasi',
    dependentsCount: 4,
    economicVulnerability: 'MODERATE',
    assignedCounselorId: 'usr-c-002',
    assignedCounselorName: 'Dr. Ananya Verma',

    currentDdsScore: 56,
    deltaVelocity14d: 9,
    milestoneContext: 'Accused Granted Conditional Bail',
    milestoneDueDate: '2026-09-28',

    averageArousal: 49,
    guardednessAlert: true,
    lastActiveTimestamp: 'Yesterday, 19:40',

    compensationRecords: [
      {
        stage: 'Stage 1 (FIR Lodgement)',
        description: 'First relief installment',
        sanctionedAmount: 150000,
        disbursedAmount: 150000,
        status: 'DISBURSED',
        disbursementDate: '2026-06-20',
        statutoryDaysElapsed: 9,
      }
    ],

    witnessProtection: {
      threatLevel: 'MODERATE',
      section15AOrdered: true,
      policeEscortAssigned: false,
      safeTransitRouteVerified: true,
      cctvMonitoringAtResidence: false,
      lastPatrolCheckin: 'Yesterday 04:00 PM',
      nodalOfficer: 'SP Rural Varanasi',
    },

    interactionHistory: [
      {
        id: 'turn-04',
        caseId: 'NHAA/2026/UP/VNS/00215',
        timestamp: 'Yesterday, 07:40 PM',
        channel: 'IVRS_OUTBOUND',
        userPrompt: 'haan thik',
        aiResponse: 'हम आपकी बात सुन रहे हैं। यदि आसपास कोई है और आप खुलकर बात नहीं कर सकते, तो आप कभी भी क्विक एग्जिट ले सकते हैं।',
        emotion: 'guarded',
        autonomicArousal: 52,
        isSafetyEscalation: false,
        isTerse: true,
      }
    ]
  }
};

const STORAGE_KEY = 'sahay_all_user_dossiers';

/**
 * Loads all dossiers from localStorage or seeds with canonical initial data
 */
export function loadAllDossiers(): Record<string, CompleteUserDossier> {
  if (typeof window === 'undefined') return INITIAL_DOSSIERS;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DOSSIERS));
    return INITIAL_DOSSIERS;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_DOSSIERS;
  }
}

/**
 * Saves all dossiers to localStorage
 */
function saveAllDossiers(dossiers: Record<string, CompleteUserDossier>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dossiers));
}

/**
 * Fetches the mapped caseload for a specific counselor (defaulting to Dr. Ananya Verma)
 * Limits to the counselor's designated mapped cohort.
 */
export function getCounselorCaseload(counselorId: string = 'usr-c-002'): CompleteUserDossier[] {
  const all = loadAllDossiers();
  return Object.values(all).filter((d) => d.assignedCounselorId === counselorId || !counselorId);
}

/**
 * Fetches the complete DB dossier for a specific case ID or case number
 */
export function getFullUserDossier(caseKey: string): CompleteUserDossier | null {
  const all = loadAllDossiers();
  if (all[caseKey]) return all[caseKey];
  for (const d of Object.values(all)) {
    if (d.caseId === caseKey || d.caseNumber === caseKey || d.caseNumber.includes(caseKey)) {
      return d;
    }
  }
  return all['NHAA/2026/UP/VNS/00492'] || null;
}

/**
 * Persists a new interaction turn from a citizen (from /v/check-in or VoiceJournal)
 * and updates behavioral telemetry in real-time.
 */
export function saveInteractionTurn(turn: {
  caseId?: string;
  userPrompt: string;
  aiResponse: string;
  emotion?: string;
  autonomicArousal?: number;
  channel?: 'WEB_CHAT' | 'VOICE_JOURNAL' | 'IVRS_OUTBOUND' | 'WHATSAPP_BOT';
  isSafetyEscalation?: boolean;
}): InteractionTurn {
  const all = loadAllDossiers();
  const caseId = turn.caseId || 'NHAA/2026/UP/VNS/00492';
  const targetDossier = all[caseId] || all['NHAA/2026/UP/VNS/00492'];

  const words = turn.userPrompt.trim().split(/\s+/);
  const isTerse = words.length <= 2 && turn.userPrompt.trim() !== '';
  const arousal = turn.autonomicArousal !== undefined ? turn.autonomicArousal : 68;

  const newTurn: InteractionTurn = {
    id: `turn-${Date.now()}`,
    caseId,
    timestamp: 'Just now',
    channel: turn.channel || 'WEB_CHAT',
    userPrompt: turn.userPrompt,
    aiResponse: turn.aiResponse,
    emotion: turn.emotion || 'seeking calm',
    autonomicArousal: arousal,
    isSafetyEscalation: turn.isSafetyEscalation || false,
    isTerse,
  };

  if (targetDossier) {
    targetDossier.interactionHistory.unshift(newTurn);
    targetDossier.lastActiveTimestamp = 'Just now';
    if (turn.isSafetyEscalation) {
      targetDossier.currentDdsScore = Math.min(100, targetDossier.currentDdsScore + 8);
      targetDossier.deltaVelocity14d += 6;
      targetDossier.witnessProtection.threatLevel = 'CRITICAL';
    }
    targetDossier.averageArousal = Math.round((targetDossier.averageArousal + arousal) / 2);
    targetDossier.guardednessAlert = isTerse;
    saveAllDossiers(all);
  }

  return newTurn;
}
