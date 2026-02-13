import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { X } from "@/components/icons";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface DocRejectFormProps {
  docRejectDialog: { open: boolean; docId: number | null };
  docRejectReason: string;
  setDocRejectReason: (val: string) => void;
  setDocRejectDialog: (val: { open: boolean; docId: number | null }) => void;
  setFormMessage: (msg: { type: 'success' | 'error'; text: string } | null) => void;
  onClose: () => void;
}

export function DocRejectForm({
  docRejectDialog,
  docRejectReason,
  setDocRejectReason,
  setDocRejectDialog,
  setFormMessage,
  onClose,
}: DocRejectFormProps) {
  const { t } = useTranslation();

  return (
    <Card className="mb-4 p-4 md:p-6 rounded-2xl border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30 shadow-lg animate-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-black text-foreground">{t('dashboard.admin.documents.rejectionReasonTitle')}</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full" data-testid="button-close-doc-reject">
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-4">
        <Textarea value={docRejectReason}
          onChange={(e) => setDocRejectReason(e.target.value)}
          placeholder={t('dashboard.admin.documents.rejectionReasonPlaceholder')}
          className="rounded-xl border-border bg-white dark:bg-card"
          rows={3}
          data-testid="input-doc-reject-reason"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-4 border-t border-red-200 dark:border-red-800">
        <Button
          disabled={!docRejectReason.trim()}
          onClick={async () => {
            if (!docRejectDialog.docId || !docRejectReason.trim()) {
              setFormMessage({ type: 'error', text: t('dashboard.admin.documents.rejectionReasonRequired') });
              return;
            }
            try {
              await apiRequest("PATCH", `/api/admin/documents/${docRejectDialog.docId}/review`, { reviewStatus: 'rejected', rejectionReason: docRejectReason });
              queryClient.invalidateQueries({ queryKey: ["/api/admin/documents"] });
              setFormMessage({ type: 'success', text: t("dashboard.toasts.statusUpdated") });
              setDocRejectDialog({ open: false, docId: null });
              setDocRejectReason("");
            } catch { setFormMessage({ type: 'error', text: t("common.error") }); }
          }}
          variant="destructive"
          className="flex-1 font-black rounded-full"
          data-testid="button-confirm-doc-reject"
        >
          {t('dashboard.admin.documents.confirmReject')}
        </Button>
        <Button variant="outline" onClick={onClose} className="flex-1 rounded-full" data-testid="button-cancel-doc-reject">{t('common.cancel')}</Button>
      </div>
    </Card>
  );
}
