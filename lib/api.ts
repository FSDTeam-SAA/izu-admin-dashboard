import api from "./axios";
import type {
  AdminStatistics,
  ApiResponse,
  CommissionReport,
  PaginatedResponse,
  Profile,
  ProviderListItem,
  RecentActivity,
  RevenuePoint,
  TopService,
  UserListItem,
} from "./types";

/* -------------------------------------------------------------------------- */
/*                                    Auth                                    */
/* -------------------------------------------------------------------------- */

export async function forgotPassword(email: string) {
  const { data } = await api.post<ApiResponse<{ email: string; otpExpiry: number }>>(
    "/auth/forgot-password",
    { email }
  );
  return data;
}

export async function verifyOtp(payload: { email: string; otp: string }) {
  const { data } = await api.post<ApiResponse<{ email: string }>>(
    "/auth/verify-otp",
    payload
  );
  return data;
}

export async function resetPassword(payload: {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}) {
  const { data } = await api.post<ApiResponse<{ email: string }>>(
    "/auth/reset-password",
    payload
  );
  return data;
}

/* -------------------------------------------------------------------------- */
/*                                  Dashboard                                 */
/* -------------------------------------------------------------------------- */

export async function getStatistics() {
  const { data } = await api.get<ApiResponse<AdminStatistics>>(
    "/admin/statistics"
  );
  return data.data;
}

export async function getRevenueByMonth(year?: number) {
  const { data } = await api.get<ApiResponse<RevenuePoint[]>>(
    "/admin/revenue-by-month",
    { params: year ? { year } : undefined }
  );
  return data.data;
}

export async function getRecentActivity(days: 1 | 7) {
  const { data } = await api.get<ApiResponse<RecentActivity[]>>(
    "/admin/recent-activity",
    { params: { days } }
  );
  return data.data;
}

export async function getTopServices(timeFilter: "allTime" | "7days") {
  const { data } = await api.get<ApiResponse<TopService[]>>(
    "/admin/top-services",
    { params: timeFilter === "7days" ? { timeFilter: "7days" } : undefined }
  );
  return data.data;
}

/* -------------------------------------------------------------------------- */
/*                                   Lists                                    */
/* -------------------------------------------------------------------------- */

export async function getUserList(params: { page: number; limit: number }) {
  const { data } = await api.get<PaginatedResponse<UserListItem>>(
    "/admin/users",
    { params }
  );
  return data;
}

export async function getProviderList(params: { page: number; limit: number }) {
  const { data } = await api.get<PaginatedResponse<ProviderListItem>>(
    "/admin/providers",
    { params }
  );
  return data;
}

export async function getCommissionReports(params: {
  page: number;
  limit: number;
}) {
  const { data } = await api.get<PaginatedResponse<CommissionReport>>(
    "/admin/commission-reports",
    { params }
  );
  return data;
}

/* -------------------------------------------------------------------------- */
/*                                  Profile                                   */
/* -------------------------------------------------------------------------- */

export async function getProfile() {
  const { data } = await api.get<ApiResponse<Profile>>("/profile");
  return data.data;
}

export async function updateProfile(formData: FormData) {
  const { data } = await api.patch<ApiResponse<Profile>>("/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
}

export async function changePassword(payload: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  const { data } = await api.patch<ApiResponse<unknown>>(
    "/profile/change-password",
    payload
  );
  return data;
}
