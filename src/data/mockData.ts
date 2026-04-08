import type {
  AppItem,
  NewsItem,
  UserProfile,
  StoreItem,
  StatCard,
  ReportSummary,
  NotificationItem,
} from "../types";
import departmentColors from "../utils/departmentColors";

// ─── APPS ───────────────────────────────────────────

export const apps: AppItem[] = [
  // HR
  {
    id: "timesheet",
    name: "TimeSheet",
    icon: "⏱️",
    color: departmentColors["HR"],
    page: "hr-hub",
    category: "HR",
    description: "Submit and approve employee timesheets",
    isExternal: true,
    externalUrl: "https://apps.powerapps.com/play/e/default-fb94de98-15ae-46be-9699-5eeed956ebd0/a/2fd14482-59bd-464a-9815-0f305fb96345?tenantId=fb94de98-15ae-46be-9699-5eeed956ebd0&hint=b899c432-63ce-45ef-9c85-47d6a807bde9&sourcetime=1774995530002",
  },
  {
    id: "faceapp",
    name: "FaceApp",
    icon: "📸",
    color: departmentColors["HR"],
    page: "hr-hub",
    category: "HR",
    description: "Facial recognition attendance system",
    isExternal: true,
    externalUrl: "https://apps.powerapps.com/play/e/default-fb94de98-15ae-46be-9699-5eeed956ebd0/a/f5653889-005c-4d77-b2d5-a45618ce0e8e?tenantId=fb94de98-15ae-46be-9699-5eeed956ebd0&hint=dc55b8da-cdcc-4162-bc8e-f808f554768d&sourcetime=1774995559493",
  },
  {
    id: "acumatica-panel",
    name: "Acumatica Panel",
    icon: "💼",
    color: departmentColors["HR"],
    page: "hr-hub",
    category: "HR",
    description: "ERP dashboard for HR payroll and benefits",
    isExternal: true,
    externalUrl: "https://momentum.acumatica.com/Frames/Login.aspx?CompanyID=Momentum%20Live",
  },

  // Manufacturing & Production
  {
    id: "fab-cart",
    name: "Fabrication Cart",
    icon: "🏭",
    color: departmentColors["Manufacturing & Production"],
    page: "manufacturing-hub",
    category: "Manufacturing & Production",
    description: "Glass fabrication order tracking and cart management",
    isExternal: true,
    externalUrl: "https://apps.powerapps.com/play/e/default-fb94de98-15ae-46be-9699-5eeed956ebd0/a/b3be4de6-f515-4309-bbf7-17e5d582fcc3?tenantId=fb94de98-15ae-46be-9699-5eeed956ebd0&hint=5f487d34-e729-4b54-9cd4-eb4e97611266&sourcetime=1774995618845",
  },
  {
    id: "mrf",
    name: "MRF",
    icon: "📋",
    color: departmentColors["Manufacturing & Production"],
    page: "mrf",
    category: "Manufacturing & Production",
    description: "Material Request Form — request materials from job site",
  },
  {
    id: "ncr",
    name: "NCR",
    icon: "⚠️",
    color: departmentColors["Manufacturing & Production"],
    page: "manufacturing-hub",
    category: "Manufacturing & Production",
    description: "Non-Conformance Reports — log and track quality issues",
  },
  {
    id: "cutlist-scheduler",
    name: "CutList Scheduler",
    icon: "✂️",
    color: departmentColors["Manufacturing & Production"],
    page: "manufacturing-hub",
    category: "Manufacturing & Production",
    description: "Schedule and manage glass cutting lists",
    isExternal: true,
    externalUrl: "https://apps.powerapps.com/play/e/default-fb94de98-15ae-46be-9699-5eeed956ebd0/a/e58e856d-a9f7-4362-8ba2-73911d445b8c?tenantId=fb94de98-15ae-46be-9699-5eeed956ebd0&sourcetime=1774995811853",
  },

  // Engineering
  {
    id: "bim-tracker",
    name: "BIM & Drafting Tracker",
    icon: "📐",
    color: departmentColors["Engineering"],
    page: "engineering-hub",
    category: "Engineering",
    description: "Track BIM models, shop drawings, and drafting tasks",
    isExternal: true,
    externalUrl: "https://orgceffadda.crm.dynamics.com/main.aspx?appid=e5a22ef4-f071-ee11-9ae7-00224805c247",
  },
  {
    id: "project-mgmt",
    name: "Project Management",
    icon: "📊",
    color: departmentColors["Engineering"],
    page: "engineering-hub",
    category: "Engineering",
    description: "Engineering project timelines, milestones, and resources",
    isExternal: true,
    externalUrl: "https://accounts.autodesk.com/",
  },

  // PreCon
  {
    id: "pipeline",
    name: "Pipeline",
    icon: "🔗",
    color: departmentColors["PreCon"],
    page: "precon-hub",
    category: "PreCon",
    description: "Sales pipeline and opportunity tracker",
    isExternal: true,
    externalUrl: "https://orgceffadda.crm.dynamics.com/main.aspx?appid=e5a22ef4-f071-ee11-9ae7-00224805c247",
  },
  {
    id: "bid-smartsheet",
    name: "Bid Smart Sheet",
    icon: "📑",
    color: departmentColors["PreCon"],
    page: "precon-hub",
    category: "PreCon",
    description: "Bid preparation, cost sheets, and proposal builder",
    isExternal: true,
    externalUrl: "a.com",
  },
  {
    id: "sov-tools",
    name: "SOV Tools",
    icon: "🧮",
    color: departmentColors["PreCon"],
    page: "precon-hub",
    category: "PreCon",
    description: "Schedule of Values management and billing milestones",
  },

  // Reports
  {
    id: "project-reports",
    name: "Project Reports",
    icon: "📈",
    color: departmentColors["Reports"],
    page: "reports-hub",
    category: "Reports",
    description: "Project-level cost, schedule, and progress reports",
  },
  {
    id: "hr-reports",
    name: "HR Reports",
    icon: "👥",
    color: departmentColors["Reports"],
    page: "reports-hub",
    category: "Reports",
    description: "Headcount, attendance, turnover, and payroll reports",
  },
];

/** Apps the user has marked as favorites — feature temporarily disabled */
// export const favoriteApps: AppItem[] = apps.filter((a) => a.isFavorite);
export const favoriteApps: AppItem[] = [];

/** Recently opened apps (ordered by last access) */
export const recentApps: AppItem[] = [
  apps.find((a) => a.id === "fab-cart")!,
  apps.find((a) => a.id === "ncr")!,
  apps.find((a) => a.id === "pipeline")!,
  apps.find((a) => a.id === "timesheet")!,
  apps.find((a) => a.id === "bim-tracker")!,
];

// ─── NEWS ───────────────────────────────────────────

export const newsItems: NewsItem[] = [
  {
    id: "n1",
    title: "🚨 Plant Safety Alert: Tempering Oven 7 Offline for Maintenance",
    summary:
      "Tempering Oven 7 will be taken offline for emergency maintenance starting 3/25. All orders routed to Oven 5 and 6. Expect adjusted cycle times on Line B.",
    date: "2026-03-24",
    category: "Manufacturing",
    urgency: "urgent",
    author: "Rick Delgado, Plant Manager",
  },
  {
    id: "n2",
    title: "📌 Open Enrollment Deadline: April 4",
    summary:
      "Health, dental, and vision benefit selections must be submitted by April 4. Visit the HR Hub → Benefits section or contact HR for assistance.",
    date: "2026-03-23",
    category: "HR",
    urgency: "pinned",
    author: "Sarah Nguyen, HR Director",
  },
  {
    id: "n3",
    title: "Q1 Production Targets Exceeded by 12%",
    summary:
      "The manufacturing team surpassed quarterly goals across all product lines. Fabrication, tempering, and IG lines all hit record throughput. Great work, team!",
    date: "2026-03-22",
    category: "Manufacturing",
    urgency: "normal",
    author: "Alex Martinez, Operations Manager",
    isRead: true,
  },
  {
    id: "n4",
    title: "PreCon Wins $4.2M Riverfront Tower Contract",
    summary:
      "The PreCon team secured the curtain wall package for the downtown Riverfront Tower project. Fabrication kickoff expected in May.",
    date: "2026-03-20",
    category: "PreCon",
    urgency: "normal",
    author: "Jessica Park, VP of PreCon",
    isRead: true,
  },
  {
    id: "n5",
    title: "Glass Tempering Line 3 Upgrade Complete",
    summary:
      "Engineering has finished the Line 3 furnace upgrade. Capacity increased by 20% and energy consumption reduced by 15%. Full production resumes Monday.",
    date: "2026-03-18",
    category: "Engineering",
    urgency: "normal",
    author: "David Chen, Engineering Lead",
  },
  {
    id: "n6",
    title: "📌 Employee Appreciation Week: March 31 – April 4",
    summary:
      "Join us for team lunches, safety awards, department trivia, and the annual MG BBQ on Friday. Full schedule posted in the break rooms and HR Hub.",
    date: "2026-03-17",
    category: "Company",
    urgency: "pinned",
    author: "Leadership Team",
  },
  {
    id: "n7",
    title: "New NCR Reporting Workflow Launched",
    summary:
      "The updated Non-Conformance Report process is now live in the MG Super App. All QC issues must be logged through the new digital form effective immediately.",
    date: "2026-03-15",
    category: "Manufacturing",
    urgency: "normal",
    author: "Quality Assurance Team",
    isRead: true,
  },
  {
    id: "n8",
    title: "IT Reminder: Password Reset Required by March 31",
    summary:
      "All employees must update their network passwords before March 31 per our annual security policy. Instructions are available on the IT Help portal.",
    date: "2026-03-14",
    category: "IT",
    urgency: "normal",
    author: "IT Department",
    isRead: true,
  },
];

export const pinnedNews = newsItems.filter((n) => n.urgency === "pinned");
export const urgentNews = newsItems.filter((n) => n.urgency === "urgent");

// ─── USER PROFILE ───────────────────────────────────

export const currentUser: UserProfile = {
  name: "Alex Martinez",
  role: "",
  department: "Manufacturing",
  avatar: "AM",
  email: "alex.martinez@momentumglass.com",
  phone: "(555) 312-7840",
  location: "Phoenix, AZ — Plant 1",
  manager: "Rick Delgado",
  hireDate: "2019-06-15",
  employeeId: "MG-1047",
};

// ─── STORE ──────────────────────────────────────────

export const storeItems: StoreItem[] = [
  {
    id: "s1",
    name: "MG T-Shirt",
    description: "100% cotton crew neck with Momentum Glass logo — all sizes",
    icon: "👕",
    category: "Apparel",
    price: "$18.00",
    inStock: true,
    isFeatured: true,
  },
  {
    id: "s2",
    name: "MG Baseball Hat",
    description: "Adjustable snapback cap with embroidered MG logo",
    icon: "🧢",
    category: "Apparel",
    price: "$14.00",
    inStock: true,
    isFeatured: true,
  },
  {
    id: "s3",
    name: "Hi-Vis Safety Vest",
    description: "ANSI Class 2 high-visibility reflective vest",
    icon: "🦺",
    category: "PPE",
    price: "$22.00",
    inStock: true,
    isFeatured: true,
  },
  {
    id: "s4",
    name: "MG Ceramic Mug",
    description: '16oz ceramic mug — "Built with Precision" tagline',
    icon: "☕",
    category: "Merch",
    price: "$10.00",
    inStock: true,
  },
  {
    id: "s5",
    name: "Safety Glasses",
    description: "ANSI Z87.1 rated anti-fog protective eyewear",
    icon: "🥽",
    category: "PPE",
    price: "$8.50",
    inStock: true,
  },
  {
    id: "s6",
    name: "Cut-Resistant Gloves",
    description: "Level A4 cut-resistant glass handling gloves",
    icon: "🧤",
    category: "PPE",
    price: "$15.00",
    inStock: false,
  },
  {
    id: "s7",
    name: "Hard Hat",
    description: "Type I Class E protective helmet — white or blue",
    icon: "⛑️",
    category: "PPE",
    price: "$24.00",
    inStock: true,
  },
  {
    id: "s8",
    name: "MG Water Bottle",
    description: "32oz double-wall stainless steel insulated bottle",
    icon: "🧊",
    category: "Merch",
    price: "$16.00",
    inStock: true,
  },
  {
    id: "s9",
    name: "MG Hoodie",
    description: "Heavyweight fleece pullover with embroidered MG crest — S to 3XL",
    icon: "🧥",
    category: "Apparel",
    price: "$38.00",
    inStock: true,
    isFeatured: true,
  },
];

// ─── DASHBOARD STATS ────────────────────────────────

export const dashboardStats: StatCard[] = [
  { label: "Production Today", value: "1,247 units", trend: "up", icon: "🏭" },
  { label: "On-Time Delivery", value: "96.3%", trend: "up", icon: "🚚" },
  { label: "Open Orders", value: "38", trend: "neutral", icon: "📋" },
  { label: "Safety Days", value: "142", trend: "up", icon: "🛡️" },
];

// ─── REPORT SUMMARIES ───────────────────────────────

export const reportSummaries: ReportSummary[] = [
  {
    id: "r1",
    title: "Weekly Production Summary",
    description: "Units produced, scrap rate, OEE, and line utilization for the current week",
    category: "Manufacturing & Production",
    lastUpdated: "2026-03-24",
    icon: "📈",
    status: "current",
  },
  {
    id: "r2",
    title: "Project Cost vs. Budget",
    description: "Actual spend vs. budget across active engineering and PreCon projects",
    category: "Engineering",
    lastUpdated: "2026-03-23",
    icon: "💰",
    status: "current",
  },
  {
    id: "r3",
    title: "NCR Trend Report",
    description: "Non-conformance volume, root causes, and resolution time trends",
    category: "Manufacturing & Production",
    lastUpdated: "2026-03-22",
    icon: "⚠️",
    status: "current",
  },
  {
    id: "r4",
    title: "Headcount & Attendance",
    description: "Employee headcount, absenteeism rate, and overtime hours by department",
    category: "HR",
    lastUpdated: "2026-03-21",
    icon: "👥",
    status: "current",
  },
  {
    id: "r5",
    title: "PreCon Pipeline Summary",
    description: "Active bids, win rate, and estimated revenue by stage",
    category: "PreCon",
    lastUpdated: "2026-03-19",
    icon: "🔗",
    status: "outdated",
  },
  {
    id: "r6",
    title: "Monthly Safety Report",
    description: "Incident count, near-misses, OSHA recordables, and safety training completion",
    category: "Manufacturing & Production",
    lastUpdated: "2026-03-01",
    icon: "🛡️",
    status: "outdated",
  },
];

// ─── NOTIFICATIONS ──────────────────────────────────

export const notifications: NotificationItem[] = [
  {
    id: "notif-1",
    type: "urgent-alert",
    title: "Tempering Oven 7 Offline",
    body: "Emergency maintenance starting 3/25. Orders rerouted to Oven 5 & 6.",
    time: "10 min ago",
    icon: "🚨",
    isRead: false,
    isUrgent: true,
  },
  {
    id: "notif-2",
    type: "hr-reminder",
    title: "Open Enrollment Deadline: April 4",
    body: "Submit health, dental, and vision selections before the deadline.",
    time: "1 hr ago",
    icon: "📋",
    isRead: false,
  },
  {
    id: "notif-3",
    type: "store-order",
    title: "Your Order Has Shipped",
    body: "MG Hoodie (XL) and Safety Glasses are on the way — tracking #MG-20260324.",
    time: "2 hrs ago",
    icon: "📦",
    isRead: false,
  },
  {
    id: "notif-4",
    type: "app-reminder",
    title: "Timesheet Due Today",
    body: "Submit your weekly timesheet before 5:00 PM today.",
    time: "3 hrs ago",
    icon: "⏱️",
    isRead: false,
  },
  {
    id: "notif-5",
    type: "company-news",
    title: "Q1 Production Targets Exceeded",
    body: "Manufacturing surpassed quarterly goals by 12%. Great work, team!",
    time: "Yesterday",
    icon: "🎉",
    isRead: true,
  },
  {
    id: "notif-6",
    type: "urgent-alert",
    title: "Password Reset Required by March 31",
    body: "Update your network password per annual security policy.",
    time: "Yesterday",
    icon: "🔒",
    isRead: true,
    isUrgent: true,
  },
  {
    id: "notif-7",
    type: "company-news",
    title: "Employee Appreciation Week",
    body: "March 31 – April 4: team lunches, safety awards, and the annual BBQ.",
    time: "2 days ago",
    icon: "🎊",
    isRead: true,
  },
  {
    id: "notif-8",
    type: "store-order",
    title: "Order Delivered",
    body: "Hi-Vis Safety Vest delivered to Plant 1 front desk.",
    time: "3 days ago",
    icon: "✅",
    isRead: true,
  },
  {
    id: "notif-9",
    type: "app-reminder",
    title: "NCR Report Pending Review",
    body: "NCR #4821 needs your sign-off before end of day.",
    time: "3 days ago",
    icon: "⚠️",
    isRead: true,
  },
];
