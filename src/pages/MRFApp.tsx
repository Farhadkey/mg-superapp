import { useState, useEffect, useCallback, useRef } from "react";
import QRCode from "qrcode";
import { Html5Qrcode } from "html5-qrcode";
import "./MRFApp.css";

// ─── API Config ─────────────────────────────────────
const API_LIST_REQUESTS   = "https://5f6ab8fb609ce44498e7b1f3eba563.0c.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/a6aa32974f384236a437e0fc90d2a125/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=CY7UrNbpzPIZ3s9WhK9ytewxEPgK4QnXsp9okceFPz0";
const API_GET_ITEMS       = "https://5f6ab8fb609ce44498e7b1f3eba563.0c.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/054839e547a8499ab4b62e4ff5559a3a/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=l7HY70wIENVjWcWwNGKIpKPRO8sDnLT0wvy0UjRuxdU";
const API_SAVE_REQUEST    = "https://5f6ab8fb609ce44498e7b1f3eba563.0c.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/b101c94982f34eec9eca55cc4d6bc788/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=QkpkT1VRYsB0x4T-oYN1pKgm5h5ah1sLGlget7mt8Jk";
const API_SAVE_ITEMS      = "https://5f6ab8fb609ce44498e7b1f3eba563.0c.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/3f968e8ddee54634baef172f451ef6be/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=NwEXtB1Qgc5qVV-4Rd2lgMX7VWiZEN4IioZoxUR3xLs";
const API_DELETE_REQUEST  = "https://5f6ab8fb609ce44498e7b1f3eba563.0c.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/53d03af3157d467a8974d8a51c400991/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Db8SvEFlvkBeA2p7sxVy_WHEnL7d6AOuzXoApjVtSB0";
const API_MATERIAL_LIST   = "https://5f6ab8fb609ce44498e7b1f3eba563.0c.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/f1c7256e9c464e278ce84b200946aa93/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=9bK48EoMFZubJK-UMt50egyxEfH5DvtfzCOZfh8lwd0";
const API_PROJECT_LIST    = "https://5f6ab8fb609ce44498e7b1f3eba563.0c.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/5e9b19b7e7014553870718aedac6d70d/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=4So0aZJ3bb73LnKKDrJW4EOszO3u3_gpnIliVzq3OgY";

// ─── App URL for notification links ─────────────────
const APP_URL = "https://apps.powerapps.com/play/e/5f6ab8fb-609c-e444-98e7-b1f3eba5630c/app/bdb8e893-4908-4e15-b643-e59d16cad7e9?tenantId=fb94de98-15ae-46be-9699-5eeed956ebd0&hideNavBar=true";

// ─── Status flow ────────────────────────────────────
const STATUS_FLOW: Record<string, string> = {
  Saved: "Avaliablity Check",
  "Avaliablity Check": "Inventory Management",
  "Inventory Management": "Shipment/Purchase order",
};

const STATUS_COLORS: Record<string, string> = {
  Saved: "#DC2626",
  "Avaliablity Check": "#F97316",
  "Inventory Management": "#EAB308",
  "Shipment/Purchase order": "#84CC16",
  "Partially Delivered": "#22C55E",
  Deliverd: "#16A34A",
};

const ACTION_OPTIONS = [
  "Inventory available",
  "To be ordered by PM",
  "Ordered",
];

// ─── Role config ────────────────────────────────────
const ROLE_USERS = {
  inventory1: { name: "Frank Gagliano", email: "frank.gagliano@momentum-glass.com" },
  //shipment: { name: "Farhad Keyanvash", email: "farhad.keyanvash@momentum-glass.com" },
  inventory2: { name: "Brian Gunderson", email: "brian.gunderson@momentum-glass.com" },
  shipment: { name: "Bo McGee", email: "Bo.McGee@momentum-glass.com" },
  admins: [ "farhad","farshid"],
};

// ─── Types ──────────────────────────────────────────
interface MRFRequest {
  ID?: number;
  Title: string;
  Requester: string;
  RequestDate: string;
  DeliverDate: string;
  JobName: string;
  JobNo: string;
  ShipmentPhone: string;
  ShipmentAddress: string;
  RequestStatus: string;
  Note: string;
}

interface MRFItem {
  ID?: number;
  Title?: string;
  ItemDescription: string;
  ItemCount: number;
  IsEqu: boolean;
  sessionID: string;
  Action: string;
  OrderCode: string;
  _isNew?: boolean;
}

interface ProjectOption {
  Title: string;
  ProjectCode: string;
  ProjectAddress: string;
  ProjectManager?: string;
  ProjectManager2?: string;
  ProjectManager3?: string;
}

// ─── Helpers ────────────────────────────────────────
function generateMRFCode(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const mi = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  return `MRF_${yy}${mm}${dd}${hh}${mi}${ss}`;
}

function toISODate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toISOString().split("T")[0];
}

async function apiPost(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json().catch(() => ({}));
}

// ─── Notification API ─────────────────────────────
const API_NOTIFICATION = "https://5f6ab8fb609ce44498e7b1f3eba563.0c.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/a6544075db8448a8b379aaf73711895b/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=EGIqp-MQrPx1lyzm1uZ9evBoMkqHYGg0vLH1t3aPJnA";

async function sendNotification({ subject, to, cc, body, attachment }: { subject: string; to: string; cc?: string; body: string; attachment?: { name: string; contentBytes: string; contentType: string } }) {
  await apiPost(API_NOTIFICATION, { subject, to, cc, body, attachment });
}

// ─── Component ──────────────────────────────────────
export default function MRFApp({ userEmail, userName, mrfCode }: { userEmail: string; userName: string; mrfCode?: string | null }) {
  // ── Role state ──
  const isAdmin = ROLE_USERS.admins.some((a) => userName.toLowerCase().includes(a));
  const isInventory1 = isAdmin || userName === ROLE_USERS.inventory1.name;
  const isInventory2 = isAdmin || userName === ROLE_USERS.inventory2.name;
  const isShipment = isAdmin || userName === ROLE_USERS.shipment.name;

  // ── List state ──
  const [requests, setRequests] = useState<MRFRequest[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [search, setSearch] = useState("");

  // ── Selected / form state ──
  const [selected, setSelected] = useState<MRFRequest | null>(null);
  const [formData, setFormData] = useState<MRFRequest | null>(null);
  const formDataRef = useRef<MRFRequest | null>(null);
  formDataRef.current = formData;
  const [isNew, setIsNew] = useState(false);
  const [items, setItems] = useState<MRFItem[]>([]);
  const itemsRef = useRef<MRFItem[]>([]);
  itemsRef.current = items;
  const [noteText, setNoteText] = useState("");

  // ── Material & project lookups ──
  const [materialList, setMaterialList] = useState<string[]>([]);
  const [projectList, setProjectList] = useState<ProjectOption[]>([]);
  const [materialFilter, setMaterialFilter] = useState("");

  // ── Busy / feedback ──
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  // ── Modals ──
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [sendConfirm, setSendConfirm] = useState(false);
  const [shipmentModal, setShipmentModal] = useState(false);
  const [deliverModal, setDeliverModal] = useState(false);
  const [pickListModal, setPickListModal] = useState(false);

  // ── Deliver scanner state ──
  const [scannedItem, setScannedItem] = useState<MRFItem | null>(null);
  const [scannedSessionID, setScannedSessionID] = useState("");
  const [deliverSaving, setDeliverSaving] = useState(false);
  const [deliverStatus, setDeliverStatus] = useState("");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerRunningRef = useRef(false);

  // ── Detail loading ──
  const [detailLoading, setDetailLoading] = useState(false);

  // ── Mobile: show detail ──
  const [mobileDetail, setMobileDetail] = useState(false);

  // ── @Mention state ──
  const [mentionOpen, setMentionOpen] = useState(false);
  const [mentionFilter, setMentionFilter] = useState("");
  const [mentionIndex, setMentionIndex] = useState(0);
  const [mentionStart, setMentionStart] = useState(-1);
  const [mentionedEmails, setMentionedEmails] = useState<string[]>([]);
  const [noteSaving, setNoteSaving] = useState(false);
  const noteRef = useRef<HTMLTextAreaElement>(null);

  const listContainerRef = useRef<HTMLDivElement>(null);

  // ─── Mentionable people (built from roles + project PMs) ────
  const mentionPeople = useCallback(() => {
    const people: { name: string; email: string }[] = [
      { name: ROLE_USERS.inventory1.name, email: ROLE_USERS.inventory1.email },
      { name: ROLE_USERS.inventory2.name, email: ROLE_USERS.inventory2.email },
      { name: ROLE_USERS.shipment.name, email: ROLE_USERS.shipment.email },
      { name: "Farhad Keyanvash", email: "farhad.keyanvash@momentum-glass.com" },
      { name: "Farshid Moosavi", email: "farshid.moosavi@momentum-glass.com" },
    ];
    const proj = formData ? projectList.find(p => p.Title === formData.JobName) : undefined;
    if (proj) {
      const pmFields = [
        { key: "PM", email: proj.ProjectManager },
        { key: "PM2", email: proj.ProjectManager2 },
        { key: "PM3", email: proj.ProjectManager3 },
      ];
      pmFields.forEach(({ email }) => {
        if (email && !people.some(p => p.email.toLowerCase() === email.toLowerCase())) {
          const local = email.split("@")[0];
          const name = local.split(".").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
          people.push({ name, email });
        }
      });
    }
    return people;
  }, [formData, projectList]);

  // ─── Role helpers for current item ────────
  const isRequester = formData ? userName.toLowerCase() === formData.Requester?.toLowerCase() : false;

  // PM role: check if current user's email matches any ProjectManager on the selected project
  const currentProject = formData ? projectList.find(p => p.Title === formData.JobName) : undefined;
  const isPM = isAdmin || (!!currentProject && !!userEmail && [
    currentProject.ProjectManager,
    currentProject.ProjectManager2,
    currentProject.ProjectManager3,
  ].some(pm => pm && typeof pm === "string" && pm.toLowerCase() === userEmail.toLowerCase()));

  const canEditForm = isNew || isAdmin || (
    (formData?.RequestStatus === "Saved" && isRequester) ||
    (formData?.RequestStatus === "Avaliablity Check" && isInventory1) ||
    (formData?.RequestStatus === "Inventory Management" && isInventory2) ||
    ((formData?.RequestStatus === "Shipment/Purchase order" || formData?.RequestStatus === "Partially Delivered") && (isShipment || isPM || isInventory2))
  );

  const canSave = canEditForm;
  const canSend = !isNew && (isAdmin || (
    (formData?.RequestStatus === "Saved" && isRequester) ||
    (formData?.RequestStatus === "Avaliablity Check" && isInventory1) ||
    (formData?.RequestStatus === "Inventory Management" && isInventory2)
  ));
  const canDelete = !isNew && canEditForm;
  const canShipment = !isNew && (isAdmin || isShipment) &&
    (formData?.RequestStatus === "Shipment/Purchase order" || formData?.RequestStatus === "Partially Delivered");

  // ─── Load data ────────────────────────────
  const loadRequests = useCallback(async () => {
    setListLoading(true);
    try {
      const data = await apiPost(API_LIST_REQUESTS, { userEmail, userName });
      const list: MRFRequest[] = (data?.value ?? data ?? []).map((r: Record<string, unknown>) => ({
        ID: r.ID as number,
        Title: (r.Title as string) || "",
        Requester: (r.Requester as string) || "",
        RequestDate: (r.RequestDate as string) || "",
        DeliverDate: (r.DeliverDate as string) || "",
        JobName: (r.JobName as string) || "",
        JobNo: (r.JobNo as string) || "",
        ShipmentPhone: (r.ShipmentPhone as string) || "",
        ShipmentAddress: (r.ShipmentAddress as string) || "",
        RequestStatus: (r.RequestStatus as string) || "Saved",
        Note: (r.Note as string) || "",
      }));
      setRequests(list);
    } catch {
      setStatus("Failed to load MRF list.");
    } finally {
      setListLoading(false);
    }
  }, [userEmail, userName]);

  const loadItems = useCallback(async (mrfTitle: string) => {
    setDetailLoading(true);
    try {
      const data = await apiPost(API_GET_ITEMS, { sessionID: mrfTitle });
      const list: MRFItem[] = (data?.value ?? data ?? []).map((r: Record<string, unknown>) => ({
        ID: r.ID as number,
        Title: (r.Title as string) || "",
        ItemDescription: (r.ItemDescription as string) || "",
        ItemCount: (r.ItemCount as number) || 0,
        IsEqu: !!(r.IsEqu),
        sessionID: (r.sessionID as string) || "",
        Action: (r.Action as string) || "",
        OrderCode: (r.OrderCode as string) || "",
      }));
      setItems(list);
      itemsRef.current = list;
    } catch {
      setItems([]);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const loadMaterialList = useCallback(async () => {
    try {
      const data = await apiPost(API_MATERIAL_LIST, {});
      const list: string[] = (data?.value ?? data ?? []).map((r: Record<string, unknown>) => (r.Title as string) || "");
      setMaterialList(list.filter(Boolean));
    } catch {
      setMaterialList([]);
    }
  }, []);

  const loadProjectList = useCallback(async () => {
    try {
      const data = await apiPost(API_PROJECT_LIST, {});
      const list: ProjectOption[] = (data?.value ?? data ?? []).map((r: Record<string, unknown>) => {
        const pmEmail = (v: unknown): string => {
          if (!v) return "";
          if (typeof v === "string") return v;
          if (typeof v === "object" && v !== null) {
            const obj = v as Record<string, unknown>;
            return (obj.Email as string) || (obj.email as string) || (obj.Mail as string) || (obj.mail as string) || "";
          }
          return "";
        };
        return {
          Title: (r.Title as string) || "",
          ProjectCode: (r.ProjectCode as string) || "",
          ProjectAddress: (r.ProjectAddress as string) || "",
          ProjectManager: pmEmail(r.ProjectManager),
          ProjectManager2: pmEmail(r.ProjectManager2),
          ProjectManager3: pmEmail(r.ProjectManager3),
        };
      });
      setProjectList(list);
    } catch {
      setProjectList([]);
    }
  }, []);

  // ─── Init ────────────────────────────────
  useEffect(() => {
    loadRequests();
    loadMaterialList();
    loadProjectList();
  }, [loadRequests, loadMaterialList, loadProjectList]);

  // ─── Select MRF ──────────────────────────
  const selectMRF = useCallback((mrf: MRFRequest) => {
    setSelected(mrf);
    setFormData({ ...mrf });
    setNoteText("");
    setIsNew(false);
    setMobileDetail(true);
    loadItems(mrf.Title);
    setStatus("");
  }, [loadItems]);

  // ─── Auto-select MRF from URL param ──────
  const mrfCodeHandled = useRef(false);
  useEffect(() => {
    if (mrfCode && requests.length > 0 && !mrfCodeHandled.current) {
      const match = requests.find((r) => r.Title === mrfCode);
      if (match) {
        mrfCodeHandled.current = true;
        selectMRF(match);
      }
    }
  }, [mrfCode, requests, selectMRF]);

  // ─── New MRF ─────────────────────────────
  const newMRF = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];
    const blank: MRFRequest = {
      Title: generateMRFCode(),
      Requester: userName,
      RequestDate: today,
      DeliverDate: nextWeek,
      JobName: "",
      JobNo: "",
      ShipmentPhone: "",
      ShipmentAddress: "",
      RequestStatus: "Saved",
      Note: "",
    };
    setSelected(null);
    setFormData(blank);
    setItems([]);
    setNoteText("");
    setIsNew(true);
    setMobileDetail(true);
    setStatus("");
  }, [userName]);

  // ─── Form field change ───────────────────
  const setField = useCallback((field: keyof MRFRequest, value: string) => {
    setFormData((prev) => prev ? { ...prev, [field]: value } : prev);
  }, []);

  const setJobFromProject = useCallback((projTitle: string) => {
    const proj = projectList.find((p) => p.Title === projTitle);
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            JobName: projTitle,
            JobNo: proj?.ProjectCode || "",
            ShipmentAddress: proj?.ProjectAddress || prev.ShipmentAddress,
          }
        : prev
    );
  }, [projectList]);

  // ─── Item management ─────────────────────
  const addBlankItem = useCallback(() => {
    const sessionID = formData?.Title || "";
    setItems((prev) => [
      ...prev,
      {
        ItemDescription: "",
        ItemCount: 1,
        IsEqu: false,
        sessionID,
        Action: "",
        OrderCode: "",
        _isNew: true,
      },
    ]);
  }, [formData]);

  const addFromPickList = useCallback((materialTitle: string) => {
    const sessionID = formData?.Title || "";
    setItems((prev) => [
      ...prev,
      {
        ItemDescription: materialTitle,
        ItemCount: 1,
        IsEqu: true,
        sessionID,
        Action: "",
        OrderCode: "",
        _isNew: true,
      },
    ]);
    setPickListModal(false);
    setMaterialFilter("");
  }, [formData]);

  const updateItem = useCallback((idx: number, field: keyof MRFItem, value: unknown) => {
    setItems((prev) => prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));
  }, []);

  const removeItem = useCallback((idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  // ─── Save ─────────────────────────────────
  const handleSave = useCallback(async () => {
    if (!formData) return;
    if (!formData.JobName) { setStatus("Please select a Job/Project."); return; }
    const hasEmptyCount = items.some((it) => !it.ItemCount || it.ItemCount < 1);
    if (hasEmptyCount) { setStatus("All items must have a count >= 1."); return; }

    setSaving(true);
    setStatus("Saving...");
    try {
      // Build note with timestamp
      let updatedNote = formData.Note || "";
      if (noteText.trim()) {
        const stamp = `${userName}(${new Date().toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\//g, "")}):\n${noteText.trim()}\n-----\n`;
        updatedNote = stamp + updatedNote;
      }

      const requestPayload = {
        ...formData,
        Note: updatedNote,
        RequestDate: toISODate(formData.RequestDate),
        DeliverDate: toISODate(formData.DeliverDate),
        isNew,
      };


      // Prepare items payload: include all required fields with safe defaults
      const cleanedItems = items.map((item, idx) => ({
        ID: typeof item.ID === 'number' ? item.ID : 0,
        Title: item.Title || item.ItemDescription || `Item ${idx + 1}`,
        ItemDescription: item.ItemDescription || item.Title || `Item ${idx + 1}`,
        ItemCount: typeof item.ItemCount === 'number' ? item.ItemCount : 0,
        IsEqu: typeof item.IsEqu === 'boolean' ? item.IsEqu : false,
        sessionID: item.sessionID || (formData?.Title ?? ''),
        Action: typeof item.Action === 'string' ? item.Action : '',
        OrderCode: typeof item.OrderCode === 'string' ? item.OrderCode : '',
      }));

      const saveRes = await apiPost(API_SAVE_REQUEST, requestPayload);
      // Capture server-assigned ID for new requests
      if (saveRes?.ID) {
        formData.ID = saveRes.ID;
      }
      await apiPost(API_SAVE_ITEMS, { sessionID: formData.Title, items: cleanedItems });

      setNoteText("");
      const updatedFormData = { ...formData, Note: updatedNote };
      setFormData(updatedFormData);
      formDataRef.current = updatedFormData;
      setStatus("Saved successfully.");
      const wasNew = isNew;
      setIsNew(false);
      await loadRequests();
      if (wasNew) {
        // Refresh items to get server-assigned IDs so send won't create duplicates
        await loadItems(formData.Title);
        setSendConfirm(true);
      }
    } catch {
      setStatus("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }, [formData, items, noteText, userName, isNew, loadRequests, loadItems]);

  // ─── Save & Send ─────────────────────────
  const handleSaveAndSend = useCallback(async () => {
    // Read latest state via refs to avoid stale closures
    const fd = formDataRef.current;
    const latestItems = itemsRef.current;
    if (!fd) return;
    const nextStatus = STATUS_FLOW[fd.RequestStatus];
    if (!nextStatus) { setStatus("Cannot advance this status."); return; }

    setSaving(true);
    setStatus("Saving and sending...");
    try {
      let updatedNote = fd.Note || "";
      if (noteText.trim()) {
        const stamp = `${userName}(${new Date().toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\//g, "")}):\n${noteText.trim()}\n-----\n`;
        updatedNote = stamp + updatedNote;
      }

      // Update status and save as usual
      const requestPayload = {
        ...fd,
        Note: updatedNote,
        RequestDate: toISODate(fd.RequestDate),
        DeliverDate: toISODate(fd.DeliverDate),
        RequestStatus: nextStatus,
      };

      // Prepare items payload (reuse logic from handleSave)
      const cleanedItems = latestItems.map((item, idx) => ({
        ID: typeof item.ID === 'number' ? item.ID : 0,
        Title: item.Title || item.ItemDescription || `Item ${idx + 1}`,
        ItemDescription: item.ItemDescription || item.Title || `Item ${idx + 1}`,
        ItemCount: typeof item.ItemCount === 'number' ? item.ItemCount : 0,
        IsEqu: typeof item.IsEqu === 'boolean' ? item.IsEqu : false,
        sessionID: item.sessionID || (fd?.Title ?? ''),
        Action: typeof item.Action === 'string' ? item.Action : '',
        OrderCode: typeof item.OrderCode === 'string' ? item.OrderCode : '',
      }));

      await apiPost(API_SAVE_REQUEST, requestPayload);
      await apiPost(API_SAVE_ITEMS, { sessionID: fd.Title, items: cleanedItems });

      // Send notification emails for each workflow step
      const project = projectList.find(p => p.Title === fd.JobName);
      const pmEmails = [project?.ProjectManager, project?.ProjectManager2, project?.ProjectManager3].filter(Boolean).join(";");
      const pmName = (() => { const e = project?.ProjectManager || ""; if (!e) return "PM"; const l = e.split("@")[0]; return l.split(".").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "); })();

      if (nextStatus === "Avaliablity Check") {
        await sendNotification({
          subject: `MRF Activity: ${fd.Title}`,
          to: ROLE_USERS.inventory1.email,
          cc: "",
          body: `Hi ${ROLE_USERS.inventory1.name.split(" ")[0]}, <br><br> A Material Request Form (${fd.Title}) has been submitted and is awaiting your review. <br><br> Please use the link below to open and respond: <br><a href='${APP_URL}&MRFCode=${fd.Title}'>Open ${fd.Title}</a><br>Thank you!`
        });
      }
      if (nextStatus === "Inventory Management") {
        await sendNotification({
          subject: `MRF Activity: ${fd.Title}`,
          to: ROLE_USERS.inventory2.email,
          cc: "",
          body: `Hi ${ROLE_USERS.inventory2.name.split(" ")[0]}, <br><br> ${ROLE_USERS.inventory1.name.split(" ")[0]} has reviewed the Material Request Form (${fd.Title}) and marked which items are in stock and which need ordering. <br> Please verify the inventory details and confirm. <br><br> Please use the link below to open and respond: <br><a href='${APP_URL}&MRFCode=${fd.Title}'>Open ${fd.Title}</a><br>Thank you!`
        });
      }
      if (nextStatus === "Shipment/Purchase order") {
        // To PM(s) if any items are "To be ordered by PM"
        if (cleanedItems.some(it => it.Action === "To be ordered by PM")) {
          await sendNotification({
            subject: `MRF Activity: ${fd.Title}`,
            to: pmEmails || "",
            cc: "farhad.keyanvash@momentum-glass.com;farshid.moosavi@momentum-glass.com",
            body: `Hi ${pmName}, <br><br> The Material Request Form (${fd.Title}) has been submitted. Please create a Purchase Order for the items marked as “to be ordered” in the MRF. <br><br> Once order has been placed: <br> Add the PO# to the MRF. <br> Ensure the MRF# is referenced in the PO within Acumatica. <br><br> Please use the link below to open and respond: <br><a href='${APP_URL}&MRFCode=${fd.Title}'>Open ${fd.Title}</a><br>Thank you!`
          });
        }
        // To Shipment
        await sendNotification({
          subject: `MRF Activity: ${fd.Title}`,
          to: ROLE_USERS.shipment.email,
          cc: "farhad.keyanvash@momentum-glass.com;farshid.moosavi@momentum-glass.com",
          body: `Hi ${ROLE_USERS.shipment.name.split(" ")[0]}, <br><br> Please verify the items marked as 'Inventory Available' in (${fd.Title}). Once verification is completed, please create a BOL and start the shipping process for these items.<br> Please use the link below to open and respond: <br><a href='${APP_URL}&MRFCode=${fd.Title}'>Open ${fd.Title}</a><br>Thank you!`
        });
      }
      setStatus(`Sent! Status changed to "${nextStatus}".`);
      setSendConfirm(false);
      setIsNew(false);
      await loadRequests();
      // Update local form
      setFormData((prev) => prev ? { ...prev, RequestStatus: nextStatus, Note: updatedNote } : prev);
    } catch {
      setStatus("Send failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }, [noteText, userName, userEmail, loadRequests, projectList]);

  // ─── Delete ──────────────────────────────
  const handleDelete = useCallback(async () => {
    if (!formData?.Title) return;
    setSaving(true);
    try {
      await apiPost(API_DELETE_REQUEST, { ID: formData.ID });
      setDeleteConfirm(false);
      setFormData(null);
      setSelected(null);
      setItems([]);
      setMobileDetail(false);
      setStatus("Deleted.");
      await loadRequests();
    } catch {
      setStatus("Delete failed.");
    } finally {
      setSaving(false);
    }
  }, [formData, loadRequests]);

  // ─── Build Shipment Bucket HTML ────────────
  const buildShipmentHtml = useCallback(async (): Promise<string> => {
    if (!formData) return "";
    const shipItems = items.filter((it) => it.Action === "Inventory available");
    const qrPromises = shipItems.map((it) =>
      QRCode.toDataURL(JSON.stringify({ sessionID: it.sessionID, ID: it.ID }), { width: 120, margin: 1 })
    );
    const qrDataUrls = await Promise.all(qrPromises);

    const itemsHtml = shipItems.map((it, i) => `
      <div style="display:inline-block;width:280px;margin:12px;vertical-align:top;">
        <img src="${qrDataUrls[i]}" alt="QR ${it.ID}" style="width:120px;height:120px;" />
        <div style="display:inline-block;vertical-align:top;margin-left:8px;">
          <div>${it.ItemCount}</div>
          <div>${it.ItemDescription}</div>
        </div>
      </div>
    `).join("");

    return `<!DOCTYPE html>
<html><head><title>Shipment Bucket - ${formData.Title}</title>
<style>
  body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #FFF8E1; }
  h1 { text-align: center; margin-bottom: 20px; }
  .header { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 24px; }
  .header label { font-weight: bold; font-size: 13px; }
  .header .val { background: #fff; border: 1px solid #ccc; padding: 6px 8px; border-radius: 4px; margin-top: 2px; min-height: 18px; }
  .items { margin-top: 16px; }
  @media print { body { background: #FFF8E1; -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style></head><body>
  <h1>Shipment Bucket Form</h1>
  <div class="header">
    <div><label>Title</label><div class="val">${formData.Title}</div></div>
    <div><label>RequestDate</label><div class="val">${formData.RequestDate ? new Date(formData.RequestDate).toDateString() : ""}</div></div>
    <div><label>Requester</label><div class="val">${formData.Requester}</div></div>
    <div><label>JobName</label><div class="val">${formData.JobName}</div></div>
    <div><label>ShipmentAddress</label><div class="val">${formData.ShipmentAddress || "-"}</div></div>
    <div><label>ShipmentPhone</label><div class="val">${formData.ShipmentPhone || ""}</div></div>
  </div>
  <div class="items">${itemsHtml}</div>
</body></html>`;
  }, [formData, items]);

  // ─── Print Shipment Bucket ────────────────
  const printShipmentBucket = useCallback(async () => {
    const html = await buildShipmentHtml();
    if (!html) return;
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
      win.focus();
      win.print();
    }
  }, [buildShipmentHtml]);

  // ─── Email Shipment Bucket ────────────────
  const emailShipmentBucket = useCallback(async () => {
    const html = await buildShipmentHtml();
    if (!html || !formData) return;
    const contentBytes = btoa(unescape(encodeURIComponent(html)));
    await sendNotification({
      subject: `Shipment Bucket - ${formData.Title}`,
      to: userEmail,
      body: `Shipment bucket for <b>${formData.Title}</b> (${formData.JobName}) is attached.`,
      attachment: {
        name: `ShipmentBucket_${formData.Title}.html`,
        contentBytes,
        contentType: "text/html",
      },
    });
  }, [buildShipmentHtml, formData, userEmail]);

  // ─── Deliver: start scanner ───────────────
  const startScanner = useCallback(() => {
    setScannedItem(null);
    setScannedSessionID("");
    setDeliverStatus("");
    setTimeout(() => {
      const el = document.getElementById("qr-reader");
      if (!el) return;
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;
      scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          // Pause scanning while processing
          if (scannerRunningRef.current) {
            scannerRunningRef.current = false;
            try { await scanner.pause(); } catch { /* ignore */ }
          }
          try {
            const parsed = JSON.parse(decodedText);
            const itemId = Number(parsed.ID);
            const sessionID = String(parsed.sessionID || "");
            if (!itemId || !sessionID) {
              setDeliverStatus(`QR not recognized: "${decodedText}"`);
              try { scannerRunningRef.current = true; await scanner.resume(); } catch { /* ignore */ }
              return;
            }
            // Fetch items for this MRF
            const data = await apiPost(API_GET_ITEMS, { sessionID });
            const fetchedItems: MRFItem[] = (data?.value ?? data ?? []).map((r: Record<string, unknown>) => ({
              ID: r.ID as number,
              Title: (r.Title as string) || "",
              ItemDescription: (r.ItemDescription as string) || "",
              ItemCount: (r.ItemCount as number) || 0,
              IsEqu: !!(r.IsEqu),
              sessionID: (r.sessionID as string) || "",
              Action: (r.Action as string) || "",
              OrderCode: (r.OrderCode as string) || "",
            }));
            const found = fetchedItems.find((it) => it.ID === itemId);
            if (!found) {
              setDeliverStatus(`Item #${itemId} not found in ${sessionID}.`);
              try { scannerRunningRef.current = true; await scanner.resume(); } catch { /* ignore */ }
              return;
            }
            if (found.Action === "Delivered") {
              setDeliverStatus(`Item "${found.ItemDescription}" already delivered.`);
              try { scannerRunningRef.current = true; await scanner.resume(); } catch { /* ignore */ }
              return;
            }
            setScannedItem(found);
            setScannedSessionID(sessionID);
            setDeliverStatus("");
          } catch {
            setDeliverStatus("Could not read QR code data.");
            try { scannerRunningRef.current = true; await scanner.resume(); } catch { /* ignore */ }
          }
        },
        () => { /* ignore scan errors */ }
      ).then(() => { scannerRunningRef.current = true; }).catch(() => {
        setDeliverStatus("Camera access denied or not available.");
      });
    }, 100);
  }, []);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        if (scannerRunningRef.current) {
          await scannerRef.current.stop();
        }
      } catch { /* ignore */ }
      try { scannerRef.current.clear(); } catch { /* ignore */ }
      scannerRef.current = null;
      scannerRunningRef.current = false;
    }
  }, []);

  const openDeliverModal = useCallback(() => {
    setDeliverModal(true);
    setScannedItem(null);
    setDeliverStatus("");
    // Scanner starts after modal renders
    setTimeout(() => startScanner(), 200);
  }, [startScanner]);

  const closeDeliverModal = useCallback(async () => {
    await stopScanner();
    setDeliverModal(false);
    setScannedItem(null);
    setScannedSessionID("");
    setDeliverStatus("");
  }, [stopScanner]);

  // ─── Deliver: confirm scanned item ──────
  const confirmDeliverItem = useCallback(async () => {
    if (!scannedItem || !scannedSessionID) return;
    setDeliverSaving(true);
    setDeliverStatus("Saving delivery...");
    try {
      // Fetch latest items for the MRF
      const data = await apiPost(API_GET_ITEMS, { sessionID: scannedSessionID });
      const allItems: MRFItem[] = (data?.value ?? data ?? []).map((r: Record<string, unknown>) => ({
        ID: r.ID as number,
        Title: (r.Title as string) || "",
        ItemDescription: (r.ItemDescription as string) || "",
        ItemCount: (r.ItemCount as number) || 0,
        IsEqu: !!(r.IsEqu),
        sessionID: (r.sessionID as string) || "",
        Action: (r.Action as string) || "",
        OrderCode: (r.OrderCode as string) || "",
      }));
      // Update the scanned item's Action to "Delivered"
      const updatedItems = allItems.map((it) =>
        it.ID === scannedItem.ID ? { ...it, Action: "Delivered" } : it
      );
      // Save items
      const cleanedItems = updatedItems.map((item, idx) => ({
        ID: typeof item.ID === "number" ? item.ID : 0,
        Title: item.Title || item.ItemDescription || `Item ${idx + 1}`,
        ItemDescription: item.ItemDescription || item.Title || `Item ${idx + 1}`,
        ItemCount: typeof item.ItemCount === "number" ? item.ItemCount : 0,
        IsEqu: typeof item.IsEqu === "boolean" ? item.IsEqu : false,
        sessionID: item.sessionID || scannedSessionID,
        Action: typeof item.Action === "string" ? item.Action : "",
        OrderCode: typeof item.OrderCode === "string" ? item.OrderCode : "",
      }));
      await apiPost(API_SAVE_ITEMS, { sessionID: scannedSessionID, items: cleanedItems });
      // Determine new request status
      const allDelivered = updatedItems.every((it) => it.Action === "Delivered");
      const newStatus = allDelivered ? "Deliverd" : "Partially Delivered";
      // Find and update the request
      const req = requests.find((r) => r.Title === scannedSessionID);
      if (req) {
        const reqPayload = { ...req, RequestStatus: newStatus };
        await apiPost(API_SAVE_REQUEST, reqPayload);
      }
      setDeliverStatus(`✓ "${scannedItem.ItemDescription}" marked as Delivered.${allDelivered ? " All items delivered!" : ""}`);
      setScannedItem(null);
      setScannedSessionID("");
      await loadRequests();
      // If current MRF is open and matches, reload its items
      if (formData && formData.Title === scannedSessionID) {
        await loadItems(scannedSessionID);
      }
      // Restart scanner for next item
      await stopScanner();
      setTimeout(() => startScanner(), 300);
    } catch {
      setDeliverStatus("Failed to save delivery. Try again.");
    } finally {
      setDeliverSaving(false);
    }
  }, [scannedItem, scannedSessionID, requests, formData, loadRequests, loadItems, stopScanner, startScanner]);

  const cancelScannedItem = useCallback(async () => {
    setScannedItem(null);
    setScannedSessionID("");
    setDeliverStatus("");
    // Restart scanner
    await stopScanner();
    setTimeout(() => startScanner(), 300);
  }, [stopScanner, startScanner]);

  // ─── Back (mobile) ──────────────────────
  const goBackToList = useCallback(() => {
    setMobileDetail(false);
    setFormData(null);
    setSelected(null);
    setIsNew(false);
    setItems([]);
  }, []);

  // ─── @Mention: note change handler ────────
  const handleNoteChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    const pos = e.target.selectionStart ?? val.length;
    setNoteText(val);
    // Detect "@" trigger
    const before = val.slice(0, pos);
    const atIdx = before.lastIndexOf("@");
    if (atIdx >= 0 && (atIdx === 0 || /\s/.test(before[atIdx - 1]))) {
      const query = before.slice(atIdx + 1);
      if (!/\s/.test(query)) {
        setMentionStart(atIdx);
        setMentionFilter(query.toLowerCase());
        setMentionIndex(0);
        setMentionOpen(true);
        return;
      }
    }
    setMentionOpen(false);
  }, []);

  const handleNoteKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!mentionOpen) return;
    const people = mentionPeople();
    const filtered = people.filter(p => p.name.toLowerCase().includes(mentionFilter));
    if (e.key === "ArrowDown") { e.preventDefault(); setMentionIndex(i => Math.min(i + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setMentionIndex(i => Math.max(i - 1, 0)); }
    else if (e.key === "Enter" && filtered.length > 0) {
      e.preventDefault();
      selectMention(filtered[mentionIndex]);
    }
    else if (e.key === "Escape") { setMentionOpen(false); }
  }, [mentionOpen, mentionFilter, mentionIndex, mentionPeople]);

  const selectMention = useCallback((person: { name: string; email: string }) => {
    const val = noteText;
    const before = val.slice(0, mentionStart);
    const afterAt = val.slice(mentionStart);
    const spaceOrEnd = afterAt.search(/\s/);
    const after = spaceOrEnd >= 0 ? afterAt.slice(spaceOrEnd) : "";
    const newVal = before + "@" + person.name + " " + after;
    setNoteText(newVal);
    setMentionOpen(false);
    // Track mentioned email
    setMentionedEmails(prev => prev.includes(person.email) ? prev : [...prev, person.email]);
    // Refocus textarea
    setTimeout(() => {
      const ta = noteRef.current;
      if (ta) { const cursorPos = before.length + 1 + person.name.length + 1; ta.focus(); ta.setSelectionRange(cursorPos, cursorPos); }
    }, 0);
  }, [noteText, mentionStart]);

  // ─── Save Note (with mention notification) ──────
  const handleSaveNote = useCallback(async () => {
    if (!formData || !noteText.trim()) return;
    setNoteSaving(true);
    setStatus("Saving note...");
    try {
      const stamp = `${userName}(${new Date().toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\//g, "")}):\n${noteText.trim()}\n-----\n`;
      const updatedNote = stamp + (formData.Note || "");
      const requestPayload = {
        ...formData,
        Note: updatedNote,
        RequestDate: toISODate(formData.RequestDate),
        DeliverDate: toISODate(formData.DeliverDate),
      };
      await apiPost(API_SAVE_REQUEST, requestPayload);
      // Send notification to each mentioned person
      if (mentionedEmails.length > 0) {
        await sendNotification({
          subject: `MRF Note Mention: ${formData.Title}`,
          to: mentionedEmails.join(";"),
          cc: "",
          body: `Hi,<br><br>${userName} mentioned you in a note on MRF <b>${formData.Title}</b> (${formData.JobName}):<br><br><i>"${noteText.trim()}"</i><br><br>Please use the link below to open and respond:<br><a href='${APP_URL}&MRFCode=${formData.Title}'>Open ${formData.Title}</a><br>Thank you!`,
        });
      }
      setNoteText("");
      setMentionedEmails([]);
      setFormData({ ...formData, Note: updatedNote });
      formDataRef.current = { ...formData, Note: updatedNote };
      setStatus("Note saved.");
      await loadRequests();
    } catch {
      setStatus("Failed to save note.");
    } finally {
      setNoteSaving(false);
    }
  }, [formData, noteText, userName, mentionedEmails, loadRequests]);

  // ─── Filtered sidebar list ──────────────
  const visibleRequests = isAdmin || isInventory1 || isInventory2 || isShipment
    ? requests
    : requests.filter((r) => {
        // Show if user is the requester
        if (r.Requester?.toLowerCase() === userName.toLowerCase()) return true;
        // Show if user is a PM on the project
        const proj = projectList.find(p => p.Title === r.JobName);
        if (proj && userEmail) {
          const pmEmails = [proj.ProjectManager, proj.ProjectManager2, proj.ProjectManager3];
          if (pmEmails.some(pm => pm && typeof pm === "string" && pm.toLowerCase() === userEmail.toLowerCase())) return true;
        }
        return false;
      });

  const filteredRequests = search.trim()
    ? visibleRequests.filter(
        (r) =>
          r.Title.toLowerCase().includes(search.toLowerCase()) ||
          r.JobName.toLowerCase().includes(search.toLowerCase()) ||
          r.Requester.toLowerCase().includes(search.toLowerCase())
      )
    : visibleRequests;

  const filteredMaterials = materialFilter.trim()
    ? materialList.filter((m) => m.toLowerCase().includes(materialFilter.toLowerCase()))
    : materialList;

  // ═════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════
  return (
    <div className="mrf-page">
      {/* ── Header Bar ──────────────────── */}
      <div className="mrf-header">
        <div className="mrf-header-left">
          <span className="mrf-header-icon">📋</span>
          <span className="mrf-header-title">Material Request Form</span>
        </div>
        {status && <div className="mrf-header-status">{status}</div>}
      </div>

      {/* ── Body: Sidebar + Detail ──────── */}
      <div className="mrf-body">
        {/* ── Sidebar ────────────────────── */}
        <aside className={`mrf-sidebar${mobileDetail ? " mrf-sidebar--hidden" : ""}`}>
          <div className="mrf-search-box">
            <svg className="mrf-search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              className="mrf-search-input"
              type="text"
              placeholder="Search MRFs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="mrf-sidebar-actions">
            <button className="mrf-btn mrf-btn--new" type="button" onClick={newMRF}>
              <span>+</span> New
            </button>
            <button className="mrf-btn mrf-btn--deliver" type="button" onClick={openDeliverModal}>
              Deliver
            </button>
            <button className="mrf-btn mrf-btn--refresh" type="button" onClick={loadRequests} disabled={listLoading} title="Refresh list">
              {listLoading ? <div className="mrf-spinner-sm" /> : "⟳"}
            </button>
          </div>

          <div className="mrf-list" ref={listContainerRef}>
            {listLoading ? (
              <div className="mrf-list-empty">Loading...</div>
            ) : filteredRequests.length === 0 ? (
              <div className="mrf-list-empty">No MRF records found.</div>
            ) : (
              filteredRequests.map((mrf) => (
                <button
                  key={mrf.Title}
                  className={`mrf-list-item${selected?.Title === mrf.Title ? " mrf-list-item--active" : ""}`}
                  type="button"
                  onClick={() => selectMRF(mrf)}
                >
                  <div className="mrf-list-item-title">{mrf.Title}</div>
                  <div className="mrf-list-item-requester">{mrf.Requester}</div>
                  <div
                    className="mrf-list-item-status"
                    style={{ backgroundColor: STATUS_COLORS[mrf.RequestStatus] || "#9CA3AF" }}
                  >
                    {mrf.RequestStatus}
                  </div>
                  <svg className="mrf-list-chevron" width="8" height="14" viewBox="0 0 8 14" fill="none">
                    <path d="M1 1L7 7L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* ── Detail Panel ───────────────── */}
        <section className={`mrf-detail${mobileDetail ? " mrf-detail--visible" : ""}`}>
          {!formData && !isNew ? (
            <div className="mrf-detail-empty">
              <span className="mrf-detail-empty-icon">📋</span>
              <p>Select an MRF from the list or create a new one</p>
            </div>
          ) : (
            <>
              {detailLoading && (
                <div className="mrf-detail-loading-overlay">
                  <div className="mrf-spinner" />
                  <span>Loading items...</span>
                </div>
              )}
              {/* ── Detail top bar ───────── */}
              <div className="mrf-detail-topbar">
                <button className="mrf-btn-back" type="button" onClick={goBackToList}>
                  ←
                </button>
                <div className="mrf-detail-topbar-title">{formData?.Title || "New MRF"}</div>
                <div className="mrf-detail-topbar-actions">
                  {canShipment && (
                    <button className="mrf-toolbar-btn" type="button" onClick={() => setShipmentModal(true)}>
                      🛒 Shipment
                    </button>
                  )}
                  {canSend && (
                    <button
                      className="mrf-toolbar-btn mrf-toolbar-btn--send"
                      type="button"
                      disabled={saving}
                      onClick={() => setSendConfirm(true)}
                    >
                      📤 Save &amp; Send
                    </button>
                  )}
                  {canSave && (
                    <button
                      className="mrf-toolbar-btn mrf-toolbar-btn--save"
                      type="button"
                      disabled={saving || (isNew && items.length === 0) || items.some(it => !it.ItemDescription?.trim())}
                      onClick={handleSave}
                    >
                      💾 Save
                    </button>
                  )}
                  {canDelete && (
                    <button
                      className="mrf-toolbar-btn mrf-toolbar-btn--delete"
                      type="button"
                      disabled={saving}
                      onClick={() => setDeleteConfirm(true)}
                    >
                      🗑️ Delete
                    </button>
                  )}
                </div>
              </div>

              {/* ── Form fields ──────────── */}
              <div className="mrf-form-scroll">
                <div className="mrf-form">
                  <div className="mrf-form-grid">
                    <div className="mrf-field">
                      <label className="mrf-label">Title</label>
                      <input className="mrf-input mrf-input--readonly" type="text" value={formData?.Title || ""} readOnly />
                    </div>
                    <div className="mrf-field">
                      <label className="mrf-label">Request Date</label>
                      <input
                        className="mrf-input"
                        type="date"
                        value={toISODate(formData?.RequestDate || "")}
                        readOnly
                      />
                    </div>
                    <div className="mrf-field">
                      <label className="mrf-label">Deliver Date</label>
                      <input
                        className="mrf-input"
                        type="date"
                        value={toISODate(formData?.DeliverDate || "")}
                        onChange={(e) => setField("DeliverDate", e.target.value)}
                        disabled={!canEditForm}
                      />
                    </div>
                    <div className="mrf-field">
                      <label className="mrf-label">Requester</label>
                      <input className="mrf-input mrf-input--readonly" type="text" value={formData?.Requester || ""} readOnly />
                    </div>
                    <div className="mrf-field">
                      <label className="mrf-label">Job Name</label>
                      {isNew ? (
                        <select
                          className={`mrf-select${!formData?.JobName ? " mrf-select--required" : ""}`}
                          value={formData?.JobName || ""}
                          onChange={(e) => setJobFromProject(e.target.value)}
                        >
                          <option value="">-- Select Project --</option>
                          {projectList.map((p) => (
                            <option key={p.Title} value={p.Title}>
                              {p.Title}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input className="mrf-input mrf-input--readonly" type="text" value={formData?.JobName || ""} readOnly />
                      )}
                    </div>
                    <div className="mrf-field">
                      <label className="mrf-label">Job No</label>
                      <input className="mrf-input mrf-input--readonly" type="text" value={formData?.JobNo || ""} readOnly />
                    </div>
                    <div className="mrf-field">
                      <label className="mrf-label">Shipment Phone</label>
                      <input
                        className="mrf-input"
                        type="tel"
                        value={formData?.ShipmentPhone || ""}
                        onChange={(e) => setField("ShipmentPhone", e.target.value)}
                        disabled={!canEditForm}
                      />
                    </div>
                    <div className="mrf-field">
                      <label className="mrf-label">Shipment Address</label>
                      <input
                        className="mrf-input"
                        type="text"
                        value={formData?.ShipmentAddress || ""}
                        onChange={(e) => setField("ShipmentAddress", e.target.value)}
                        disabled={!canEditForm}
                      />
                    </div>
                    <div className="mrf-field">
                      <label className="mrf-label">Request Status</label>
                      <div className="mrf-status-display">
                        <span
                          className="mrf-status-badge"
                          style={{ backgroundColor: STATUS_COLORS[formData?.RequestStatus || ""] || "#9CA3AF" }}
                        >
                          {formData?.RequestStatus || ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ── Notes ──────────────── */}
                  <div className="mrf-notes-section">
                    <div className="mrf-notes-header">
                      <label className="mrf-label">Notes</label>
                    </div>
                    {canEditForm && (
                      <div className="mrf-note-input-row" style={{ position: "relative" }}>
                        <textarea
                          ref={noteRef}
                          className="mrf-note-input"
                          rows={2}
                          placeholder="Add a note... (type @ to mention someone)"
                          value={noteText}
                          onChange={handleNoteChange}
                          onKeyDown={handleNoteKeyDown}
                        />
                        {mentionOpen && (() => {
                          const people = mentionPeople();
                          const filtered = people.filter(p => p.name.toLowerCase().includes(mentionFilter));
                          if (filtered.length === 0) return null;
                          return (
                            <div className="mrf-mention-dropdown">
                              {filtered.map((p, i) => (
                                <button
                                  key={p.email}
                                  type="button"
                                  className={`mrf-mention-option${i === mentionIndex ? " mrf-mention-option--active" : ""}`}
                                  onMouseDown={(e) => { e.preventDefault(); selectMention(p); }}
                                >
                                  {p.name}
                                </button>
                              ))}
                            </div>
                          );
                        })()}
                        {noteText.trim() && (
                          <button
                            className="mrf-btn mrf-btn--sm mrf-btn--note-save"
                            type="button"
                            disabled={noteSaving}
                            onClick={handleSaveNote}
                          >
                            {noteSaving ? "Saving..." : "💬 Save Note"}
                          </button>
                        )}
                      </div>
                    )}
                    {formData?.Note && (
                      <div className="mrf-notes-history">
                        {formData.Note.split("-----").filter(Boolean).map((block, i) => (
                          <div key={i} className="mrf-note-block">{block.trim()}</div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ── Items section ──────── */}
                  <div className="mrf-items-section">
                    <div className="mrf-items-header">
                      <span className="mrf-items-title">Request Items</span>
                      {canEditForm && (
                        <div className="mrf-items-actions">
                          <button className="mrf-btn mrf-btn--sm" type="button" onClick={() => { setMaterialFilter(""); setPickListModal(true); }}
                            disabled={!(isNew || formData?.RequestStatus === "Saved" || formData?.RequestStatus === "Avaliablity Check" || formData?.RequestStatus === "Inventory Management")}
                          >
                            + Pick From List
                          </button>
                          <button className="mrf-btn mrf-btn--sm" type="button" onClick={addBlankItem}
                            disabled={!(isNew || formData?.RequestStatus === "Saved" || formData?.RequestStatus === "Avaliablity Check" || formData?.RequestStatus === "Inventory Management")}
                          >
                            + New Item
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="mrf-items-table-wrap">
                      <table className="mrf-items-table">
                        <thead>
                          <tr>
                            {canEditForm && <th className="mrf-th-action"></th>}
                            <th>Item Description / Equipment</th>
                            <th className="mrf-th-count">Count</th>
                            <th className="mrf-th-action-col">Action</th>
                            <th className="mrf-th-order">Order Code</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.length === 0 ? (
                            <tr>
                              <td colSpan={canEditForm ? 5 : 4} className="mrf-items-empty">
                                No items added yet.
                              </td>
                            </tr>
                          ) : (
                            items.map((item, idx) => (
                              <tr key={idx} className="mrf-item-row">
                                {canEditForm && (
                                  <td className="mrf-td-delete">
                                    <button
                                      className="mrf-item-delete"
                                      type="button"
                                      onClick={() => removeItem(idx)}
                                      title="Remove"
                                      disabled={!(isNew || formData?.RequestStatus === "Saved" || formData?.RequestStatus === "Avaliablity Check" || formData?.RequestStatus === "Inventory Management")}
                                      style={!(isNew || formData?.RequestStatus === "Saved" || formData?.RequestStatus === "Avaliablity Check" || formData?.RequestStatus === "Inventory Management") ? { opacity: 0.3, cursor: "not-allowed" } : undefined}
                                    >
                                      🗑️
                                    </button>
                                  </td>
                                )}
                                <td>
                                  {canEditForm && (isNew || formData?.RequestStatus === "Saved" || formData?.RequestStatus === "Avaliablity Check" || formData?.RequestStatus === "Inventory Management") ? (
                                    <input
                                      className={`mrf-item-input${!item.ItemDescription?.trim() ? " mrf-item-input--required" : ""}`}
                                      type="text"
                                      value={item.ItemDescription}
                                      onChange={(e) => updateItem(idx, "ItemDescription", e.target.value)}
                                      placeholder="Enter item description"
                                    />
                                  ) : (
                                    <span>{item.ItemDescription}</span>
                                  )}
                                </td>
                                <td className="mrf-td-count">
                                  {canEditForm && (isNew || formData?.RequestStatus === "Saved" || formData?.RequestStatus === "Avaliablity Check" || formData?.RequestStatus === "Inventory Management") ? (
                                    <input
                                      className="mrf-item-input mrf-item-input--count"
                                      type="number"
                                      min={1}
                                      value={item.ItemCount}
                                      onChange={(e) => updateItem(idx, "ItemCount", parseInt(e.target.value) || 0)}
                                    />
                                  ) : (
                                    <span className={item.Action === "Inventory available" ? "mrf-count-green" : ""}>
                                      {item.ItemCount}
                                    </span>
                                  )}
                                </td>
                                <td>
                                  {canEditForm && formData?.RequestStatus !== "Saved" ? (
                                    (() => {
                                      // Build options: include current value + allowed transitions
                                      const filtered = ACTION_OPTIONS
                                        .filter((opt) => {
                                          const st = formData?.RequestStatus;
                                          if (opt === "Inventory available") return st === "Avaliablity Check" || st === "Inventory Management" || (isInventory2 && st === "Shipment/Purchase order" && item.Action === "Ordered") || (isShipment && (st === "Shipment/Purchase order" || st === "Partially Delivered"));
                                          if (opt === "To be ordered by PM") return st === "Avaliablity Check" || st === "Inventory Management";
                                          if (opt === "Ordered") return isPM && st === "Shipment/Purchase order" && item.Action === "To be ordered by PM";
                                          return false;
                                        });
                                      // Always include current value so the dropdown shows it as selected
                                      const options = item.Action && !filtered.includes(item.Action)
                                        ? [item.Action, ...filtered]
                                        : filtered;
                                      // If no transition options and item already has a value, show as read-only text
                                      if (filtered.length === 0 && item.Action) {
                                        return (
                                          <span className={`mrf-action-text ${item.Action === "Inventory available" ? "mrf-action--available" : item.Action === "To be ordered by PM" ? "mrf-action--order" : ""}`}>
                                            {item.Action}
                                          </span>
                                        );
                                      }
                                      return (
                                        <select
                                          className="mrf-item-select"
                                          value={item.Action}
                                          onChange={(e) => updateItem(idx, "Action", e.target.value)}
                                        >
                                          {!item.Action && <option value="">-- Select --</option>}
                                          {options.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                          ))}
                                        </select>
                                      );
                                    })()
                                  ) : (
                                    <span className={`mrf-action-text ${item.Action === "Inventory available" ? "mrf-action--available" : item.Action === "To be ordered by PM" ? "mrf-action--order" : ""}`}>
                                      {item.Action || "—"}
                                    </span>
                                  )}
                                </td>
                                <td>
                                  {item.Action === "Ordered" ? (
                                    <input
                                      className="mrf-item-input mrf-item-input--order"
                                      type="text"
                                      value={item.OrderCode}
                                      onChange={(e) => updateItem(idx, "OrderCode", e.target.value)}
                                      placeholder="PO#"
                                    />
                                  ) : (
                                    <span>{item.OrderCode || "—"}</span>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      {/* ═══ MODALS ═══════════════════════════ */}

      {/* ── Delete Confirm ─────────────── */}
      {deleteConfirm && (
        <div className="mrf-overlay">
          <div className="mrf-modal mrf-modal--sm">
            <div className="mrf-modal-title">Delete MRF</div>
            <p className="mrf-modal-text">Are you sure you want to delete <strong>{formData?.Title}</strong>? This cannot be undone.</p>
            <div className="mrf-modal-actions">
              <button className="mrf-btn" type="button" disabled={saving} onClick={() => setDeleteConfirm(false)}>Cancel</button>
              <button className="mrf-btn mrf-btn--danger" type="button" disabled={saving} onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Send Confirm ──────────────── */}
      {sendConfirm && (
        <div className="mrf-overlay">
          <div className="mrf-modal mrf-modal--sm">
            <div className="mrf-modal-title">Send MRF</div>
            <p className="mrf-modal-text">
              Send <strong>{formData?.Title}</strong> to the next step?
              <br />
              Status will change: <strong>{formData?.RequestStatus}</strong> → <strong>{STATUS_FLOW[formData?.RequestStatus || ""] || "?"}</strong>
            </p>
            <div className="mrf-modal-actions">
              <button className="mrf-btn" type="button" disabled={saving} onClick={() => setSendConfirm(false)}>Cancel</button>
              <button className="mrf-btn mrf-btn--primary" type="button" disabled={saving} onClick={handleSaveAndSend}>
                {saving ? "Sending..." : "Confirm & Send"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Shipment Modal ────────────── */}
      {shipmentModal && (
        <div className="mrf-overlay">
          <div className="mrf-modal">
            <div className="mrf-modal-title">Shipment Bucket — {formData?.Title}</div>
            <p className="mrf-modal-text">Items marked as "Inventory available" will be included in the shipment bucket:</p>
            <div className="mrf-shipment-list">
              {items.filter((it) => it.Action === "Inventory available").map((it, i) => (
                <div key={i} className="mrf-shipment-item">
                  <span>{it.ItemDescription}</span>
                  <span className="mrf-shipment-count">×{it.ItemCount}</span>
                </div>
              ))}
              {items.filter((it) => it.Action === "Inventory available").length === 0 && (
                <div className="mrf-items-empty">No items marked as "Inventory available".</div>
              )}
            </div>
            <div className="mrf-modal-actions">
              <button className="mrf-btn mrf-btn--danger" type="button" onClick={() => setShipmentModal(false)}>✕ Close</button>
              <button className="mrf-btn mrf-btn--primary" type="button" disabled={saving || items.filter((it) => it.Action === "Inventory available").length === 0} onClick={async () => { setSaving(true); try { await printShipmentBucket(); await emailShipmentBucket(); setShipmentModal(false); setStatus("Shipment email sent."); } catch { setStatus("Failed to send shipment email."); } finally { setSaving(false); } }}>
                {saving ? "Processing..." : "✓ Confirm and print shipment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Deliver Scanner Modal ─────────────── */}
      {deliverModal && (
        <div className="mrf-overlay">
          <div className="mrf-modal mrf-modal--deliver">
            <div className="mrf-modal-title">📷 Deliver — Scan QR Code</div>
            {!scannedItem ? (
              <>
                <div id="qr-reader" className="mrf-qr-reader" />
                {deliverStatus && <div className="mrf-deliver-status">{deliverStatus}</div>}
                <div className="mrf-modal-actions">
                  <button className="mrf-btn mrf-btn--danger" type="button" onClick={closeDeliverModal}>✕ Close Scanner</button>
                </div>
              </>
            ) : (
              <div className="mrf-deliver-confirm">
                <div className="mrf-deliver-item-detail">
                  <div className="mrf-deliver-field"><label>MRF:</label><span>{scannedSessionID}</span></div>
                  <div className="mrf-deliver-field"><label>Item ID:</label><span>{scannedItem.ID}</span></div>
                  <div className="mrf-deliver-field"><label>Description:</label><span>{scannedItem.ItemDescription}</span></div>
                  <div className="mrf-deliver-field"><label>Count:</label><span>{scannedItem.ItemCount}</span></div>
                  <div className="mrf-deliver-field"><label>Current Action:</label><span>{scannedItem.Action || "—"}</span></div>
                </div>
                {deliverStatus && <div className="mrf-deliver-status">{deliverStatus}</div>}
                <div className="mrf-modal-actions">
                  <button className="mrf-btn" type="button" disabled={deliverSaving} onClick={cancelScannedItem}>Cancel</button>
                  <button className="mrf-btn mrf-btn--primary" type="button" disabled={deliverSaving} onClick={confirmDeliverItem}>
                    {deliverSaving ? "Saving..." : "✓ Confirm Delivery"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Pick From List Modal ──────── */}
      {pickListModal && (
        <div className="mrf-overlay">
          <div className="mrf-modal mrf-modal--picklist">
            <div className="mrf-modal-title">Pick Material From Catalog</div>
            <input
              className="mrf-input mrf-picklist-search"
              type="text"
              placeholder="Filter materials..."
              value={materialFilter}
              onChange={(e) => setMaterialFilter(e.target.value)}
              autoFocus
            />
            <div className="mrf-picklist-items">
              {filteredMaterials.length === 0 ? (
                <div className="mrf-items-empty">No materials match your filter.</div>
              ) : (
                filteredMaterials.map((m) => (
                  <button key={m} className="mrf-picklist-row" type="button" onClick={() => addFromPickList(m)}>
                    {m}
                  </button>
                ))
              )}
            </div>
            <div className="mrf-modal-actions">
              <button className="mrf-btn" type="button" onClick={() => setPickListModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
