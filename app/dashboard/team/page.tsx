'use client';

import { MailPlus, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

const initialMembers = [
  { name: 'Operations Lead', email: 'ops@merchant.example', role: 'admin', status: 'live' },
  { name: 'Developer', email: 'dev@merchant.example', role: 'developer', status: 'sandbox' },
];

export default function TeamPage() {
  const [members, setMembers] = useState(initialMembers);
  const [email, setEmail] = useState('');
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Team</h1>
        <p className="text-sm text-slate-500">Invite teammates and assign access for operations, developers, and finance.</p>
      </div>
      <Card>
        <form
          className="flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (!email) return;
            setMembers((items) => [...items, { name: 'Pending invite', email, role: 'viewer', status: 'pending' }]);
            setEmail('');
          }}
        >
          <Input className="max-w-md" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="teammate@company.com" />
          <Button><MailPlus size={16} /> Invite</Button>
        </form>
      </Card>
      <Card className="divide-y divide-slate-100 p-0">
        {members.map((member) => (
          <div key={member.email} className="flex items-center justify-between p-4">
            <div>
              <div className="font-medium text-ink">{member.name}</div>
              <div className="text-sm text-slate-500">{member.email}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-sm text-slate-600"><ShieldCheck size={15} /> {member.role}</div>
              <Badge status={member.status} />
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
