import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectItem } from "@/components/ui/native-select";
import { Key, ShieldCheck, CheckCircle, XCircle, FileText, Send, Trash2, Loader2, Search } from "@/components/icons";
import { PaginationControls } from "@/components/dashboard/pagination-controls";

interface AdminUsersPanelProps {
  filteredAdminUsers: any[];
  adminSearchQuery: string;
  usersSubTab: 'users' | 'newsletter' | 'consent';
  setUsersSubTab: (sub: 'users' | 'newsletter' | 'consent') => void;
  adminNewsletterSubs: any[];
  onEditUser: (user: any) => void;
  onViewOrders: (userId: string) => void;
  onResetPassword: (userId: string) => void;
  onToggleActive: (userId: string, isActive: boolean) => void;
  onDeleteUser: (userId: string) => void;
  onIdvAction: (userId: string, action: string) => void;
  onStatusChange: (userId: string, status: string) => void;
  onRequestIdv: (user: any) => void;
  onRejectIdv: (user: any) => void;
  onSendNote: (user: any) => void;
  onRequestDoc: (user: any) => void;
  onCreateInvoice: (user: any) => void;
  onPaymentLink: (user: any) => void;
  broadcastSubject: string;
  setBroadcastSubject: (val: string) => void;
  broadcastMessage: string;
  setBroadcastMessage: (val: string) => void;
  broadcastMutationIsPending: boolean;
  onSendBroadcast: (data: { subject: string; message: string }) => void;
  onDeleteSubscriber: (sub: any) => void;
  isApprovingIdv: boolean;
  onApproveIdv: (userId: string) => void;
  pagination?: { page: number; pageSize: number; total: number; totalPages: number };
  onPageChange?: (page: number) => void;
}

interface ConsentRecord {
  id: number;
  userId: string | null;
  email: string | null;
  fullName: string | null;
  ip: string | null;
  userAgent: string | null;
  consentType: string;
  version: string;
  accepted: boolean;
  createdAt: string;
}

interface ConsentRecordsResponse {
  records: ConsentRecord[];
  total: number;
  page: number;
  limit: number;
}

function ConsentRecordsSection() {
  const { t } = useTranslation();
  const [consentPage, setConsentPage] = useState(1);
  const [consentTypeFilter, setConsentTypeFilter] = useState('');
  const [consentSearch, setConsentSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const consentLimit = 20;

  const { data: consentData, isLoading: consentLoading } = useQuery<ConsentRecordsResponse>({
    queryKey: ["/api/admin/consent-records", { page: consentPage, limit: consentLimit, consentType: consentTypeFilter, email: consentSearch }],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(consentPage), limit: String(consentLimit) });
      if (consentTypeFilter) params.set('consentType', consentTypeFilter);
      if (consentSearch) params.set('email', consentSearch);
      const res = await fetch(`/api/admin/consent-records?${params}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch consent records');
      return res.json();
    },
    staleTime: 1000 * 60 * 2,
  });

  const handleSearch = () => {
    setConsentSearch(searchInput);
    setConsentPage(1);
  };

  const handleFilterChange = (val: string) => {
    setConsentTypeFilter(val);
    setConsentPage(1);
  };

  const formatFullDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const getYear = (dateStr: string) => {
    try {
      return new Date(dateStr).getFullYear().toString();
    } catch {
      return '-';
    }
  };

  const getConsentTypeBadge = (type: string) => {
    const typeMap: Record<string, { label: string; className: string }> = {
      terms: { label: t('dashboard.admin.consentRecords.filterTerms'), className: 'bg-accent/5 dark:bg-accent/10 text-accent dark:text-accent border border-accent/50 dark:border-accent' },
      privacy: { label: t('dashboard.admin.consentRecords.filterPrivacy'), className: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700' },
      cookies: { label: t('dashboard.admin.consentRecords.filterCookies'), className: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700' },
    };
    return typeMap[type] || { label: type, className: 'bg-muted dark:bg-muted text-muted-foreground border border-border' };
  };

  const totalPages = consentData ? Math.ceil(consentData.total / consentLimit) : 1;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3" data-testid="consent-records-filters">
        <div className="flex-1">
          <div className="flex gap-2">
            <Input
              placeholder={t('dashboard.admin.consentRecords.searchPlaceholder')}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="rounded-full text-sm"
              data-testid="input-consent-search"
            />
            <Button
              size="icon"
              variant="outline"
              className="rounded-full shrink-0"
              onClick={handleSearch}
              data-testid="button-consent-search"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="w-full sm:w-48">
          <NativeSelect
            value={consentTypeFilter}
            onValueChange={handleFilterChange}
            className="w-full rounded-full text-sm"
            data-testid="select-consent-type-filter"
          >
            <NativeSelectItem value="">{t('dashboard.admin.consentRecords.filterAll')}</NativeSelectItem>
            <NativeSelectItem value="terms">{t('dashboard.admin.consentRecords.filterTerms')}</NativeSelectItem>
            <NativeSelectItem value="privacy">{t('dashboard.admin.consentRecords.filterPrivacy')}</NativeSelectItem>
            <NativeSelectItem value="cookies">{t('dashboard.admin.consentRecords.filterCookies')}</NativeSelectItem>
          </NativeSelect>
        </div>
      </div>

      <Card className="rounded-2xl shadow-sm p-0 overflow-x-auto">
        {consentLoading ? (
          <div className="flex items-center justify-center py-12 gap-2" data-testid="consent-records-loading">
            <Loader2 className="w-5 h-5 animate-spin text-accent" />
            <span className="text-sm text-muted-foreground">{t('dashboard.admin.consentRecords.loading')}</span>
          </div>
        ) : consentData?.records && consentData.records.length > 0 ? (
          <div className="divide-y min-w-[600px]">
            {consentData.records.map((record) => (
              <div key={record.id} className="p-3 md:p-4 space-y-2" data-testid={`consent-record-${record.id}`}>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-black text-sm" data-testid={`text-consent-fullname-${record.id}`}>
                        {record.fullName || '-'}
                      </p>
                      {(() => {
                        const badge = getConsentTypeBadge(record.consentType);
                        return (
                          <Badge className={`text-[9px] rounded-full ${badge.className}`} data-testid={`badge-consent-type-${record.id}`}>
                            {badge.label}
                          </Badge>
                        );
                      })()}
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground shrink-0" data-testid={`text-consent-version-${record.id}`}>
                      v{record.version}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground" data-testid={`text-consent-email-${record.id}`}>
                    {record.email || '-'}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
                    {record.userId && (
                      <span className="flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded-full" data-testid={`text-consent-userid-${record.id}`}>
                        <span className="font-medium">{t('dashboard.admin.consentRecords.userId')}:</span> {record.userId}
                      </span>
                    )}
                    {record.ip && (
                      <span className="flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded-full" data-testid={`text-consent-ip-${record.id}`}>
                        <span className="font-medium">{t('dashboard.admin.consentRecords.ip')}:</span> {record.ip}
                      </span>
                    )}
                    <span className="flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded-full" data-testid={`text-consent-date-${record.id}`}>
                      <span className="font-medium">{t('dashboard.admin.consentRecords.date')}:</span> {formatFullDate(record.createdAt)}
                    </span>
                    <span className="flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded-full" data-testid={`text-consent-year-${record.id}`}>
                      <span className="font-medium">{t('dashboard.admin.consentRecords.year')}:</span> {getYear(record.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center" data-testid="consent-records-empty">
            <p className="text-sm text-muted-foreground">{t('dashboard.admin.consentRecords.noRecords')}</p>
          </div>
        )}
        {consentData && (
          <PaginationControls
            page={consentData.page}
            totalPages={totalPages}
            total={consentData.total}
            pageSize={consentLimit}
            onPageChange={setConsentPage}
          />
        )}
      </Card>
    </div>
  );
}

export function AdminUsersPanel({
  filteredAdminUsers,
  adminSearchQuery,
  usersSubTab,
  setUsersSubTab,
  adminNewsletterSubs,
  onEditUser,
  onViewOrders,
  onResetPassword,
  onToggleActive,
  onDeleteUser,
  onIdvAction,
  onStatusChange,
  onRequestIdv,
  onRejectIdv,
  onSendNote,
  onRequestDoc,
  onCreateInvoice,
  onPaymentLink,
  broadcastSubject,
  setBroadcastSubject,
  broadcastMessage,
  setBroadcastMessage,
  broadcastMutationIsPending,
  onSendBroadcast,
  onDeleteSubscriber,
  isApprovingIdv,
  onApproveIdv,
  pagination,
  onPageChange,
}: AdminUsersPanelProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <Button
          variant={usersSubTab === 'users' ? 'default' : 'outline'}
          size="sm"
          className={`rounded-full text-xs font-black ${usersSubTab === 'users' ? 'bg-accent text-accent-foreground' : ''}`}
          onClick={() => setUsersSubTab('users')}
          data-testid="button-users-subtab-users"
        >
          {t('dashboard.admin.tabs.clients')}
        </Button>
        <Button
          variant={usersSubTab === 'newsletter' ? 'default' : 'outline'}
          size="sm"
          className={`rounded-full text-xs font-black ${usersSubTab === 'newsletter' ? 'bg-accent text-accent-foreground' : ''}`}
          onClick={() => setUsersSubTab('newsletter')}
          data-testid="button-users-subtab-newsletter"
        >
          {t('dashboard.admin.clientsSubTabs.newsletter')}
        </Button>
        <Button
          variant={usersSubTab === 'consent' ? 'default' : 'outline'}
          size="sm"
          className={`rounded-full text-xs font-black ${usersSubTab === 'consent' ? 'bg-accent text-accent-foreground' : ''}`}
          onClick={() => setUsersSubTab('consent')}
          data-testid="button-users-subtab-consent"
        >
          {t('dashboard.admin.clientsSubTabs.consent')}
        </Button>
      </div>
      {usersSubTab === 'users' && (
        <Card className="rounded-2xl shadow-sm p-0 overflow-x-auto">
          <div className="divide-y min-w-[600px]">
            {filteredAdminUsers?.map(u => (
              <div key={u.id} className="p-3 md:p-4 space-y-3">
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-black text-sm">{u.firstName} {u.lastName}</p>
                    <Badge className={`text-[9px] rounded-full ${u.accountStatus === 'deactivated' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700' : u.accountStatus === 'vip' ? 'bg-accent/5 dark:bg-accent/10 text-accent dark:text-accent border border-accent dark:border-accent' : u.accountStatus === 'pending' ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700' : 'bg-accent/5 dark:bg-accent/10 text-accent dark:text-accent border border-accent dark:border-accent'}`}>
                      {u.accountStatus === 'active' ? t('dashboard.admin.users.verified') : u.accountStatus === 'pending' ? t('dashboard.admin.users.inReview') : u.accountStatus === 'deactivated' ? t('dashboard.admin.users.deactivated') : u.accountStatus === 'vip' ? 'VIP' : t('dashboard.admin.users.verified')}
                    </Badge>
                    {u.isAdmin && <Badge className="text-[9px] rounded-full bg-accent/5 dark:bg-accent/10 text-accent dark:text-accent border border-accent dark:border-accent">ADMIN</Badge>}
                    {u.isSupport && !u.isAdmin && <Badge className="text-[9px] rounded-full bg-accent/5 dark:bg-accent/10 text-accent dark:text-accent border border-accent dark:border-accent">{t('dashboard.admin.users.supportBadge')}</Badge>}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                    {u.clientId && (
                      <span className="text-[10px] font-mono font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full" data-testid={`text-client-id-${u.id}`}>{u.clientId}</span>
                    )}
                    {(u as any).preferredLanguage && (
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-muted dark:bg-muted text-muted-foreground border border-border" data-testid={`text-lang-${u.id}`}>{(u as any).preferredLanguage}</span>
                    )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {u.phone && <span className="mr-2">{u.phone}</span>}
                    {u.businessActivity && <span className="mr-2">• {u.businessActivity}</span>}
                    {u.city && <span>• {u.city}</span>}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
                    {u.lastLoginIp && (
                      <span className="flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded-full">
                        <span className="font-medium">IP:</span> {u.lastLoginIp}
                      </span>
                    )}
                    {typeof u.loginCount === 'number' && (
                      <span className="flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded-full">
                        <span className="font-medium">Logins:</span> {u.loginCount}
                      </span>
                    )}
                    {u.securityOtpRequired && (
                      <span className="flex items-center gap-1 bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                        {t('dashboard.admin.users.otpRequired')}
                      </span>
                    )}
                  </div>
                  <div className="w-full">
                    <Label className="text-[10px] text-muted-foreground mb-1 block">{t('dashboard.admin.users.accountStatus')}</Label>
                    <NativeSelect 
                      value={u.accountStatus || 'active'} 
                      onValueChange={val => u.id && onStatusChange(u.id, val)}
                      className="w-full h-9 rounded-full text-xs bg-white dark:bg-card border shadow-sm px-3"
                    >
                      <NativeSelectItem value="active">{t('dashboard.admin.users.verifiedStatus')}</NativeSelectItem>
                      <NativeSelectItem value="pending">{t('dashboard.admin.users.inReviewStatus')}</NativeSelectItem>
                      <NativeSelectItem value="deactivated">{t('dashboard.admin.users.deactivatedStatus')}</NativeSelectItem>
                      <NativeSelectItem value="vip">VIP</NativeSelectItem>
                    </NativeSelect>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" className="rounded-full text-xs" onClick={() => onEditUser(u)} data-testid={`button-edit-user-${u.id}`}>
                    {t('dashboard.admin.users.edit')}
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full text-xs" onClick={() => onResetPassword(u.id)} data-testid={`button-reset-pwd-${u.id}`}>
                    <Key className="w-3 h-3 mr-1" />{t('dashboard.admin.users.passwordBtn')}
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full text-xs" onClick={() => onRequestIdv(u)} data-testid={`button-request-idv-${u.id}`}>
                    <ShieldCheck className="w-3 h-3 mr-1" />{t('dashboard.admin.users.requestIdvBtn')}
                  </Button>
                  {(u as any).identityVerificationStatus === 'uploaded' && (
                    <>
                      <Button size="sm" className="rounded-full text-xs bg-accent text-white" 
                        disabled={isApprovingIdv}
                        onClick={() => onApproveIdv(u.id)}
                        data-testid={`button-approve-idv-${u.id}`}>
                        <CheckCircle className="w-3 h-3 mr-1" />{t('dashboard.admin.users.approveIdvBtn')}
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-full text-xs text-red-600 border-red-200" onClick={() => onRejectIdv(u)} data-testid={`button-reject-idv-${u.id}`}>
                        <XCircle className="w-3 h-3 mr-1" />{t('dashboard.admin.users.rejectIdvBtn')}
                      </Button>
                      <a href={`/api/admin/users/${u.id}/identity-document`} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline" className="rounded-full text-xs" data-testid={`button-view-idv-doc-${u.id}`}>
                          <FileText className="w-3 h-3 mr-1" />{t('dashboard.admin.users.viewIdvDoc')}
                        </Button>
                      </a>
                    </>
                  )}
                  <Button size="sm" variant="outline" className="rounded-full text-xs" onClick={() => onSendNote(u)} data-testid={`button-note-user-${u.id}`}>
                    {t('dashboard.admin.users.messageBtn')}
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full text-xs" onClick={() => onRequestDoc(u)} data-testid={`button-doc-user-${u.id}`}>
                    {t('dashboard.admin.users.docsBtn')}
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full text-xs" onClick={() => onCreateInvoice(u)} data-testid={`button-invoice-user-${u.id}`}>
                    {t('dashboard.admin.users.invoiceBtn')}
                  </Button>
                  <Button size="sm" className="rounded-full text-xs bg-accent text-accent-foreground" onClick={() => onPaymentLink(u)} data-testid={`button-payment-link-${u.id}`}>
                    {t('dashboard.admin.users.paymentBtn')}
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full text-xs text-red-600 border-red-200" onClick={() => onDeleteUser(u.id)} data-testid={`button-delete-user-${u.id}`}>
                    {t('dashboard.admin.users.deleteBtn')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {pagination && onPageChange && (
            <PaginationControls
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              pageSize={pagination.pageSize}
              onPageChange={onPageChange}
            />
          )}
        </Card>
      )}
      {usersSubTab === 'newsletter' && (
        <div className="space-y-4">
          <Card className="rounded-2xl shadow-sm p-4 md:p-6">
            <h4 className="font-black text-sm mb-3">{t('dashboard.admin.newsletterSection.sendNewsletter')}</h4>
            <div className="space-y-3">
              <Input placeholder={t('dashboard.admin.newsletterSection.subjectPlaceholder')}
                value={broadcastSubject}
                onChange={(e) => setBroadcastSubject(e.target.value)}
                className="rounded-full text-sm"
                data-testid="input-broadcast-subject"
              />
              <Textarea placeholder={t('dashboard.admin.newsletterSection.messagePlaceholder')}
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                className="rounded-2xl min-h-[100px] text-sm"
                data-testid="input-broadcast-message"
              />
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] text-muted-foreground">
                  {t('dashboard.admin.newsletterSection.recipientCount', { count: adminNewsletterSubs?.length || 0 })}
                </p>
                <Button
                  className="rounded-full text-xs font-black bg-accent text-accent-foreground px-6"
                  disabled={!broadcastSubject.trim() || !broadcastMessage.trim() || broadcastMutationIsPending}
                  onClick={() => onSendBroadcast({ subject: broadcastSubject, message: broadcastMessage })}
                  data-testid="button-send-broadcast"
                >
                  {broadcastMutationIsPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Send className="w-3 h-3 mr-1" />}
                  {t('dashboard.admin.newsletterSection.sendBroadcast')}
                </Button>
              </div>
            </div>
          </Card>
          <Card className="rounded-2xl shadow-sm p-4 md:p-6">
            <h4 className="font-black text-sm mb-3">{t('dashboard.admin.newsletterSection.title')} ({adminNewsletterSubs?.length || 0})</h4>
            <div className="divide-y max-h-80 overflow-y-auto">
              {adminNewsletterSubs?.map((sub: any) => (
                <div key={sub.id} className="py-2 flex justify-between items-center gap-2">
                  <span className="text-sm truncate flex-1">{sub.email}</span>
                  <span className="text-[10px] text-muted-foreground shrink-0">{sub.subscribedAt ? formatDate(sub.subscribedAt) : ''}</span>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-7 w-7 text-red-500 shrink-0"
                    onClick={() => onDeleteSubscriber(sub)}
                    data-testid={`button-delete-subscriber-${sub.id}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              {(!adminNewsletterSubs || adminNewsletterSubs.length === 0) && (
                <p className="text-sm text-muted-foreground py-4 text-center">{t('dashboard.admin.newsletterSection.noSubscribers')}</p>
              )}
            </div>
          </Card>
        </div>
      )}
      {usersSubTab === 'consent' && (
        <ConsentRecordsSection />
      )}
    </div>
  );
}
