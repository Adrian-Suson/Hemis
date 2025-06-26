// === Institutional Profile Constants (from NONSUC-e-Forms-A) ===
export const HEAD_TITLE_MAPPING = {
    1: "President",
    2: "Chancellor",
    3: "Executive Director",
    4: "Dean",
    5: "Rector",
    6: "Head",
    7: "Administrator",
    8: "Principal",
    9: "Managing Director",
    10: "Director",
    11: "Chair",
    12: "Others",
    99: "Not known or not indicated",
};

export const EDUCATIONAL_LEVEL_MAPPING = {
    50: "Completed a Baccalaureate Degree (including DVM, DDM, D Opt)",
    60: "Completed Post-Grad Certificate or diploma Program",
    70: "Completed MD or LLB (or equivalent)",
    80: "Completed Masters Degree or Equivalent",
    90: "Completed Doctorate Degree (or equivalent)",
};


export const INSTITUTIONAL_TYPE = {
    "CSCU-MAIN": "Chartered State College/University (Main)",
    "CSCU-SAT": "Chartered State College/University (Satellite Campus)",
    CSI: "CHED-Supervised Institution",
    LGCU: "Local Government College/University",
    PSS: "Private Sectarian Stock",
    PSN: "Private Sectarian Non-Stock",
    PNS: "Private Non-Sectarian Stock",
    PNN: "Private Non-Sectarian Non-Stock",
    PSF: "Private Sectarian Foundation",
    PNF: "Private Non-Sectarian Foundation",
    OT: "Others, please specify",
};

export const THESIS_DISSERTATION = {
    1: "Yes, with thesis/dissertation",
    2: "No, without thesis/dissertation",
};

export const PROGRAM_STATUS = {
    CO: "Program currently offered and accepting students.",
    PO: "Program is being phased out but still has students.",
    DO: "Program has been discontinued and has no students.",
    NO: "Program has not been officially discontinued but has no students.",
    NA: "Not applicable, program is not operated by the institution.",
};

export const PROGRAM_MODE = {
    SE: "Semestral",
    TR: "Trimestral",
    SD: "Semestral-Distance education delivery mode",
    TD: "Trimestral-Distance education delivery mode",
    DE: "Distance education at student's pace",
    OT: "Others, please specify",
};
