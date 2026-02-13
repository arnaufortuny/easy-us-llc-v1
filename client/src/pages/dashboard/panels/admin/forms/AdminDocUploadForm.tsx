import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { X, Loader2, FileUp, Upload } from "@/components/icons";
import { NativeSelect, NativeSelectItem } from "@/components/ui/native-select";
import { queryClient, getCsrfToken } from "@/lib/queryClient";

interface AdminDocUploadFormProps {
  adminDocUploadDialog: { open: boolean; order: any };
  adminDocType: string;
  setAdminDocType: (val: string) => void;
  adminDocFile: File | null;
  setAdminDocFile: (val: File | null) => void;
  isUploadingAdminDoc: boolean;
  setIsUploadingAdminDoc: (val: boolean) => void;
  setAdminDocUploadDialog: (val: { open: boolean; order: any }) => void;
  setFormMessage: (msg: { type: 'success' | 'error'; text: string } | null) => void;
  onClose: () => void;
}

export function AdminDocUploadForm({
  adminDocUploadDialog,
  adminDocType,
  setAdminDocType,
  adminDocFile,
  setAdminDocFile,
  isUploadingAdminDoc,
  setIsUploadingAdminDoc,
  setAdminDocUploadDialog,
  setFormMessage,
  onClose,
}: AdminDocUploadFormProps) {
  const { t } = useTranslation();

  return (
    <Card className="mb-4 p-4 md:p-6 rounded-2xl border border-accent/30 bg-white dark:bg-card shadow-lg animate-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-black text-foreground tracking-tight">{t('dashboard.admin.uploadDocForClient')}</h3>
          <p className="text-sm text-muted-foreground">
            {adminDocUploadDialog.order?.userId 
              ? `${t('dashboard.admin.user')}: ${adminDocUploadDialog.order?.user?.firstName} ${adminDocUploadDialog.order?.user?.lastName}`
              : `${t('dashboard.admin.orderLabel')}: ${adminDocUploadDialog.order?.application?.requestCode || adminDocUploadDialog.order?.maintenanceApplication?.requestCode || adminDocUploadDialog.order?.invoiceNumber}`
            }
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-semibold text-foreground block mb-2">{t('dashboard.admin.adminDocType')}</Label>
          <NativeSelect
            value={adminDocType}
            onValueChange={setAdminDocType}
            className="w-full rounded-xl h-11 px-4 border border-border dark:border-border bg-white dark:bg-card"
          >
            <NativeSelectItem value="articles_of_organization">{t('dashboard.admin.articlesOfOrg')}</NativeSelectItem>
            <NativeSelectItem value="certificate_of_formation">{t('dashboard.admin.certOfFormation')}</NativeSelectItem>
            <NativeSelectItem value="boir">BOIR</NativeSelectItem>
            <NativeSelectItem value="ein_document">{t('dashboard.admin.einDocument')}</NativeSelectItem>
            <NativeSelectItem value="operating_agreement">{t('dashboard.admin.operatingAgreement')}</NativeSelectItem>
            <NativeSelectItem value="invoice">{t('dashboard.admin.invoice')}</NativeSelectItem>
            <NativeSelectItem value="other">{t('dashboard.admin.otherDoc')}</NativeSelectItem>
          </NativeSelect>
        </div>
        <div>
          <Label className="text-sm font-semibold text-foreground block mb-2">{t('dashboard.admin.file')}</Label>
          <label className="cursor-pointer block">
            <input 
              type="file" 
              className="hidden" 
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setAdminDocFile(file);
              }}
            />
            <div className={`p-4 border-2 border-dashed rounded-xl text-center ${adminDocFile ? 'border-accent bg-accent/5' : 'border-border dark:border-border'}`}>
              {adminDocFile ? (
                <div className="flex items-center justify-center gap-2">
                  <FileUp className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium truncate max-w-[200px]">{adminDocFile.name}</span>
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">
                  <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  {t('dashboard.admin.clickToSelectFile')}
                </div>
              )}
            </div>
          </label>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t">
        <Button disabled={!adminDocFile || isUploadingAdminDoc}
          onClick={async () => {
            if (!adminDocFile || !adminDocUploadDialog.order) return;
            setIsUploadingAdminDoc(true);
            try {
              const formData = new FormData();
              formData.append('file', adminDocFile);
              formData.append('documentType', adminDocType);
              if (adminDocUploadDialog.order.userId) {
                formData.append('userId', adminDocUploadDialog.order.userId);
              } else {
                formData.append('orderId', adminDocUploadDialog.order.id);
              }
              const csrfToken = await getCsrfToken();
              const res = await fetch('/api/admin/documents/upload', {
                method: 'POST',
                headers: { 'X-CSRF-Token': csrfToken },
                body: formData,
                credentials: 'include'
              });
              if (res.ok) {
                setFormMessage({ type: 'success', text: t("dashboard.toasts.adminDocUploaded") + ". " + t("dashboard.toasts.adminDocUploadedDesc") });
                queryClient.invalidateQueries({ queryKey: ["/api/admin/documents"] });
                queryClient.invalidateQueries({ queryKey: ["/api/user/documents"] });
                setAdminDocUploadDialog({ open: false, order: null });
                setAdminDocFile(null);
              } else {
                const data = await res.json();
                setFormMessage({ type: 'error', text: t("common.error") + ". " + (data.message || t("dashboard.toasts.couldNotUpload")) });
              }
            } catch {
              setFormMessage({ type: 'error', text: t("common.error") + ". " + t("dashboard.toasts.connectionError") });
            } finally {
              setIsUploadingAdminDoc(false);
            }
          }}
          className="flex-1 bg-accent text-accent-foreground font-black rounded-full"
          data-testid="button-admin-upload-doc"
        >
          {isUploadingAdminDoc ? <Loader2 className="w-4 h-4 animate-spin" /> : t('dashboard.admin.uploadDocBtn')}
        </Button>
        <Button variant="outline" onClick={onClose} className="flex-1 rounded-full">{t('common.cancel')}</Button>
      </div>
    </Card>
  );
}
