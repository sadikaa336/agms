// Real API Client connecting frontend to backend REST endpoints

const BASE_URL = typeof window !== "undefined" ? "" : "http://localhost:8080";

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  nationalId?: string;
  address?: string;
  division?: string;
  district?: string;
  area?: string;
  projectName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Division {
  id: number;
  name: string;
  createdAt?: string;
}

export interface District {
  id: number;
  divisionId: number;
  divisionName?: string;
  name: string;
  createdAt?: string;
}

export interface Area {
  id: number;
  districtId: number;
  districtName?: string;
  divisionName?: string;
  name: string;
  postalCode?: string;
  createdAt?: string;
}

export interface Project {
  id: number;
  areaId?: number | null;
  areaName?: string;
  name: string;
  code?: string;
  description?: string;
  status: "ACTIVE" | "PLANNING" | "COMPLETED" | string;
  createdAt?: string;
}

export interface LocationsSummary {
  divisions: Division[];
  districts: District[];
  areas: Area[];
  projects: Project[];
}

export interface GasMeter {
  id: number;
  meterNumber: string;
  serialNumber: string;
  communicationId: string;
  firmwareVersion?: string;
  status: "ACTIVE" | "INACTIVE" | "REPLACED" | string;
  valveStatus: "OPEN" | "CLOSED" | string;
  installationLocation?: string;
  customer?: Customer | null;
  reading?: number;
  balance?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Tariff {
  id: number;
  name: string;
  unitPrice: number;
  vatPercentage: number;
  fixedCharge: number;
  serviceCharge: number;
  isActive: boolean;
  createdAt?: string;
}

export interface Recharge {
  id: number;
  meter?: GasMeter | null;
  amount: number;
  token: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

export interface CommunicationLog {
  id: number;
  meter?: GasMeter | null;
  direction: "INCOMING" | "OUTGOING" | string;
  packetData: string;
  status: "SUCCESS" | "ERROR" | "RETRY" | string;
  retryCount: number;
  errorMessage?: string;
  createdAt: string;
}

export interface AuditLog {
  id: number;
  action: string;
  details?: string;
  ipAddress?: string;
  createdAt: string;
}

export interface UserAccount {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt?: string;
}

export interface DashboardStats {
  totalCustomers: number;
  totalMeters: number;
  activeMeters: number;
  offlineMeters: number;
  alarms: number;
  todayConsumption: number;
  totalRecharge: number;
  revenue: number;
  meterStatusSeries: { name: string; value: number }[];
  consumptionSeries: { d: string; usage: number; revenue: number }[];
  recentActivity: { id: string; type: string; detail: string; status: string; when: string }[];
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(options?.headers || {}),
      },
    });

    if (!res.ok) {
      let errMsg = `Request failed: ${res.status} ${res.statusText}`;
      try {
        const errorData = await res.json();
        if (errorData?.error) errMsg = errorData.error;
      } catch {
        // fallback to status text
      }
      throw new Error(errMsg);
    }

    if (res.status === 204) {
      return {} as T;
    }

    return (await res.json()) as T;
  } catch (err: any) {
    console.warn(`API Error [${endpoint}]:`, err.message);
    throw err;
  }
}

export const api = {
  // Authentication
  login: (credentials: { username: string; password: string }) =>
    request<{
      id: number;
      username: string;
      email: string;
      role: "SUPER_ADMIN" | "FIELD_ENGINEER" | "SUPPORT_STAFF" | "CONSUMER";
      customerId?: number | null;
      token: string;
    }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  // Dashboard
  getDashboardStats: () => request<DashboardStats>("/api/dashboard/stats"),

  // Meters
  getMeters: () => request<GasMeter[]>("/api/meters"),
  getMeterById: (id: number) => request<GasMeter>(`/api/meters/${id}`),
  createMeter: (meter: Partial<GasMeter>, customerId?: number) =>
    request<GasMeter>(`/api/meters${customerId ? `?customerId=${customerId}` : ""}`, {
      method: "POST",
      body: JSON.stringify(meter),
    }),
  updateMeter: (id: number, meter: Partial<GasMeter>, customerId?: number) =>
    request<GasMeter>(`/api/meters/${id}${customerId ? `?customerId=${customerId}` : ""}`, {
      method: "PUT",
      body: JSON.stringify(meter),
    }),
  toggleValve: (id: number, valveStatus: "OPEN" | "CLOSED") =>
    request<GasMeter>(`/api/meters/${id}/valve`, {
      method: "POST",
      body: JSON.stringify({ valveStatus }),
    }),
  deleteMeter: (id: number) =>
    request<void>(`/api/meters/${id}`, {
      method: "DELETE",
    }),
  sendTelemetry: (telemetry: {
    communicationId: string;
    usage: number;
    reading: number;
    balance: number;
    pressure?: number;
    temperature?: number;
    valveStatus?: "OPEN" | "CLOSED" | string;
  }) =>
    request<{
      status: string;
      meterId: number;
      balance: number;
      reading: number;
      valveStatus: "OPEN" | "CLOSED";
    }>("/api/meters/telemetry", {
      method: "POST",
      body: JSON.stringify(telemetry),
    }),

  // Customers
  getCustomers: () => request<Customer[]>("/api/customers"),
  getCustomerById: (id: number) => request<Customer>(`/api/customers/${id}`),
  createCustomer: (customer: Partial<Customer>) =>
    request<Customer>("/api/customers", {
      method: "POST",
      body: JSON.stringify(customer),
    }),
  updateCustomer: (id: number, customer: Partial<Customer>) =>
    request<Customer>(`/api/customers/${id}`, {
      method: "PUT",
      body: JSON.stringify(customer),
    }),
  deleteCustomer: (id: number) =>
    request<void>(`/api/customers/${id}`, {
      method: "DELETE",
    }),

  // Tariffs
  getTariffs: () => request<Tariff[]>("/api/tariffs"),
  createTariff: (tariff: Partial<Tariff>) =>
    request<Tariff>("/api/tariffs", {
      method: "POST",
      body: JSON.stringify(tariff),
    }),
  updateTariff: (id: number, tariff: Partial<Tariff>) =>
    request<{ success: boolean }>(`/api/tariffs/${id}`, {
      method: "PUT",
      body: JSON.stringify(tariff),
    }),
  deleteTariff: (id: number) =>
    request<void>(`/api/tariffs/${id}`, {
      method: "DELETE",
    }),

  // Recharges
  getRecharges: () => request<Recharge[]>("/api/recharges"),
  createRecharge: (meterId: number, amount: number, paymentMethod: string) =>
    request<Recharge>("/api/recharges", {
      method: "POST",
      body: JSON.stringify({ meterId, amount, paymentMethod }),
    }),

  // Logs
  getCommunicationLogs: () => request<CommunicationLog[]>("/api/logs/communication"),
  getAuditLogs: () => request<AuditLog[]>("/api/logs/audit"),

  // Users
  getUsers: () => request<UserAccount[]>("/api/users"),
  createUser: (user: { username: string; email: string; passwordHash: string; role: string }) =>
    request<UserAccount>("/api/users", {
      method: "POST",
      body: JSON.stringify(user),
    }),
  deleteUser: (id: number) =>
    request<void>(`/api/users/${id}`, {
      method: "DELETE",
    }),

  // Locations & Zoning
  getLocationsSummary: () => request<LocationsSummary>("/api/locations/summary"),
  createDivision: (data: { name: string }) =>
    request<Division>("/api/locations/divisions", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  deleteDivision: (id: number) =>
    request<void>(`/api/locations/divisions/${id}`, {
      method: "DELETE",
    }),
  createDistrict: (data: { divisionId: number; name: string }) =>
    request<District>("/api/locations/districts", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  deleteDistrict: (id: number) =>
    request<void>(`/api/locations/districts/${id}`, {
      method: "DELETE",
    }),
  createArea: (data: { districtId: number; name: string; postalCode?: string }) =>
    request<Area>("/api/locations/areas", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  deleteArea: (id: number) =>
    request<void>(`/api/locations/areas/${id}`, {
      method: "DELETE",
    }),
  createProject: (data: { areaId?: number | null; name: string; code?: string; description?: string; status?: string }) =>
    request<Project>("/api/locations/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  deleteProject: (id: number) =>
    request<void>(`/api/locations/projects/${id}`, {
      method: "DELETE",
    }),
};
