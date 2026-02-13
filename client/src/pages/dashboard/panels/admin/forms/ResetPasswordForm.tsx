import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Loader2 } from "@/components/icons";
import { apiRequest } from "@/lib/queryClient";
import { AdminUserData } from "@/components/dashboard";

interface ResetPasswordFormProps {
  resetPasswordDialog: { open: boolean; user: AdminUserData | null };
  newAdminPassword: string;
  setNewAdminPassword: (val: string) => void;
  isResettingPassword: boolean;
  setIsResettingPassword: (val: boolean) => void;
  setResetPasswordDialog: (val: { open: boolean; user: AdminUserData | null }) => void;
  setFormMessage: (msg: { type: 'success' | 'error'; text: string } | null) => void;
  onClose: () => void;
}

export function ResetPasswordForm({
  resetPasswordDialog,
  newAdminPassword,
  setNewAdminPassword,
  isResettingPassword,
  setIsResettingPassword,
  setResetPasswordDialog,
  setFormMessage,
  onClose,
}: ResetPasswordFormProps) {
  const { t } = useTranslation();

  return (
    <Card className="mb-4 p-4 md:p-6 rounded-2xl border border-accent/30 bg-white dark:bg-card shadow-lg animate-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-black text-foreground">{t('dashboard.admin.resetPassword')}</h3>
          <p className="text-sm text-muted-foreground">{t('dashboard.admin.newPasswordFor')} {resetPasswordDialog.user?.firstName} {resetPasswordDialog.user?.lastName}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-semibold text-foreground block mb-2">{t('dashboard.admin.newPassword')}</Label>
          <Input type="password"
            value={newAdminPassword}
            onChange={(e) => setNewAdminPassword(e.target.value)}
            placeholder={t('dashboard.admin.minChars')}
            className="rounded-xl h-12 border-border bg-background dark:bg-card"
            data-testid="input-admin-new-password"
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t">
        <Button disabled={newAdminPassword.length < 8 || isResettingPassword}
          onClick={async () => {
            if (!resetPasswordDialog.user?.id || newAdminPassword.length < 8) return;
            setIsResettingPassword(true);
            try {
              await apiRequest("POST", `/api/admin/users/${resetPasswordDialog.user.id}/reset-password`, { newPassword: newAdminPassword });
              setFormMessage({ type: 'success', text: t("dashboard.toasts.adminPasswordUpdated") + ". " + t("dashboard.toasts.adminPasswordUpdatedDesc") });
              setResetPasswordDialog({ open: false, user: null });
              setNewAdminPassword("");
            } catch {
              setFormMessage({ type: 'error', text: t("common.error") + ". " + t("dashboard.toasts.couldNotUpdatePassword") });
            } finally {
              setIsResettingPassword(false);
            }
          }}
          className="flex-1 bg-accent text-accent-foreground font-black rounded-full"
          data-testid="button-confirm-reset-password"
        >
          {isResettingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : t('dashboard.admin.resetPasswordBtn')}
        </Button>
        <Button variant="outline" onClick={onClose} className="flex-1 rounded-full">{t('common.cancel')}</Button>
      </div>
    </Card>
  );
}
