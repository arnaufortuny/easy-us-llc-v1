import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Loader2 } from "@/components/icons";

interface CreateUserFormProps {
  newUserData: { firstName: string; lastName: string; email: string; phone: string; password: string };
  setNewUserData: (fn: (prev: any) => any) => void;
  createUserMutation: { mutate: (data: any) => void; isPending: boolean };
  onClose: () => void;
}

export function CreateUserForm({ newUserData, setNewUserData, createUserMutation, onClose }: CreateUserFormProps) {
  const { t } = useTranslation();

  return (
    <Card className="mb-4 p-4 md:p-6 rounded-2xl border border-accent/30 bg-white dark:bg-card shadow-lg animate-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-black text-foreground tracking-tight">{t('dashboard.admin.newClient')}</h3>
          <p className="text-sm text-muted-foreground">{t('dashboard.admin.configureOrder')}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full" data-testid="button-close-create-user">
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm font-semibold text-foreground mb-2 block">{t('dashboard.admin.firstName')}</Label>
            <Input value={newUserData.firstName} onChange={e => setNewUserData(p => ({ ...p, firstName: e.target.value }))} placeholder={t('dashboard.admin.firstName')} className="rounded-full h-11 px-4 border border-border dark:border-border bg-white dark:bg-card" data-testid="input-create-user-firstname" />
          </div>
          <div>
            <Label className="text-sm font-semibold text-foreground mb-2 block">{t('dashboard.admin.lastName')}</Label>
            <Input value={newUserData.lastName} onChange={e => setNewUserData(p => ({ ...p, lastName: e.target.value }))} placeholder={t('dashboard.admin.lastName')} className="rounded-full h-11 px-4 border border-border dark:border-border bg-white dark:bg-card" data-testid="input-create-user-lastname" />
          </div>
        </div>
        <div>
          <Label className="text-sm font-semibold text-foreground mb-2 block">{t('dashboard.admin.email')}</Label>
          <Input type="email" value={newUserData.email} onChange={e => setNewUserData(p => ({ ...p, email: e.target.value }))} placeholder={t('dashboard.admin.email')} className="rounded-full h-11 px-4 border border-border dark:border-border bg-white dark:bg-card" data-testid="input-create-user-email" />
        </div>
        <div>
          <Label className="text-sm font-semibold text-foreground mb-2 block">{t('dashboard.admin.phone')}</Label>
          <Input value={newUserData.phone} onChange={e => setNewUserData(p => ({ ...p, phone: e.target.value }))} className="rounded-full h-11 px-4 border border-border dark:border-border bg-white dark:bg-card" data-testid="input-create-user-phone" />
        </div>
        <div>
          <Label className="text-sm font-semibold text-foreground mb-2 block">{t('dashboard.admin.password')}</Label>
          <Input type="password" value={newUserData.password} onChange={e => setNewUserData(p => ({ ...p, password: e.target.value }))} placeholder={t('dashboard.admin.minChars')} className="rounded-full h-11 px-4 border border-border dark:border-border bg-white dark:bg-card" data-testid="input-create-user-password" />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t">
        <Button onClick={() => createUserMutation.mutate(newUserData)} disabled={createUserMutation.isPending || !newUserData.email || !newUserData.password} className="flex-1 bg-accent text-accent-foreground font-black rounded-full" data-testid="button-confirm-create-user">
          {createUserMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t('dashboard.admin.createClient')}
        </Button>
        <Button variant="outline" onClick={onClose} className="flex-1 rounded-full" data-testid="button-cancel-create-user">{t('common.cancel')}</Button>
      </div>
    </Card>
  );
}
