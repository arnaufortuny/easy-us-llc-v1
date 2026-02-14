import { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest, getCsrfToken } from "@/lib/queryClient";
import { formatDateShort } from "@/lib/utils";
import type { TFunction } from "i18next";
import { AdminUserData, DiscountCode } from "@/components/dashboard";

interface UseAdminStateParams {
  user: any;
  t: TFunction;
  setFormMessage: (msg: { type: 'success' | 'error' | 'info'; text: string } | null) => void;
  isAuthenticated: boolean;
  isTabFocused: boolean;
  activeTab: string;
  syncTabToUrl: (tab: any, subtab?: string) => void;
  subTabFromUrl: string | null;
}

export function useAdminState(params: UseAdminStateParams) {
  const { user, t, setFormMessage, isTabFocused, activeTab, syncTabToUrl, subTabFromUrl } = params;

  const [editingUser, setEditingUser] = useState<AdminUserData | null>(null);
  const [paymentDialog, setPaymentDialog] = useState<{ open: boolean; user: AdminUserData | null }>({ open: false, user: null });
  const [paymentLink, setPaymentLink] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [docDialog, setDocDialog] = useState<{ open: boolean; user: AdminUserData | null }>({ open: false, user: null });
  const [docType, setDocType] = useState("");
  const [docMessage, setDocMessage] = useState("");
  const [docRejectDialog, setDocRejectDialog] = useState<{ open: boolean; docId: number | null }>({ open: false, docId: null });
  const [docRejectReason, setDocRejectReason] = useState("");
  const [noteDialog, setNoteDialog] = useState<{ open: boolean; user: AdminUserData | null }>({ open: false, user: null });
  const [noteTitle, setNoteTitle] = useState("");
  const [noteMessage, setNoteMessage] = useState("");
  const [noteType, setNoteType] = useState("info");
  const [invoiceDialog, setInvoiceDialog] = useState<{ open: boolean; user: AdminUserData | null }>({ open: false, user: null });
  const [invoiceConcept, setInvoiceConcept] = useState("");
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [invoiceCurrency, setInvoiceCurrency] = useState("EUR");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [invoicePaymentAccountIds, setInvoicePaymentAccountIds] = useState<number[]>([]);
  const [adminSubTab, setAdminSubTabRaw] = useState(subTabFromUrl || (user?.isSupport && !user?.isAdmin ? "orders" : "dashboard"));

  const [ordersPage, setOrdersPage] = useState(1);
  const [usersPage, setUsersPage] = useState(1);
  const [messagesPage, setMessagesPage] = useState(1);
  const [adminSearchQuery, setAdminSearchQuery] = useState("");

  const setAdminSubTab = useCallback((sub: string) => {
    setAdminSubTabRaw(sub);
    syncTabToUrl('admin', sub);
    setOrdersPage(1);
    setUsersPage(1);
    setMessagesPage(1);
    setAdminSearchQuery('');
  }, [syncTabToUrl]);

  const [commSubTab, setCommSubTab] = useState<'inbox' | 'agenda'>('inbox');
  const [usersSubTab, setUsersSubTab] = useState<'users' | 'newsletter' | 'consent'>('users');
  const [billingSubTab, setBillingSubTab] = useState<'invoices' | 'accounting' | 'payment-methods'>('invoices');
  const [adminSearchFilter, setAdminSearchFilter] = useState<'all' | 'name' | 'email' | 'date' | 'invoiceId'>('all');
  const adminPageSize = 50;
  const [createUserDialog, setCreateUserDialog] = useState(false);
  const [newUserData, setNewUserData] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' });
  const [createOrderDialog, setCreateOrderDialog] = useState(false);
  const [newOrderData, setNewOrderData] = useState({ userId: '', productId: '1', amount: '', state: 'New Mexico', orderType: 'llc' as 'llc' | 'maintenance' | 'custom', concept: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; user: AdminUserData | null }>({ open: false, user: null });
  const [discountCodeDialog, setDiscountCodeDialog] = useState<{ open: boolean; code: DiscountCode | null }>({ open: false, code: null });
  const [paymentLinkDialog, setPaymentLinkDialog] = useState<{ open: boolean; user: AdminUserData | null }>({ open: false, user: null });
  const [paymentLinkUrl, setPaymentLinkUrl] = useState("");
  const [paymentLinkAmount, setPaymentLinkAmount] = useState("");
  const [paymentLinkMessage, setPaymentLinkMessage] = useState("");
  const [isSendingPaymentLink, setIsSendingPaymentLink] = useState(false);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const [adminDocUploadDialog, setAdminDocUploadDialog] = useState<{ open: boolean; order: any }>({ open: false, order: null });
  const [adminDocType, setAdminDocType] = useState("articles_of_organization");
  const [adminDocFile, setAdminDocFile] = useState<File | null>(null);
  const [isUploadingAdminDoc, setIsUploadingAdminDoc] = useState(false);
  const [resetPasswordDialog, setResetPasswordDialog] = useState<{ open: boolean; user: AdminUserData | null }>({ open: false, user: null });
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [idvRequestDialog, setIdvRequestDialog] = useState<{ open: boolean; user: AdminUserData | null }>({ open: false, user: null });
  const [idvRequestNotes, setIdvRequestNotes] = useState("");
  const [isSendingIdvRequest, setIsSendingIdvRequest] = useState(false);
  const [idvRejectDialog, setIdvRejectDialog] = useState<{ open: boolean; user: AdminUserData | null }>({ open: false, user: null });
  const [idvRejectReason, setIdvRejectReason] = useState("");
  const [isSendingIdvReject, setIsSendingIdvReject] = useState(false);
  const [isApprovingIdv, setIsApprovingIdv] = useState(false);
  const [idvUploadFile, setIdvUploadFile] = useState<File | null>(null);
  const [isUploadingIdv, setIsUploadingIdv] = useState(false);
  const [newDiscountCode, setNewDiscountCode] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    minOrderAmount: '',
    maxUses: '',
    validFrom: '',
    validUntil: '',
    isActive: true
  });

  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [deleteOrderConfirm, setDeleteOrderConfirm] = useState<{ open: boolean; order: any }>({ open: false, order: null });
  const [generateInvoiceDialog, setGenerateInvoiceDialog] = useState<{ open: boolean; order: any }>({ open: false, order: null });
  const [orderInvoiceAmount, setOrderInvoiceAmount] = useState("");
  const [orderInvoiceCurrency, setOrderInvoiceCurrency] = useState("EUR");

  const isAdminTab = activeTab === 'admin';
  const isStaffUser = !!user?.isAdmin || !!user?.isSupport;

  const adminOrdersSearchParam = adminSubTab === 'orders' ? adminSearchQuery : '';
  const { data: adminOrdersResponse } = useQuery<{ data: any[]; pagination: { page: number; pageSize: number; total: number; totalPages: number } }>({
    queryKey: ["/api/admin/orders", { page: ordersPage, pageSize: adminPageSize, search: adminOrdersSearchParam }],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(ordersPage), pageSize: String(adminPageSize) });
      if (adminOrdersSearchParam) params.set('search', adminOrdersSearchParam);
      const res = await fetch(`/api/admin/orders?${params}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch orders');
      return res.json();
    },
    enabled: isStaffUser && (isAdminTab && (adminSubTab === 'orders' || adminSubTab === 'dashboard' || adminSubTab === 'calendar')),
    staleTime: 1000 * 60 * 2,
  });
  const adminOrders = adminOrdersResponse?.data;
  const ordersPagination = adminOrdersResponse?.pagination;

  const { data: incompleteApps } = useQuery<{ llc: any[]; maintenance: any[] }>({
    queryKey: ["/api/admin/incomplete-applications"],
    enabled: !!user?.isAdmin && isAdminTab && adminSubTab === 'incomplete',
    staleTime: 1000 * 60 * 2,
  });

  const deleteIncompleteAppMutation = useMutation({
    mutationFn: async ({ type, id }: { type: string; id: number }) => {
      setFormMessage(null);
      const res = await apiRequest("DELETE", `/api/admin/incomplete-applications/${type}/${id}`);
      if (!res.ok) throw new Error(t("dashboard.toasts.couldNotDelete"));
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/incomplete-applications"] });
      setFormMessage({ type: 'success', text: t("dashboard.toasts.incompleteDeleted") + ". " + t("dashboard.toasts.incompleteDeletedDesc") });
    },
    onError: () => {
      setFormMessage({ type: 'error', text: t("common.error") + ". " + t("dashboard.toasts.couldNotDelete") });
    }
  });

  const adminUsersSearchParam = adminSubTab === 'users' ? adminSearchQuery : '';
  const { data: adminUsersResponse } = useQuery<{ data: any[]; pagination: { page: number; pageSize: number; total: number; totalPages: number } }>({
    queryKey: ["/api/admin/users", { page: usersPage, pageSize: adminPageSize, search: adminUsersSearchParam }],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(usersPage), pageSize: String(adminPageSize) });
      if (adminUsersSearchParam) params.set('search', adminUsersSearchParam);
      const res = await fetch(`/api/admin/users?${params}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch users');
      return res.json();
    },
    enabled: !!user?.isAdmin && isAdminTab && (adminSubTab === 'users' || adminSubTab === 'dashboard' || adminSubTab === 'orders'),
    staleTime: 1000 * 60 * 3,
  });
  const adminUsers = adminUsersResponse?.data;
  const usersPagination = adminUsersResponse?.pagination;

  const { data: adminNewsletterSubs, refetch: refetchNewsletterSubs } = useQuery<any[]>({
    queryKey: ["/api/admin/newsletter"],
    enabled: !!user?.isAdmin && isAdminTab && adminSubTab === 'communications',
    staleTime: 1000 * 60 * 2,
  });

  const { data: adminDocuments } = useQuery<any[]>({
    queryKey: ["/api/admin/documents"],
    enabled: isStaffUser && isAdminTab && (adminSubTab === 'docs' || adminSubTab === 'dashboard'),
    staleTime: 1000 * 60 * 2,
  });

  const { data: adminInvoices } = useQuery<any[]>({
    queryKey: ["/api/admin/invoices"],
    enabled: !!user?.isAdmin && isAdminTab && (adminSubTab === 'billing' || adminSubTab === 'orders'),
    refetchInterval: isTabFocused && adminSubTab === 'billing' ? 30000 : false,
  });

  const { data: adminStats } = useQuery<{
    totalSales: number;
    pendingSales: number;
    orderCount: number;
    pendingOrders: number;
    completedOrders: number;
    processingOrders: number;
    userCount: number;
    pendingAccounts: number;
    activeAccounts: number;
    vipAccounts: number;
    deactivatedAccounts: number;
    subscriberCount: number;
    totalMessages: number;
    pendingMessages: number;
    totalDocs: number;
    pendingDocs: number;
    conversionRate: number;
  }>({
    queryKey: ["/api/admin/system-stats"],
    enabled: !!user?.isAdmin && isAdminTab && adminSubTab === 'dashboard',
    staleTime: 1000 * 60 * 2,
  });

  const adminMessagesSearchParam = adminSubTab === 'communications' ? adminSearchQuery : '';
  const { data: adminMessagesResponse } = useQuery<{ data: any[]; pagination: { page: number; pageSize: number; total: number; totalPages: number } }>({
    queryKey: ["/api/admin/messages", { page: messagesPage, pageSize: adminPageSize, search: adminMessagesSearchParam }],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(messagesPage), pageSize: String(adminPageSize) });
      if (adminMessagesSearchParam) params.set('search', adminMessagesSearchParam);
      const res = await fetch(`/api/admin/messages?${params}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch messages');
      return res.json();
    },
    enabled: isStaffUser && isAdminTab && (adminSubTab === 'communications' || adminSubTab === 'dashboard'),
    staleTime: 1000 * 60 * 2,
  });
  const adminMessages = adminMessagesResponse?.data;
  const messagesPagination = adminMessagesResponse?.pagination;

  const { data: discountCodes, refetch: refetchDiscountCodes } = useQuery<DiscountCode[]>({
    queryKey: ["/api/admin/discount-codes"],
    enabled: !!user?.isAdmin && isAdminTab && adminSubTab === 'descuentos',
    staleTime: 1000 * 60 * 2,
  });

  const { data: guestVisitors, refetch: refetchGuests } = useQuery({
    queryKey: ["/api/admin/guests"],
    enabled: !!user?.isAdmin && isAdminTab && adminSubTab === 'dashboard',
    staleTime: 1000 * 60 * 2,
  });

  const { data: paymentAccountsList, refetch: refetchPaymentAccounts } = useQuery<any[]>({
    queryKey: ["/api/admin/payment-accounts"],
    enabled: !!user?.isAdmin && isAdminTab && (adminSubTab === 'billing' || adminSubTab === 'orders'),
    staleTime: 1000 * 60 * 2,
  });

  const broadcastMutation = useMutation({
    mutationFn: async ({ subject, message }: { subject: string, message: string }) => {
      setFormMessage(null);
      const res = await apiRequest("POST", "/api/admin/newsletter/broadcast", { subject, message });
      if (!res.ok) throw new Error(t("dashboard.toasts.couldNotSend"));
    },
    onSuccess: () => {
      setFormMessage({ type: 'success', text: t("dashboard.toasts.emailsSent") + ". " + t("dashboard.toasts.emailsSentDesc") });
      setBroadcastSubject("");
      setBroadcastMessage("");
    },
    onError: () => {
      setFormMessage({ type: 'error', text: t("common.error") + ". " + t("dashboard.toasts.couldNotSend") });
    }
  });

  const uploadDocMutation = useMutation({
    mutationFn: async (data: any) => {
      setFormMessage(null);
      const res = await apiRequest("POST", "/api/admin/documents", data);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || t("dashboard.toasts.couldNotUpload"));
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      setFormMessage({ type: 'success', text: t("dashboard.toasts.documentUploaded") + ". " + t("dashboard.toasts.documentUploadedDesc") });
    },
    onError: (error: any) => {
      setFormMessage({ type: 'error', text: t("common.error") + ". " + (error.message || t("dashboard.toasts.couldNotUpload")) });
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      setFormMessage(null);
      const res = await apiRequest("PATCH", `/api/admin/orders/${id}/status`, { status });
      if (!res.ok) throw new Error(t("dashboard.toasts.couldNotUpdate"));
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/documents"] });
      setFormMessage({ type: 'success', text: t("dashboard.toasts.statusUpdated") });
    },
    onError: () => {
      setFormMessage({ type: 'error', text: t("common.error") + ". " + t("dashboard.toasts.couldNotUpdate") });
    }
  });

  const updateLlcDatesMutation = useMutation({
    mutationFn: async ({ appId, field, value }: { appId: number, field: string, value: string | null }) => {
      setFormMessage(null);
      const res = await apiRequest("PATCH", `/api/admin/llc/${appId}/dates`, { field, value });
      if (!res.ok) throw new Error(t("dashboard.toasts.couldNotUpdate"));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      setFormMessage({ type: 'success', text: t("dashboard.toasts.dateUpdated") });
    },
    onError: () => {
      setFormMessage({ type: 'error', text: t("common.error") + ". " + t("dashboard.toasts.couldNotUpdate") });
    }
  });

  const sendNoteMutation = useMutation({
    mutationFn: async ({ userId, title, message, type }: { userId: string, title: string, message: string, type: string }) => {
      setFormMessage(null);
      const res = await apiRequest("POST", "/api/admin/send-note", { userId, title, message, type });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || t("dashboard.toasts.couldNotSend"));
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/notifications"] });
      setFormMessage({ type: 'success', text: t("dashboard.toasts.notesSent") + ". " + t("dashboard.toasts.notesSentDesc") });
      setNoteDialog({ open: false, user: null });
      setNoteTitle("");
      setNoteMessage("");
    },
    onError: (error: any) => {
      setFormMessage({ type: 'error', text: t("common.error") + ". " + (error.message || t("dashboard.toasts.couldNotSend")) });
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: async (data: Partial<AdminUserData> & { id: string }) => {
      setFormMessage(null);
      const { id, createdAt, ...rest } = data;
      const validIdTypes = ['dni', 'nie', 'passport'];
      const validStatuses = ['active', 'pending', 'deactivated', 'vip'];
      const updateData: Record<string, any> = {};
      if (rest.firstName !== undefined) updateData.firstName = rest.firstName || undefined;
      if (rest.lastName !== undefined) updateData.lastName = rest.lastName || undefined;
      if (rest.email !== undefined) updateData.email = rest.email || undefined;
      if (rest.phone !== undefined) updateData.phone = rest.phone || null;
      if (rest.address !== undefined) updateData.address = rest.address || null;
      if (rest.streetType !== undefined) updateData.streetType = rest.streetType || null;
      if (rest.city !== undefined) updateData.city = rest.city || null;
      if (rest.province !== undefined) updateData.province = rest.province || null;
      if (rest.postalCode !== undefined) updateData.postalCode = rest.postalCode || null;
      if (rest.country !== undefined) updateData.country = rest.country || null;
      if (rest.idNumber !== undefined) updateData.idNumber = rest.idNumber || null;
      if (rest.idType !== undefined) updateData.idType = validIdTypes.includes(rest.idType || '') ? rest.idType : null;
      if (rest.birthDate !== undefined) updateData.birthDate = rest.birthDate || null;
      if (rest.businessActivity !== undefined) updateData.businessActivity = rest.businessActivity || null;
      if (rest.isActive !== undefined) updateData.isActive = rest.isActive;
      if (rest.isAdmin !== undefined) updateData.isAdmin = rest.isAdmin;
      if (rest.isSupport !== undefined) updateData.isSupport = rest.isSupport;
      if (rest.accountStatus !== undefined && validStatuses.includes(rest.accountStatus)) updateData.accountStatus = rest.accountStatus;
      if (rest.internalNotes !== undefined) updateData.internalNotes = rest.internalNotes || null;
      const cleanData = Object.fromEntries(Object.entries(updateData).filter(([_, v]) => v !== undefined));
      const res = await apiRequest("PATCH", `/api/admin/users/${id}`, cleanData);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || t("dashboard.toasts.couldNotUpdate"));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      setFormMessage({ type: 'success', text: t("dashboard.toasts.userUpdated") });
      setEditingUser(null);
    },
    onError: (error: any) => {
      setFormMessage({ type: 'error', text: t("common.error") + ". " + (error.message || t("dashboard.toasts.couldNotUpdate")) });
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      setFormMessage(null);
      const res = await apiRequest("DELETE", `/api/admin/users/${userId}`);
      if (!res.ok) throw new Error(t("dashboard.toasts.couldNotDelete"));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setFormMessage({ type: 'success', text: t("dashboard.toasts.userDeleted") });
      setDeleteConfirm({ open: false, user: null });
    },
    onError: () => {
      setFormMessage({ type: 'error', text: t("common.error") + ". " + t("dashboard.toasts.couldNotDelete") });
    }
  });

  const deleteOrderMutation = useMutation({
    mutationFn: async (orderId: number) => {
      setFormMessage(null);
      const res = await apiRequest("DELETE", `/api/admin/orders/${orderId}`);
      if (!res.ok) throw new Error(t("dashboard.toasts.couldNotDelete"));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/documents"] });
      setFormMessage({ type: 'success', text: t("dashboard.toasts.orderDeleted") + ". " + t("dashboard.toasts.orderDeletedDesc") });
      setDeleteOrderConfirm({ open: false, order: null });
    },
    onError: () => {
      setFormMessage({ type: 'error', text: t("common.error") + ". " + t("dashboard.toasts.couldNotDelete") });
    }
  });

  const createInvoiceMutation = useMutation({
    mutationFn: async ({ userId, concept, amount, currency, invoiceDate, paymentAccountIds }: { userId: string, concept: string, amount: number, currency: string, invoiceDate?: string, paymentAccountIds?: number[] }) => {
      setFormMessage(null);
      if (!amount || isNaN(amount) || amount < 1) {
        throw new Error(t("dashboard.toasts.invalidAmount"));
      }
      const res = await apiRequest("POST", "/api/admin/invoices/create", { userId, concept, amount, currency, invoiceDate, paymentAccountIds });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || t("dashboard.toasts.couldNotCreate"));
      }
      return res.json();
    },
    onSuccess: (data) => {
      setFormMessage({ type: 'success', text: t("dashboard.toasts.invoiceCreated") + ". " + (t("dashboard.toasts.invoiceCreatedDesc", { number: data?.invoiceNumber || '' })) });
      setInvoiceDialog({ open: false, user: null });
      setInvoiceConcept("");
      setInvoiceAmount("");
      setInvoiceCurrency("EUR");
      setInvoiceDate(new Date().toISOString().split('T')[0]);
      setInvoicePaymentAccountIds([]);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/invoices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/accounting/transactions"] });
    },
    onError: (error: any) => {
      setFormMessage({ type: 'error', text: t("common.error") + ". " + (error.message || t("dashboard.toasts.couldNotCreate")) });
    }
  });

  const createUserMutation = useMutation({
    mutationFn: async (data: typeof newUserData) => {
      setFormMessage(null);
      const res = await apiRequest("POST", "/api/admin/users/create", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setFormMessage({ type: 'success', text: t("dashboard.toasts.userCreated") + ". " + t("dashboard.toasts.userCreatedDesc") });
      setCreateUserDialog(false);
      setNewUserData({ firstName: '', lastName: '', email: '', phone: '', password: '' });
    },
    onError: () => {
      setFormMessage({ type: 'error', text: t("common.error") + ". " + t("dashboard.toasts.couldNotCreate") });
    }
  });

  const createOrderMutation = useMutation({
    mutationFn: async (data: typeof newOrderData) => {
      setFormMessage(null);
      const { userId, amount, orderType } = data;
      if (!userId || !amount) {
        throw new Error(t("dashboard.toasts.missingRequiredData"));
      }
      if (orderType === 'custom') {
        if (!data.concept) throw new Error(t("dashboard.toasts.missingRequiredData"));
        const res = await apiRequest("POST", "/api/admin/orders/create-custom", { userId, concept: data.concept, amount });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || t("dashboard.toasts.couldNotCreate"));
        }
        return res.json();
      }
      const { state } = data;
      if (!state) throw new Error(t("dashboard.toasts.missingRequiredData"));
      const endpoint = orderType === 'maintenance' ? "/api/admin/orders/create-maintenance" : "/api/admin/orders/create";
      const res = await apiRequest("POST", endpoint, { userId, state, amount });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || t("dashboard.toasts.couldNotCreate"));
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/invoices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/accounting/transactions"] });
      setFormMessage({ type: 'success', text: t("dashboard.toasts.orderCreated") + ". " + (t("dashboard.toasts.orderCreatedDesc", { number: data?.invoiceNumber || '' })) });
      setCreateOrderDialog(false);
      setNewOrderData({ userId: '', productId: '1', amount: '', state: 'New Mexico', orderType: 'llc', concept: '' });
    },
    onError: (error: any) => {
      setFormMessage({ type: 'error', text: t("common.error") + ". " + (error.message || t("dashboard.toasts.couldNotCreate")) });
    }
  });

  const deleteDocMutation = useMutation({
    mutationFn: async (docId: number) => {
      setFormMessage(null);
      const endpoint = user?.isAdmin ? `/api/admin/documents/${docId}` : `/api/user/documents/${docId}`;
      const res = await apiRequest("DELETE", endpoint);
      if (!res.ok) throw new Error(t("dashboard.toasts.couldNotDelete"));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/documents"] });
      setFormMessage({ type: 'success', text: t("dashboard.toasts.documentDeleted") });
    },
    onError: (error: any) => {
      setFormMessage({ type: 'error', text: t("common.error") + ". " + (error?.message || t("dashboard.toasts.couldNotDelete")) });
    }
  });

  const matchesFilter = (fields: Record<string, string>, query: string, filter: typeof adminSearchFilter) => {
    if (filter === 'all') return Object.values(fields).some(v => v.includes(query));
    if (filter === 'name') return (fields.name || '').includes(query);
    if (filter === 'email') return (fields.email || '').includes(query);
    if (filter === 'date') return (fields.date || '').includes(query) || (fields.dateLong || '').includes(query);
    if (filter === 'invoiceId') return (fields.invoiceId || '').includes(query) || (fields.orderId || '').includes(query);
    return false;
  };

  const filteredAdminOrders = adminOrders;
  const filteredAdminUsers = adminUsers;
  const filteredAdminMessages = adminMessages;

  const filteredAdminDocuments = useMemo(() => {
    if (!adminSearchQuery.trim() || !adminDocuments) return adminDocuments;
    const query = adminSearchQuery.toLowerCase().trim();
    return adminDocuments.filter((doc: any) => {
      const fields: Record<string, string> = {
        name: ((doc.user?.firstName || '') + ' ' + (doc.user?.lastName || '')).toLowerCase(),
        email: (doc.user?.email || '').toLowerCase(),
        date: doc.uploadedAt ? formatDateShort(doc.uploadedAt) : '',
        invoiceId: (doc.fileName || '').toLowerCase(),
        orderId: (doc.id?.toString() || ''),
        companyName: (doc.application?.companyName || '').toLowerCase(),
      };
      return matchesFilter(fields, query, adminSearchFilter);
    });
  }, [adminDocuments, adminSearchQuery, adminSearchFilter]);

  return {
    editingUser, setEditingUser,
    paymentDialog, setPaymentDialog,
    paymentLink, setPaymentLink,
    paymentAmount, setPaymentAmount,
    paymentMessage, setPaymentMessage,
    docDialog, setDocDialog,
    docType, setDocType,
    docMessage, setDocMessage,
    docRejectDialog, setDocRejectDialog,
    docRejectReason, setDocRejectReason,
    noteDialog, setNoteDialog,
    noteTitle, setNoteTitle,
    noteMessage, setNoteMessage,
    noteType, setNoteType,
    invoiceDialog, setInvoiceDialog,
    invoiceConcept, setInvoiceConcept,
    invoiceAmount, setInvoiceAmount,
    invoiceCurrency, setInvoiceCurrency,
    invoiceDate, setInvoiceDate,
    invoicePaymentAccountIds, setInvoicePaymentAccountIds,
    adminSubTab, setAdminSubTabRaw, setAdminSubTab,
    commSubTab, setCommSubTab,
    usersSubTab, setUsersSubTab,
    billingSubTab, setBillingSubTab,
    adminSearchQuery, setAdminSearchQuery,
    adminSearchFilter, setAdminSearchFilter,
    ordersPage, setOrdersPage,
    usersPage, setUsersPage,
    messagesPage, setMessagesPage,
    adminPageSize,
    createUserDialog, setCreateUserDialog,
    newUserData, setNewUserData,
    createOrderDialog, setCreateOrderDialog,
    newOrderData, setNewOrderData,
    deleteConfirm, setDeleteConfirm,
    discountCodeDialog, setDiscountCodeDialog,
    paymentLinkDialog, setPaymentLinkDialog,
    paymentLinkUrl, setPaymentLinkUrl,
    paymentLinkAmount, setPaymentLinkAmount,
    paymentLinkMessage, setPaymentLinkMessage,
    isSendingPaymentLink, setIsSendingPaymentLink,
    isGeneratingInvoice, setIsGeneratingInvoice,
    adminDocUploadDialog, setAdminDocUploadDialog,
    adminDocType, setAdminDocType,
    adminDocFile, setAdminDocFile,
    isUploadingAdminDoc, setIsUploadingAdminDoc,
    resetPasswordDialog, setResetPasswordDialog,
    newAdminPassword, setNewAdminPassword,
    isResettingPassword, setIsResettingPassword,
    idvRequestDialog, setIdvRequestDialog,
    idvRequestNotes, setIdvRequestNotes,
    isSendingIdvRequest, setIsSendingIdvRequest,
    idvRejectDialog, setIdvRejectDialog,
    idvRejectReason, setIdvRejectReason,
    isSendingIdvReject, setIsSendingIdvReject,
    isApprovingIdv, setIsApprovingIdv,
    idvUploadFile, setIdvUploadFile,
    isUploadingIdv, setIsUploadingIdv,
    newDiscountCode, setNewDiscountCode,
    broadcastSubject, setBroadcastSubject,
    broadcastMessage, setBroadcastMessage,
    deleteOrderConfirm, setDeleteOrderConfirm,
    generateInvoiceDialog, setGenerateInvoiceDialog,
    orderInvoiceAmount, setOrderInvoiceAmount,
    orderInvoiceCurrency, setOrderInvoiceCurrency,
    isAdminTab,
    isStaffUser,
    adminOrders,
    ordersPagination,
    incompleteApps,
    adminUsers,
    usersPagination,
    adminNewsletterSubs, refetchNewsletterSubs,
    adminDocuments,
    adminInvoices,
    adminStats,
    adminMessages,
    messagesPagination,
    discountCodes, refetchDiscountCodes,
    guestVisitors, refetchGuests,
    paymentAccountsList, refetchPaymentAccounts,
    deleteIncompleteAppMutation,
    broadcastMutation,
    uploadDocMutation,
    updateStatusMutation,
    updateLlcDatesMutation,
    sendNoteMutation,
    updateUserMutation,
    deleteUserMutation,
    deleteOrderMutation,
    createInvoiceMutation,
    createUserMutation,
    createOrderMutation,
    deleteDocMutation,
    matchesFilter,
    filteredAdminOrders,
    filteredAdminUsers,
    filteredAdminMessages,
    filteredAdminDocuments,
  };
}
