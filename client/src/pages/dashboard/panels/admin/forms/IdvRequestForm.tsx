import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Loader2 } from "@/components/icons";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { AdminUserData } from "@/components/dashboard";

interface IdvRequestFormProps {
  idvRequestDialog: { open: boolean; user: AdminUserData | null };
  idvRequestNotes: string;
  setIdvRequestNotes: (val: string) => void;
  isSendingIdvRequest: boolean;
  setIsSendingIdvRequest: (val: boolean) => void;
  setIdvRequestDialog: (val: { open: boolean; user: AdminUserData | null }) => void;
  setFormMessage: (msg: { type: 'success' | 'error'; text: string } | null) => void;
  onClose: () => void;
}

export function IdvRequestForm({
  idvRequestDialog,
  idvRequestNotes,
  setIdvRequestNotes,
  isSendingIdvRequest,
  setIsSendingIdvRequest,
  setIdvRequestDialog,
  setFormMessage,
  onClose,
}: IdvRequestFormProps) {
  const { t } = useTranslation();

  return (
    <Card className="mb-4 p-4 md:p-6 rounded-2xl border border-accent/30 dark:border-accent/30 bg-accent/5 dark:bg-accent/10 shadow-lg animate-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-black text-foreground">{t('dashboard.admin.users.requestIdvTitle')}</h3>
          <p className="text-sm text-muted-foreground">{t('dashboard.admin.users.requestIdvDesc')} {idvRequestDialog.user?.firstName} {idvRequestDialog.user?.lastName} ({idvRequestDialog.user?.email})</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-semibold text-foreground block mb-2">{t('dashboard.admin.users.idvNotes')}</Label>
          <Textarea value={idvRequestNotes}
            onChange={(e) => setIdvRequestNotes(e.target.value)}
            placeholder={t('dashboard.admin.users.idvNotesPlaceholder')}
            className="rounded-xl border-border bg-white dark:bg-card"
            rows={3}
            data-testid="input-idv-notes"
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-accent/30 dark:border-accent/30">
        <Button disabled={isSendingIdvRequest}
          onClick={async () => {
            if (!idvRequestDialog.user?.id) return;
            setIsSendingIdvRequest(true);
            try {
              await apiRequest("POST", `/api/admin/users/${idvRequestDialog.user.id}/request-identity-verification`, { notes: idvRequestNotes || undefined });
              setFormMessage({ type: 'success', text: t('dashboard.admin.users.idvRequestSent') });
              setIdvRequestDialog({ open: false, user: null });
              setIdvRequestNotes("");
              queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
            } catch {
              setFormMessage({ type: 'error', text: t('dashboard.admin.users.idvRequestError') });
            } finally {
              setIsSendingIdvRequest(false);
            }
          }}
          className="flex-1 bg-accent text-white font-black rounded-full"
          data-testid="button-confirm-idv-request"
        >
          {isSendingIdvRequest ? <Loader2 className="w-4 h-4 animate-spin" /> : t('dashboard.admin.users.sendIdvBtn')}
        </Button>
        <Button variant="outline" onClick={onClose} className="flex-1 rounded-full">{t('common.cancel')}</Button>
      </div>
    </Card>
  );
}
