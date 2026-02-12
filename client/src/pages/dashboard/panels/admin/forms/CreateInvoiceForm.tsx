import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectItem } from "@/components/ui/native-select";
import { X } from "@/components/icons";
import { AdminUserData } from "@/components/dashboard";

interface CreateInvoiceFormProps {
  invoiceDialog: { open: boolean; user: AdminUserData | null };
  invoiceConcept: string;
  setInvoiceConcept: (val: string) => void;
  invoiceAmount: string;
  setInvoiceAmount: (val: string) => void;
  invoiceCurrency: string;
  setInvoiceCurrency: (val: string) => void;
  invoiceDate: string;
  setInvoiceDate: (val: string) => void;
  invoicePaymentAccountIds: number[];
  setInvoicePaymentAccountIds: (fn: (prev: number[]) => number[]) => void;
  paymentAccountsList: any[];
  createInvoiceMutation: { mutate: (data: any) => void; isPending: boolean };
  onClose: () => void;
}

export function CreateInvoiceForm({ invoiceDialog, invoiceConcept, setInvoiceConcept, invoiceAmount, setInvoiceAmount, invoiceCurrency, setInvoiceCurrency, invoiceDate, setInvoiceDate, invoicePaymentAccountIds, setInvoicePaymentAccountIds, paymentAccountsList, createInvoiceMutation, onClose }: CreateInvoiceFormProps) {
  const { t } = useTranslation();

  return (
    <Card className="mb-4 p-4 md:p-6 rounded-2xl border border-accent/30 bg-white dark:bg-card shadow-lg animate-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-black text-foreground tracking-tight">{t('dashboard.admin.createInvoice')}</h3>
          <p className="text-sm text-muted-foreground">{t('dashboard.admin.client')}: {invoiceDialog.user?.firstName} {invoiceDialog.user?.lastName}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-semibold text-foreground mb-2 block">{t('dashboard.admin.concept')}</Label>
          <Input value={invoiceConcept} 
            onChange={e => setInvoiceConcept(e.target.value)} 
            placeholder={t('dashboard.admin.conceptPlaceholder')} 
            className="w-full rounded-full h-11 px-4 border border-border dark:border-border bg-white dark:bg-card"
            data-testid="input-invoice-concept"
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <Label className="text-sm font-semibold text-foreground mb-2 block">{t('dashboard.admin.invoiceAmount')}</Label>
            <Input type="number" 
              value={invoiceAmount} 
              onChange={e => setInvoiceAmount(e.target.value)} 
              placeholder="899" 
              className="w-full rounded-full h-11 px-4 border border-border dark:border-border bg-white dark:bg-card"
              data-testid="input-invoice-amount"
            />
          </div>
          <div>
            <Label className="text-sm font-semibold text-foreground mb-2 block">{t('dashboard.admin.currencyLabel')}</Label>
            <NativeSelect 
              value={invoiceCurrency} 
              onValueChange={setInvoiceCurrency}
              className="w-full rounded-full h-11 px-3 border border-border dark:border-border bg-white dark:bg-card"
              data-testid="select-invoice-currency"
            >
              <NativeSelectItem value="EUR">EUR</NativeSelectItem>
              <NativeSelectItem value="USD">USD</NativeSelectItem>
            </NativeSelect>
          </div>
          <div className="col-span-2">
            <Label className="text-sm font-semibold text-foreground mb-2 block">{t('dashboard.admin.invoiceDate')}</Label>
            <Input type="date" 
              value={invoiceDate} 
              onChange={e => setInvoiceDate(e.target.value)} 
              className="w-full rounded-full h-11 px-4 border border-border dark:border-border bg-white dark:bg-card"
              data-testid="input-invoice-date"
            />
          </div>
        </div>
        <div>
          <Label className="text-sm font-semibold text-foreground mb-2 block">{t('dashboard.admin.invoicePaymentMethods')}</Label>
          <div className="flex flex-wrap gap-2">
            {paymentAccountsList?.filter((a: any) => a.isActive).map((acct: any) => (
              <Button 
                key={acct.id}
                type="button"
                size="sm"
                variant={invoicePaymentAccountIds.includes(acct.id) ? "default" : "outline"}
                className={`rounded-full text-xs ${invoicePaymentAccountIds.includes(acct.id) ? 'bg-accent text-accent-foreground' : ''}`}
                onClick={() => {
                  setInvoicePaymentAccountIds(prev => 
                    prev.includes(acct.id) ? prev.filter(id => id !== acct.id) : [...prev, acct.id]
                  );
                }}
                data-testid={`button-invoice-payment-${acct.id}`}
              >
                {acct.label}
              </Button>
            ))}
            {(!paymentAccountsList || paymentAccountsList.filter((a: any) => a.isActive).length === 0) && (
              <p className="text-xs text-muted-foreground">{t('dashboard.admin.noPaymentAccounts')}</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t">
        <Button onClick={() => invoiceDialog.user?.id && createInvoiceMutation.mutate({ 
            userId: invoiceDialog.user.id, 
            concept: invoiceConcept, 
            amount: Math.round(parseFloat(invoiceAmount) * 100),
            currency: invoiceCurrency,
            invoiceDate,
            paymentAccountIds: invoicePaymentAccountIds.length > 0 ? invoicePaymentAccountIds : undefined
          })} 
          disabled={!invoiceConcept || !invoiceAmount || createInvoiceMutation.isPending}
          className="flex-1 bg-accent text-accent-foreground font-black rounded-full"
          data-testid="button-create-invoice"
        >
          {createInvoiceMutation.isPending ? t('dashboard.admin.creating') : t('dashboard.admin.createInvoiceBtn')}
        </Button>
        <Button variant="outline" onClick={onClose} className="flex-1 rounded-full">{t('common.cancel')}</Button>
      </div>
    </Card>
  );
}
