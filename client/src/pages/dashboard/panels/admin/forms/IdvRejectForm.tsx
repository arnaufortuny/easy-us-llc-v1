import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Loader2 } from "@/components/icons";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { AdminUserData } from "@/components/dashboard";

interface IdvRejectFormProps {
  idvRejectDialog: { open: boolean; user: AdminUserData | null };
  idvRejectReason: string;
  setIdvRejectReason: (val: string) => void;
  isSendingIdvReject: boolean;
  setIsSendingIdvReject: (val: boolean) => void;
  setIdvRejectDialog: (val: { open: boolean; user: AdminUserData | null }) => void;
  setFormMessage: (msg: { type: 'success' | 'error'; text: string } | null) => void;
  onClose: () => void;
}

export function IdvRejectForm({
  idvRejectDialog,
  idvRejectReason,
  setIdvRejectReason,
  isSendingIdvReject,
  setIsSendingIdvReject,
  setIdvRejectDialog,
  setFormMessage,
  onClose,
}: IdvRejectFormProps) {
  const { t } = useTranslation();

  return (
    <Card className="mb-4 p-4 md:p-6 rounded-2xl border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30 shadow-lg animate-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-black text-foreground">{t('dashboard.admin.users.rejectIdvTitle')}</h3>
          <p className="text-sm text-muted-foreground">{t('dashboard.admin.users.rejectIdvDesc')} {idvRejectDialog.user?.firstName} {idvRejectDialog.user?.lastName}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-semibold text-foreground block mb-2">{t('dashboard.admin.users.idvRejectReason')}</Label>
          <Textarea value={idvRejectReason}
            onChange={(e) => setIdvRejectReason(e.target.value)}
            placeholder={t('dashboard.admin.users.idvRejectReasonPlaceholder')}
            className="rounded-xl border-border bg-white dark:bg-card"
            rows={3}
            data-testid="input-idv-reject-reason"
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-red-200 dark:border-red-800">
        <Button disabled={isSendingIdvReject}
          onClick={async () => {
            if (!idvRejectDialog.user?.id) return;
            setIsSendingIdvReject(true);
            try {
              await apiRequest("POST", `/api/admin/users/${idvRejectDialog.user.id}/reject-identity-verification`, { reason: idvRejectReason || undefined });
              setFormMessage({ type: 'success', text: t('dashboard.admin.users.idvRejected') });
              setIdvRejectDialog({ open: false, user: null });
              setIdvRejectReason("");
              queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
            } catch {
              setFormMessage({ type: 'error', text: t('common.error') });
            } finally {
              setIsSendingIdvReject(false);
            }
          }}
          className="flex-1 bg-red-600 text-white font-black rounded-full"
          data-testid="button-confirm-idv-reject"
        >
          {isSendingIdvReject ? <Loader2 className="w-4 h-4 animate-spin" /> : t('dashboard.admin.users.rejectIdvBtn')}
        </Button>
        <Button variant="outline" onClick={onClose} className="flex-1 rounded-full">{t('common.cancel')}</Button>
      </div>
    </Card>
  );
}
