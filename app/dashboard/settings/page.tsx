'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';

export default function SettingsPage() {
  async function save(formData: FormData) {
    await api.merchants.update({
      name: formData.get('name'),
      stellar_address: formData.get('stellar_address'),
      settlement_cadence: formData.get('settlement_cadence'),
    });
  }
  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold text-ink">Settings</h1>
      <form action={save} className="space-y-3">
        <Input name="name" placeholder="Merchant name" />
        <Input name="stellar_address" placeholder="G... settlement address" />
        <select name="settlement_cadence" className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm">
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
        <Button>Save settings</Button>
      </form>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-ink">API key</h2>
        <Button>Generate API key</Button>
      </section>
    </div>
  );
}
