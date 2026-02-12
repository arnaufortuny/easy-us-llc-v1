import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Loader2 } from "@/components/icons";
import { AdminUserData } from "@/components/dashboard";

interface SendNoteFormProps {
  noteDialog: { open: boolean; user: AdminUserData | null };
  noteTitle: string;
  setNoteTitle: (val: string) => void;
  noteMessage: string;
  setNoteMessage: (val: string) => void;
  noteType: string;
  sendNoteMutation: { mutate: (data: any) => void; isPending: boolean };
  onClose: () => void;
}

export function SendNoteForm({ noteDialog, noteTitle, setNoteTitle, noteMessage, setNoteMessage, noteType, sendNoteMutation, onClose }: SendNoteFormProps) {
  const { t } = useTranslation();

  return (
    <Card className="mb-4 p-4 md:p-6 rounded-2xl border border-accent/30 bg-white dark:bg-card shadow-lg animate-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-black text-foreground tracking-tight">{t('dashboard.admin.sendMessageTitle')}</h3>
          <p className="text-sm text-muted-foreground">{t('dashboard.admin.clientNotification')}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-semibold text-foreground mb-2 block">{t('dashboard.admin.messageTitle')}</Label>
          <Input value={noteTitle} onChange={e => setNoteTitle(e.target.value)} placeholder={t('dashboard.admin.messageTitlePlaceholder')} className="w-full rounded-full h-11 px-4 border border-border dark:border-border bg-white dark:bg-card" data-testid="input-note-title" />
        </div>
        <div>
          <Label className="text-sm font-semibold text-foreground mb-2 block">{t('dashboard.admin.message')}</Label>
          <Textarea value={noteMessage} onChange={e => setNoteMessage(e.target.value)} placeholder={t('dashboard.admin.messagePlaceholder')} rows={4} className="w-full rounded-2xl border-border bg-background dark:bg-card" data-testid="input-note-message" />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t">
        <Button onClick={() => noteDialog.user?.id && sendNoteMutation.mutate({ userId: noteDialog.user.id, title: noteTitle, message: noteMessage, type: noteType })} disabled={!noteTitle || !noteMessage || sendNoteMutation.isPending} className="flex-1 bg-accent text-accent-foreground font-black rounded-full" data-testid="button-send-note">
          {sendNoteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t('dashboard.admin.sendMessage')}
        </Button>
        <Button variant="outline" onClick={onClose} className="flex-1 rounded-full">{t('common.cancel')}</Button>
      </div>
    </Card>
  );
}
