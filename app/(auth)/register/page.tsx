'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { useSession } from '@/lib/session';

const schema = z.object({ name: z.string().min(1), email: z.string().email(), password: z.string().min(12) });
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const session = useSession();
  const form = useForm<FormData>({ resolver: zodResolver(schema) });
  async function onSubmit(data: FormData) {
    const result = await api.auth.register(data);
    session.login(result.access_token, result.merchant);
    router.push('/dashboard');
  }
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center gap-6 p-6">
      <h1 className="text-2xl font-semibold text-ink">Create Stargate account</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <Input placeholder="Business name" {...form.register('name')} />
        <Input placeholder="Email" type="email" {...form.register('email')} />
        <Input placeholder="Password" type="password" {...form.register('password')} />
        <Button className="w-full" type="submit">Register</Button>
      </form>
    </main>
  );
}
