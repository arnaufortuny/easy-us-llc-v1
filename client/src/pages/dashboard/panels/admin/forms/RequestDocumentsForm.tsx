import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect, NativeSelectItem } from "@/components/ui/native-select";
import { X, Loader2 } from "@/components/icons";
import { AdminUserData } from "@/components/dashboard";

interface RequestDocumentsFormProps {
  docDialog: { open: boolean; user: AdminUserData | null };
  docType: string;
  setDocType: (val: string) => void;
  docMessage: string;
  setDocMessage: (val: string) => void;
  sendNoteMutation: { mutate: (data: any) => void; isPending: boolean };
  onClose: () => void;
}

export function RequestDocumentsForm({ docDialog, docType, setDocType, docMessage, setDocMessage, sendNoteMutation, onClose }: RequestDocumentsFormProps) {
  const { t } = useTranslation();

  return (
    <Card className="mb-4 p-4 md:p-6 rounded-2xl border border-accent/30 bg-white dark:bg-card shadow-lg animate-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-black text-foreground tracking-tight">{t('dashboard.admin.requestDocs')}</h3>
          <p className="text-sm text-muted-foreground">{t('dashboard.admin.requestDocsDesc')}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-semibold text-foreground mb-2 block">{t('dashboard.admin.docType')}</Label>
          <NativeSelect 
            value={docType} 
            onValueChange={setDocType}
            placeholder={t('dashboard.admin.selectDocType')}
            className="w-full rounded-xl h-11 px-4 border border-border dark:border-border bg-white dark:bg-card"
          >
            <NativeSelectItem value="passport">{t('dashboard.admin.docPassport')}</NativeSelectItem>
            <NativeSelectItem value="address_proof">{t('dashboard.admin.docAddressProof')}</NativeSelectItem>
            <NativeSelectItem value="tax_id">{t('dashboard.admin.docTaxId')}</NativeSelectItem>
            <NativeSelectItem value="other">{t('dashboard.admin.docOther')}</NativeSelectItem>
          </NativeSelect>
        </div>
        <div>
          <Label className="text-sm font-semibold text-foreground mb-2 block">{t('dashboard.admin.message')}</Label>
          <Textarea value={docMessage} onChange={e => setDocMessage(e.target.value)} placeholder={t('dashboard.admin.messageForClient')} rows={3} className="w-full rounded-2xl border-border bg-background dark:bg-card" data-testid="input-doc-message" />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t">
        <Button onClick={() => {
          if (docDialog.user?.id && docDialog.user?.email) {
            const docTypeI18nKeys: Record<string, string> = {
              passport: 'dashboard.documents.passport',
              address_proof: 'dashboard.documents.addressProof',
              tax_id: 'dashboard.documents.taxId',
              other: 'dashboard.documents.otherDocument'
            };
            const docI18nKey = docTypeI18nKeys[docType] || docType;
            const i18nTitle = `i18n:ntf.docRequested.title::{"docType":"@${docI18nKey}"}`;
            const i18nMessage = docMessage 
              ? `i18n:ntf.docRequested.message::{"docType":"@${docI18nKey}"}` 
              : `i18n:ntf.docRequested.message::{"docType":"@${docI18nKey}"}`;
            sendNoteMutation.mutate({ 
              userId: docDialog.user.id, 
              title: i18nTitle, 
              message: docMessage || i18nMessage, 
              type: 'action_required' 
            });
            onClose();
            setDocType('');
            setDocMessage('');
          }
        }} disabled={!docType || sendNoteMutation.isPending} className="flex-1 bg-accent text-accent-foreground font-black rounded-full" data-testid="button-request-doc">
          {sendNoteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t('dashboard.admin.requestDocBtn')}
        </Button>
        <Button variant="outline" onClick={onClose} className="flex-1 rounded-full">{t('common.cancel')}</Button>
      </div>
    </Card>
  );
}
