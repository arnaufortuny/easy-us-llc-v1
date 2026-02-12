import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectItem } from "@/components/ui/native-select";
import { X, Loader2 } from "@/components/icons";
import { PRICING, getFormationPriceFormatted, getMaintenancePriceFormatted } from "@shared/config/pricing";

interface CreateOrderFormProps {
  newOrderData: { userId: string; productId: string; amount: string; state: string; orderType: 'llc' | 'maintenance' | 'custom'; concept: string };
  setNewOrderData: (fn: (prev: any) => any) => void;
  adminUsers: any[];
  createOrderMutation: { mutate: (data: any) => void; isPending: boolean };
  onClose: () => void;
}

export function CreateOrderForm({ newOrderData, setNewOrderData, adminUsers, createOrderMutation, onClose }: CreateOrderFormProps) {
  const { t } = useTranslation();

  return (
    <Card className="mb-4 p-4 md:p-6 rounded-2xl border border-accent/30 bg-white dark:bg-card shadow-lg animate-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-black text-foreground tracking-tight">{t('dashboard.admin.createOrder')}</h3>
          <p className="text-sm text-muted-foreground">{t('dashboard.admin.configureOrder')}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full" data-testid="button-close-create-order">
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-semibold text-foreground mb-2 block">{t('dashboard.admin.orderType')}</Label>
          <NativeSelect 
            value={newOrderData.orderType} 
            onValueChange={val => {
              const type = val as 'llc' | 'maintenance' | 'custom';
              if (type === 'custom') {
                setNewOrderData(p => ({ ...p, orderType: type, amount: '', concept: '' }));
              } else {
                const stateKey = newOrderData.state === 'Wyoming' ? 'wyoming' : newOrderData.state === 'Delaware' ? 'delaware' : 'newMexico';
                const defaultAmount = type === 'maintenance' 
                  ? String(PRICING.maintenance[stateKey as keyof typeof PRICING.maintenance].price)
                  : String(PRICING.formation[stateKey as keyof typeof PRICING.formation].price);
                setNewOrderData(p => ({ ...p, orderType: type, amount: defaultAmount, concept: '' }));
              }
            }}
            placeholder={t('dashboard.admin.selectOrderType')}
            className="w-full rounded-full h-11 px-4 border border-border dark:border-border bg-white dark:bg-card"
            data-testid="select-order-type"
          >
            <NativeSelectItem value="llc">{t('dashboard.admin.llcCreation')}</NativeSelectItem>
            <NativeSelectItem value="maintenance">{t('dashboard.admin.maintenanceService')}</NativeSelectItem>
            <NativeSelectItem value="custom">{t('dashboard.admin.customOrder')}</NativeSelectItem>
          </NativeSelect>
        </div>
        <div>
          <Label className="text-sm font-semibold text-foreground mb-2 block">{t('dashboard.admin.client')}</Label>
          <NativeSelect 
            value={newOrderData.userId} 
            onValueChange={val => setNewOrderData(p => ({ ...p, userId: val }))}
            placeholder={t('dashboard.admin.selectClient')}
            className="w-full rounded-full h-11 px-4 border border-border dark:border-border bg-white dark:bg-card"
            data-testid="select-order-user"
          >
            {adminUsers?.map((u: any) => (
              <NativeSelectItem key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.email})</NativeSelectItem>
            ))}
          </NativeSelect>
        </div>
        {newOrderData.orderType === 'custom' ? (
          <div>
            <Label className="text-sm font-semibold text-foreground mb-2 block">{t('dashboard.admin.concept')}</Label>
            <Input value={newOrderData.concept} 
              onChange={e => setNewOrderData(p => ({ ...p, concept: e.target.value }))} 
              placeholder={t('dashboard.admin.conceptPlaceholder')} 
              className="rounded-full h-11 px-4 border border-border dark:border-border bg-white dark:bg-card" 
              data-testid="input-order-concept" 
            />
          </div>
        ) : (
          <div>
            <Label className="text-sm font-semibold text-foreground mb-2 block">{t('dashboard.admin.state')}</Label>
            <NativeSelect 
              value={newOrderData.state} 
              onValueChange={val => {
                const sk = val === 'Wyoming' ? 'wyoming' : val === 'Delaware' ? 'delaware' : 'newMexico';
                const priceConfig = newOrderData.orderType === 'maintenance' ? PRICING.maintenance : PRICING.formation;
                const amount = String(priceConfig[sk as keyof typeof priceConfig].price);
                setNewOrderData(p => ({ ...p, state: val, amount }));
              }}
              placeholder={t('dashboard.admin.selectState')}
              className="w-full rounded-full h-11 px-4 border border-border dark:border-border bg-white dark:bg-card"
              data-testid="select-order-state"
            >
              {newOrderData.orderType === 'maintenance' ? (
                <>
                  <NativeSelectItem value="New Mexico">{t('application.states.newMexico')} - {getMaintenancePriceFormatted("newMexico")}</NativeSelectItem>
                  <NativeSelectItem value="Wyoming">{t('application.states.wyoming')} - {getMaintenancePriceFormatted("wyoming")}</NativeSelectItem>
                  <NativeSelectItem value="Delaware">{t('application.states.delaware')} - {getMaintenancePriceFormatted("delaware")}</NativeSelectItem>
                </>
              ) : (
                <>
                  <NativeSelectItem value="New Mexico">{t('application.states.newMexico')} - {getFormationPriceFormatted("newMexico")}</NativeSelectItem>
                  <NativeSelectItem value="Wyoming">{t('application.states.wyoming')} - {getFormationPriceFormatted("wyoming")}</NativeSelectItem>
                  <NativeSelectItem value="Delaware">{t('application.states.delaware')} - {getFormationPriceFormatted("delaware")}</NativeSelectItem>
                </>
              )}
            </NativeSelect>
          </div>
        )}
        <div>
          <Label className="text-sm font-semibold text-foreground mb-2 block">{t('dashboard.admin.amount')} (€)</Label>
          <Input type="number" value={newOrderData.amount} onChange={e => setNewOrderData(p => ({ ...p, amount: e.target.value }))} placeholder="899" className="rounded-full h-11 px-4 border border-border dark:border-border bg-white dark:bg-card" data-testid="input-order-amount" />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t">
        <Button onClick={() => createOrderMutation.mutate(newOrderData)} disabled={createOrderMutation.isPending || !newOrderData.userId || !newOrderData.amount || (newOrderData.orderType === 'custom' && !newOrderData.concept)} className="flex-1 bg-accent text-accent-foreground font-black rounded-full" data-testid="button-confirm-create-order">
          {createOrderMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t('dashboard.admin.createOrderBtn')}
        </Button>
        <Button variant="outline" onClick={onClose} className="flex-1 rounded-full" data-testid="button-cancel-create-order">{t('common.cancel')}</Button>
      </div>
    </Card>
  );
}
