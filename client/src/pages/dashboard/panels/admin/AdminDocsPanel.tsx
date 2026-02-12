import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { FileText, Eye, MessageSquare, Trash2, Clock, CheckCircle, XCircle, Send, Edit2, ChevronDown, ChevronUp } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NativeSelect, NativeSelectItem } from "@/components/ui/native-select";
import { formatDate } from "@/lib/utils";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface AdminDocsPanelProps {
  filteredAdminDocuments: any[] | undefined;
  adminSearchQuery: string;
  adminOrders: any[] | undefined;
  adminUsers: any[] | undefined;
  setFormMessage: (msg: { type: 'error' | 'success' | 'info'; text: string } | null) => void;
  setDocRejectDialog: (val: { open: boolean; docId: number | null }) => void;
  setDocRejectReason: (val: string) => void;
  setNoteDialog: (val: { open: boolean; user: any | null }) => void;
  setAdminDocUploadDialog: (val: { open: boolean; order: any }) => void;
  setAdminDocType: (val: string) => void;
  setAdminDocFile: (val: File | null) => void;
  showConfirm: (opts: { title: string; description: string; onConfirm: () => Promise<void> }) => void;
}

type DocumentRequest = {
  id: number;
  requestId: string;
  userId: string;
  documentType: string;
  notes: string | null;
  status: string;
  requestedBy: string | null;
  linkedDocumentId: number | null;
  createdAt: string;
  updatedAt: string;
  user: { id: string; firstName: string | null; lastName: string | null; email: string } | null;
  linkedDocument: any | null;
};

function RequestStatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  const statusConfig: Record<string, { label: string; className: string }> = {
    sent: { label: t('dashboard.admin.docRequests.statusSent', 'Sent'), className: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' },
    pending_upload: { label: t('dashboard.admin.docRequests.statusPending', 'Pending'), className: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800' },
    uploaded: { label: t('dashboard.admin.docRequests.statusUploaded', 'Uploaded'), className: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800' },
    approved: { label: t('dashboard.admin.docRequests.statusApproved', 'Approved'), className: 'bg-accent/5 text-accent border-accent/30 dark:bg-accent/10 dark:text-accent dark:border-accent/30' },
    rejected: { label: t('dashboard.admin.docRequests.statusRejected', 'Rejected'), className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800' },
    completed: { label: t('dashboard.admin.docRequests.statusCompleted', 'Completed'), className: 'bg-accent/5 text-accent border-accent/30 dark:bg-accent/10 dark:text-accent dark:border-accent/30' },
  };
  const config = statusConfig[status] || { label: status, className: '' };
  return <Badge variant="outline" className={`text-[9px] shrink-0 no-default-hover-elevate no-default-active-elevate ${config.className}`}>{config.label}</Badge>;
}

function DocumentRequestsSection({ setFormMessage, showConfirm }: Pick<AdminDocsPanelProps, 'setFormMessage' | 'showConfirm'>) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(true);
  const [editingNotes, setEditingNotes] = useState<{ id: number; notes: string } | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: requests, isLoading } = useQuery<DocumentRequest[]>({
    queryKey: ["/api/admin/document-requests"],
    staleTime: 1000 * 60 * 2,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: { notes?: string; status?: string } }) => {
      await apiRequest("PATCH", `/api/admin/document-requests/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/document-requests"] });
      setFormMessage({ type: 'success', text: t("dashboard.toasts.statusUpdated") });
      setEditingNotes(null);
    },
    onError: () => setFormMessage({ type: 'error', text: t("common.error") }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/document-requests/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/document-requests"] });
      setFormMessage({ type: 'success', text: t("dashboard.toasts.documentDeleted") });
    },
    onError: () => setFormMessage({ type: 'error', text: t("common.error") }),
  });

  const filteredRequests = statusFilter === "all" 
    ? requests 
    : requests?.filter(r => r.status === statusFilter);

  const getDocTypeLabel = (docType: string) => {
    const key = `ntf.docTypes.${docType}`;
    const translated = t(key);
    return translated !== key ? translated : docType.replace(/_/g, ' ');
  };

  return (
    <div className="space-y-3">
      <div 
        className="flex items-center justify-between cursor-pointer select-none" 
        onClick={() => setExpanded(!expanded)}
        data-testid="toggle-doc-requests"
      >
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-black text-lg">{t('dashboard.admin.docRequests.title', 'Document Requests')}</h3>
          <Badge className="bg-primary/20 text-primary">{requests?.length || 0}</Badge>
        </div>
        <Button size="icon" variant="ghost" data-testid="btn-toggle-requests">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>
      
      {expanded && (
        <>
          <div className="flex items-center gap-2 flex-wrap">
            <NativeSelect
              value={statusFilter}
              onValueChange={setStatusFilter}
              className="h-8 text-[10px] rounded-full px-2 min-w-[100px]"
            >
              <NativeSelectItem value="all">{t('dashboard.admin.docRequests.filterAll', 'All')}</NativeSelectItem>
              <NativeSelectItem value="sent">{t('dashboard.admin.docRequests.statusSent', 'Sent')}</NativeSelectItem>
              <NativeSelectItem value="pending_upload">{t('dashboard.admin.docRequests.statusPending', 'Pending')}</NativeSelectItem>
              <NativeSelectItem value="uploaded">{t('dashboard.admin.docRequests.statusUploaded', 'Uploaded')}</NativeSelectItem>
              <NativeSelectItem value="approved">{t('dashboard.admin.docRequests.statusApproved', 'Approved')}</NativeSelectItem>
              <NativeSelectItem value="rejected">{t('dashboard.admin.docRequests.statusRejected', 'Rejected')}</NativeSelectItem>
              <NativeSelectItem value="completed">{t('dashboard.admin.docRequests.statusCompleted', 'Completed')}</NativeSelectItem>
            </NativeSelect>
          </div>

          {isLoading ? (
            <Card className="rounded-2xl shadow-sm p-8">
              <div className="text-center">
                <Clock className="w-5 h-5 animate-spin mx-auto text-accent" />
              </div>
            </Card>
          ) : filteredRequests && filteredRequests.length > 0 ? (
            <div className="space-y-2">
              {filteredRequests.map((req) => (
                <Card key={req.id} className="rounded-xl shadow-sm p-3" data-testid={`doc-request-card-${req.id}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${req.status === 'approved' || req.status === 'completed' ? 'bg-accent/10' : req.status === 'rejected' ? 'bg-red-100 dark:bg-red-900/30' : req.status === 'uploaded' ? 'bg-indigo-100 dark:bg-indigo-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                      {req.status === 'approved' || req.status === 'completed' ? (
                        <CheckCircle className="w-4 h-4 text-accent" />
                      ) : req.status === 'rejected' ? (
                        <XCircle className="w-4 h-4 text-red-500" />
                      ) : req.status === 'uploaded' ? (
                        <FileText className="w-4 h-4 text-indigo-500" />
                      ) : (
                        <Send className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono text-muted-foreground">#{req.requestId}</span>
                        <RequestStatusBadge status={req.status} />
                        <Badge variant="outline" className="text-[9px] shrink-0 no-default-hover-elevate no-default-active-elevate">{getDocTypeLabel(req.documentType)}</Badge>
                      </div>
                      {req.user && (
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <p className="text-xs font-bold">{req.user.firstName} {req.user.lastName}</p>
                          <span className="text-[10px] text-muted-foreground">|</span>
                          <p className="text-[10px] text-muted-foreground truncate">{req.user.email}</p>
                        </div>
                      )}
                      {editingNotes?.id === req.id ? (
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <textarea
                            className="flex-1 text-[11px] bg-muted/30 rounded-md p-1.5 border resize-none min-h-[40px]"
                            value={editingNotes.notes}
                            onChange={(e) => setEditingNotes({ ...editingNotes, notes: e.target.value })}
                            data-testid={`input-notes-${req.id}`}
                          />
                          <div className="flex flex-col gap-1">
                            <Button 
                              size="sm" 
                              variant="default"
                              onClick={() => updateMutation.mutate({ id: req.id, data: { notes: editingNotes.notes } })}
                              disabled={updateMutation.isPending}
                              data-testid={`btn-save-notes-${req.id}`}
                            >
                              {t('common.save', 'Save')}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => setEditingNotes(null)}
                              data-testid={`btn-cancel-notes-${req.id}`}
                            >
                              {t('common.cancel', 'Cancel')}
                            </Button>
                          </div>
                        </div>
                      ) : req.notes ? (
                        <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2 italic">{req.notes}</p>
                      ) : null}
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[10px] text-muted-foreground">{formatDate(req.createdAt)}</span>
                        {req.linkedDocument && (
                          <Badge variant="outline" className="text-[8px] no-default-hover-elevate no-default-active-elevate">
                            {t('dashboard.admin.docRequests.linked', 'Linked')}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <NativeSelect
                        value={req.status}
                        onValueChange={(val) => updateMutation.mutate({ id: req.id, data: { status: val } })}
                        className="h-7 text-[10px] rounded-full px-2 max-w-[100px]"
                      >
                        <NativeSelectItem value="sent">{t('dashboard.admin.docRequests.statusSent', 'Sent')}</NativeSelectItem>
                        <NativeSelectItem value="pending_upload">{t('dashboard.admin.docRequests.statusPending', 'Pending')}</NativeSelectItem>
                        <NativeSelectItem value="uploaded">{t('dashboard.admin.docRequests.statusUploaded', 'Uploaded')}</NativeSelectItem>
                        <NativeSelectItem value="approved">{t('dashboard.admin.docRequests.statusApproved', 'Approved')}</NativeSelectItem>
                        <NativeSelectItem value="rejected">{t('dashboard.admin.docRequests.statusRejected', 'Rejected')}</NativeSelectItem>
                        <NativeSelectItem value="completed">{t('dashboard.admin.docRequests.statusCompleted', 'Completed')}</NativeSelectItem>
                      </NativeSelect>
                      <Button 
                        size="icon" 
                        variant="outline" 
                        className="rounded-full" 
                        onClick={() => setEditingNotes({ id: req.id, notes: req.notes || '' })}
                        data-testid={`btn-edit-notes-${req.id}`}
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      {req.linkedDocument?.fileUrl && (
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="rounded-full" 
                          onClick={() => window.open(req.linkedDocument.fileUrl, '_blank')}
                          data-testid={`btn-view-linked-${req.id}`}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                      )}
                      <Button 
                        size="icon" 
                        variant="outline" 
                        className="rounded-full text-red-500" 
                        onClick={() => {
                          showConfirm({
                            title: t('common.confirmAction'),
                            description: t('dashboard.admin.docRequests.confirmDelete', 'Delete this request?'),
                            onConfirm: async () => { deleteMutation.mutate(req.id); },
                          });
                        }}
                        data-testid={`btn-delete-request-${req.id}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="rounded-2xl shadow-sm p-6">
              <div className="text-center space-y-1">
                <p className="font-bold text-sm text-foreground">{t('dashboard.admin.docRequests.noRequests', 'No document requests')}</p>
                <p className="text-xs text-muted-foreground">{t('dashboard.admin.docRequests.noRequestsHint', 'Requests sent to clients will appear here')}</p>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

export function AdminDocsPanel({
  filteredAdminDocuments,
  adminSearchQuery,
  adminOrders,
  adminUsers,
  setFormMessage,
  setDocRejectDialog,
  setDocRejectReason,
  setNoteDialog,
  setAdminDocUploadDialog,
  setAdminDocType,
  setAdminDocFile,
  showConfirm,
}: AdminDocsPanelProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <DocumentRequestsSection setFormMessage={setFormMessage} showConfirm={showConfirm} />

      <div className="border-t pt-4" />

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-lg">{t('dashboard.admin.documents.title')}</h3>
              <Badge className="bg-accent/20 text-accent">{filteredAdminDocuments?.length || 0}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{t('dashboard.admin.documents.subtitle')}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <NativeSelect
              value=""
              onValueChange={(orderId) => {
                if (orderId) {
                  const order = adminOrders?.find((o: any) => o.id === Number(orderId));
                  if (order) {
                    setAdminDocUploadDialog({ open: true, order });
                    setAdminDocType("articles_of_organization");
                    setAdminDocFile(null);
                  }
                }
              }}
              className="h-9 text-xs rounded-full px-3 bg-accent text-primary font-bold min-w-[120px]"
            >
              <option value="">{t('dashboard.admin.documents.byOrder')}</option>
              {adminOrders?.map((order: any) => (
                <option key={order.id} value={order.id}>
                  {order.application?.requestCode || order.maintenanceApplication?.requestCode || order.invoiceNumber} - {order.user?.firstName}
                </option>
              ))}
            </NativeSelect>
            <NativeSelect
              value=""
              onValueChange={(userId) => {
                if (userId) {
                  const user = adminUsers?.find((u: any) => u.id === userId);
                  if (user) {
                    setAdminDocUploadDialog({ open: true, order: { userId: user.id, user } });
                    setAdminDocType("other");
                    setAdminDocFile(null);
                  }
                }
              }}
              className="h-9 text-xs rounded-full px-3 bg-primary text-white font-bold min-w-[120px]"
            >
              <option value="">{t('dashboard.admin.documents.byUser')}</option>
              {adminUsers?.map((user: any) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </NativeSelect>
          </div>
        </div>

        {filteredAdminDocuments && filteredAdminDocuments.length > 0 ? (
          <div className="space-y-3">
            {filteredAdminDocuments.map((doc: any) => {
              const docTypeKey = doc.documentType ? `ntf.docTypes.${doc.documentType}` : '';
              const translatedDocType = docTypeKey ? t(docTypeKey) : '';
              const docTypeLabel = translatedDocType && translatedDocType !== docTypeKey ? translatedDocType : (doc.documentType || '').replace(/_/g, ' ');
              const idvStatusKey = doc.user?.identityVerificationStatus || 'none';
              const idvLabels: Record<string, string> = {
                'none': t('dashboard.admin.documents.idvNone'),
                'requested': t('dashboard.admin.documents.idvRequested'),
                'uploaded': t('dashboard.admin.documents.idvUploaded'),
                'approved': t('dashboard.admin.documents.idvApproved'),
                'rejected': t('dashboard.admin.documents.idvRejected'),
              };
              return (
              <Card key={doc.id} className="rounded-xl shadow-sm p-4" data-testid={`admin-doc-card-${doc.id}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${doc.reviewStatus === 'approved' ? 'bg-accent/10 dark:bg-accent/15' : doc.reviewStatus === 'rejected' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'}`}>
                    <FileText className={`w-5 h-5 ${doc.reviewStatus === 'approved' ? 'text-accent dark:text-accent' : doc.reviewStatus === 'rejected' ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-black text-sm truncate">{doc.fileName}</p>
                      <Badge variant="outline" className={`text-[9px] shrink-0 ${doc.reviewStatus === 'approved' ? 'bg-accent/5 text-accent border-accent/30 dark:bg-accent/10 dark:text-accent dark:border-accent/30' : doc.reviewStatus === 'rejected' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800' : 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800'}`}>
                        {doc.reviewStatus === 'approved' ? t('dashboard.admin.documents.approved') : doc.reviewStatus === 'rejected' ? t('dashboard.admin.documents.rejected') : t('dashboard.admin.documents.pendingStatus')}
                      </Badge>
                      {docTypeLabel && (
                        <Badge variant="outline" className="text-[9px] shrink-0">{docTypeLabel}</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {doc.user && (
                        <>
                          <p className="text-xs text-foreground font-bold">
                            {doc.user.firstName} {doc.user.lastName}
                          </p>
                          <span className="text-[10px] text-muted-foreground">|</span>
                          <p className="text-[10px] text-muted-foreground truncate">{doc.user.email}</p>
                          <span className="text-[10px] text-muted-foreground">|</span>
                          <span className="text-[10px] text-muted-foreground">{t('dashboard.admin.documents.clientId')}: {doc.user.id}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {doc.user && (
                        <>
                          <Badge variant="outline" className={`text-[9px] no-default-hover-elevate no-default-active-elevate ${doc.user.emailVerified ? 'bg-accent/5 text-accent border-accent/30 dark:bg-accent/10 dark:text-accent dark:border-accent/30' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'}`}>
                            {doc.user.emailVerified ? t('dashboard.admin.documents.emailVerified') : t('dashboard.admin.documents.emailNotVerified')}
                          </Badge>
                          {idvStatusKey !== 'none' && (
                            <Badge variant="outline" className={`text-[9px] no-default-hover-elevate no-default-active-elevate ${idvStatusKey === 'approved' ? 'bg-accent/5 text-accent border-accent/30 dark:bg-accent/10 dark:text-accent dark:border-accent/30' : idvStatusKey === 'rejected' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800' : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800'}`}>
                              {idvLabels[idvStatusKey] || idvStatusKey}
                            </Badge>
                          )}
                        </>
                      )}
                      {doc.application?.companyName && (
                        <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium">{doc.application.companyName}</span>
                      )}
                      <span className="text-[10px] text-muted-foreground">{doc.uploadedAt ? formatDate(doc.uploadedAt) : '-'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <NativeSelect 
                      value={doc.reviewStatus || 'pending'} 
                      onValueChange={async val => {
                        if (val === 'rejected') {
                          setDocRejectDialog({ open: true, docId: doc.id });
                          setDocRejectReason("");
                          return;
                        }
                        try {
                          await apiRequest("PATCH", `/api/admin/documents/${doc.id}/review`, { reviewStatus: val });
                          queryClient.invalidateQueries({ queryKey: ["/api/admin/documents"] });
                          queryClient.invalidateQueries({ queryKey: ["/api/admin/document-requests"] });
                          setFormMessage({ type: 'success', text: t("dashboard.toasts.statusUpdated") });
                        } catch { setFormMessage({ type: 'error', text: t("common.error") }); }
                      }}
                      className="h-8 text-[10px] rounded-full px-2 max-w-[110px]"
                    >
                      <NativeSelectItem value="pending">{t('dashboard.admin.documents.pendingStatus')}</NativeSelectItem>
                      <NativeSelectItem value="approved">{t('dashboard.admin.documents.approve')}</NativeSelectItem>
                      <NativeSelectItem value="rejected">{t('dashboard.admin.documents.reject')}</NativeSelectItem>
                    </NativeSelect>
                    {doc.fileUrl && (
                      <Button size="icon" variant="outline" className="rounded-full" onClick={() => window.open(doc.fileUrl, '_blank')} data-testid={`btn-view-doc-${doc.id}`}>
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                    )}
                    {doc.user && (
                      <Button size="icon" variant="outline" className="rounded-full" onClick={() => setNoteDialog({ open: true, user: doc.user })} data-testid={`btn-note-doc-${doc.id}`}>
                        <MessageSquare className="w-3.5 h-3.5" />
                      </Button>
                    )}
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="rounded-full text-red-500" 
                      onClick={() => {
                        showConfirm({
                          title: t('common.confirmAction'),
                          description: t('dashboard.admin.documents.confirmDelete'),
                          onConfirm: async () => {
                            try {
                              await apiRequest("DELETE", `/api/admin/documents/${doc.id}`);
                              queryClient.invalidateQueries({ queryKey: ["/api/admin/documents"] });
                              setFormMessage({ type: 'success', text: t("dashboard.toasts.documentDeleted") });
                            } catch { setFormMessage({ type: 'error', text: t("common.error") }); }
                          },
                        });
                      }}
                      data-testid={`btn-delete-doc-${doc.id}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            );})}
          </div>
        ) : (
          <Card className="rounded-2xl shadow-sm p-8 md:p-12">
            <div className="text-center space-y-1">
              <p className="font-black text-foreground">{t('dashboard.admin.documents.noDocs')}</p>
              <p className="text-xs text-muted-foreground">{t('dashboard.admin.documents.noDocsHint')}</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
