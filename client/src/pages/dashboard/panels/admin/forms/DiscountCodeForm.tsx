import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { NativeSelect, NativeSelectItem } from "@/components/ui/native-select";
import { X } from "@/components/icons";
import { DiscountCode } from "@/components/dashboard";
import { apiRequest } from "@/lib/queryClient";

interface DiscountCodeFormProps {
  discountCodeDialog: { open: boolean; code: DiscountCode | null };
  newDiscountCode: {
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: string;
    minOrderAmount: string;
    maxUses: string;
    validFrom: string;
    validUntil: string;
    isActive: boolean;
  };
  setNewDiscountCode: (fn: (prev: any) => any) => void;
  refetchDiscountCodes: () => void;
  setFormMessage: (msg: { type: 'error' | 'success' | 'info'; text: string } | null) => void;
  onClose: () => void;
}

export function DiscountCodeForm({ discountCodeDialog, newDiscountCode, setNewDiscountCode, refetchDiscountCodes, setFormMessage, onClose }: DiscountCodeFormProps) {
  const { t } = useTranslation();

  return (
    <Card className="mb-4 p-4 md:p-6 rounded-2xl border border-accent/30 bg-white dark:bg-card shadow-lg animate-in slide-in-from-top-2 duration-200 max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-black text-foreground tracking-tight">
            {discountCodeDialog.code ? t('dashboard.admin.editDiscountCode') : t('dashboard.admin.newDiscountCode')}
          </h3>
          <p className="text-sm text-muted-foreground">
            {discountCodeDialog.code ? t('dashboard.admin.editDiscountCodeDesc') : t('dashboard.admin.newDiscountCodeDesc')}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-semibold text-foreground mb-2 block">{t('dashboard.admin.code')}</Label>
          <Input value={newDiscountCode.code} 
            onChange={e => setNewDiscountCode(p => ({ ...p, code: e.target.value.toUpperCase() }))} 
            className="rounded-xl h-11 px-4 border border-border dark:border-border uppercase bg-white dark:bg-card" 
            disabled={!!discountCodeDialog.code}
            data-testid="input-discount-code" 
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm font-semibold text-foreground mb-2 block">{t('dashboard.admin.type')}</Label>
            <NativeSelect 
              value={newDiscountCode.discountType} 
              onValueChange={(val) => setNewDiscountCode(p => ({ ...p, discountType: val as 'percentage' | 'fixed' }))}
              className="w-full rounded-xl h-11 px-3 border border-border dark:border-border bg-white dark:bg-card"
              data-testid="select-discount-type"
            >
              <NativeSelectItem value="percentage">{t('dashboard.admin.percentage')}</NativeSelectItem>
              <NativeSelectItem value="fixed">{t('dashboard.admin.fixed')}</NativeSelectItem>
            </NativeSelect>
          </div>
          <div>
            <Label className="text-sm font-semibold text-foreground mb-2 block">
              {t('dashboard.admin.value')} {newDiscountCode.discountType === 'percentage' ? '(%)' : '(cts)'}
            </Label>
            <Input type="number" 
              value={newDiscountCode.discountValue} 
              onChange={e => setNewDiscountCode(p => ({ ...p, discountValue: e.target.value }))} 
              className="rounded-xl h-11 px-4 border border-border dark:border-border bg-white dark:bg-card" 
              data-testid="input-discount-value" 
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm font-semibold text-foreground mb-2 block">{t('dashboard.admin.minAmount')}</Label>
            <Input type="number" 
              value={newDiscountCode.minOrderAmount} 
              onChange={e => setNewDiscountCode(p => ({ ...p, minOrderAmount: e.target.value }))} 
              className="rounded-xl h-11 px-4 border border-border dark:border-border bg-white dark:bg-card" 
              data-testid="input-discount-min-amount" 
            />
          </div>
          <div>
            <Label className="text-sm font-semibold text-foreground mb-2 block">{t('dashboard.admin.maxUses')}</Label>
            <Input type="number" 
              value={newDiscountCode.maxUses} 
              onChange={e => setNewDiscountCode(p => ({ ...p, maxUses: e.target.value }))} 
              className="rounded-xl h-11 px-4 border border-border dark:border-border bg-white dark:bg-card" 
              data-testid="input-discount-max-uses" 
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm font-semibold text-foreground mb-2 block">{t('dashboard.admin.validFrom')}</Label>
            <Input type="date" 
              value={newDiscountCode.validFrom} 
              onChange={e => setNewDiscountCode(p => ({ ...p, validFrom: e.target.value }))} 
              className="rounded-xl h-11 px-4 border border-border dark:border-border bg-white dark:bg-card" 
              data-testid="input-discount-valid-from" 
            />
          </div>
          <div>
            <Label className="text-sm font-semibold text-foreground mb-2 block">{t('dashboard.admin.validUntil')}</Label>
            <Input type="date" 
              value={newDiscountCode.validUntil} 
              onChange={e => setNewDiscountCode(p => ({ ...p, validUntil: e.target.value }))} 
              className="rounded-xl h-11 px-4 border border-border dark:border-border bg-white dark:bg-card" 
              data-testid="input-discount-valid-until" 
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Switch 
            checked={newDiscountCode.isActive} 
            onCheckedChange={(checked) => setNewDiscountCode(p => ({ ...p, isActive: checked }))}
            data-testid="switch-discount-active"
          />
          <Label className="text-sm font-semibold">{t('dashboard.admin.activeCode')}</Label>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t mt-4">
        <Button onClick={async () => {
            try {
              const payload = {
                code: newDiscountCode.code,
                discountType: newDiscountCode.discountType,
                discountValue: parseInt(newDiscountCode.discountValue),
                minOrderAmount: newDiscountCode.minOrderAmount ? parseInt(newDiscountCode.minOrderAmount) * 100 : null,
                maxUses: newDiscountCode.maxUses ? parseInt(newDiscountCode.maxUses) : null,
                validFrom: newDiscountCode.validFrom || null,
                validUntil: newDiscountCode.validUntil || null,
                isActive: newDiscountCode.isActive
              };
              if (discountCodeDialog.code) {
                await apiRequest("PATCH", `/api/admin/discount-codes/${discountCodeDialog.code.id}`, payload);
                setFormMessage({ type: 'success', text: t("dashboard.toasts.discountCodeUpdated") });
              } else {
                await apiRequest("POST", "/api/admin/discount-codes", payload);
                setFormMessage({ type: 'success', text: t("dashboard.toasts.discountCodeCreated") });
              }
              refetchDiscountCodes();
              onClose();
            } catch (e: any) {
              setFormMessage({ type: 'error', text: t("common.error") + ". " + (e.message || t("dashboard.toasts.couldNotSave")) });
            }
          }} 
          disabled={!newDiscountCode.code || !newDiscountCode.discountValue} 
          className="flex-1 bg-accent text-accent-foreground font-black rounded-full" 
          data-testid="button-save-discount"
        >
          {discountCodeDialog.code ? t('dashboard.admin.saveDiscountChanges') : t('dashboard.admin.createCode')}
        </Button>
        <Button variant="outline" onClick={onClose} className="flex-1 rounded-full" data-testid="button-cancel-discount">{t('common.cancel')}</Button>
      </div>
    </Card>
  );
}
