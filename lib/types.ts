export interface ApiResponse<T> {
  statusCode?: number;
  success: boolean;
  message: string;
  data: T;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: PaginationMeta;
}

export interface AdminStatistics {
  totalUser: number;
  totalProvider: number;
  totalOrder: number;
  totalAdminEarning: number;
}

export interface RevenuePoint {
  month: string;
  revenue: number;
}

export interface RecentActivity {
  _id: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  userId?: { _id: string; name?: string } | null;
  providerId?: { _id: string; name?: string } | null;
  serviceId?: {
    _id: string;
    serviceDetails?: { title?: string };
  } | null;
}

export interface TopService {
  _id: string;
  title?: string;
  totalBookings: number;
  percentage: number;
}

export interface UserListItem {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  totalCompletedOrder: number;
}

export interface ProviderListItem {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  serviceCount: number;
}

export interface CommissionReport {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  completedOrder: number;
  totalPayment: number;
  adminProfit: number;
}

export interface Profile {
  _id: string;
  name?: string;
  lastName?: string;
  bio?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  accountType?: string;
  language?: string;
  createdAt?: string;
}
