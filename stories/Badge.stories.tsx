import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@/components/ui/Badge';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: [
        'pending',
        'paid',
        'confirmed',
        'success',
        'processing',
        'failed',
        'declined',
        'refunded',
        'expired',
        'cancelled',
        'sandbox',
        'live',
        'open',
        'under_review',
        'resolved',
        'closed',
        'won',
        'lost',
      ],
      description: 'Status type for the badge',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

// Success States
export const Paid: Story = {
  args: {
    status: 'paid',
  },
};

export const Confirmed: Story = {
  args: {
    status: 'confirmed',
  },
};

export const Success: Story = {
  args: {
    status: 'success',
  },
};

export const Resolved: Story = {
  args: {
    status: 'resolved',
  },
};

export const Won: Story = {
  args: {
    status: 'won',
  },
};

// Pending/Processing States
export const Pending: Story = {
  args: {
    status: 'pending',
  },
};

export const Processing: Story = {
  args: {
    status: 'processing',
  },
};

export const UnderReview: Story = {
  args: {
    status: 'under_review',
  },
};

// Error/Failed States
export const Failed: Story = {
  args: {
    status: 'failed',
  },
};

export const Declined: Story = {
  args: {
    status: 'declined',
  },
};

export const Lost: Story = {
  args: {
    status: 'lost',
  },
};

// Terminal States
export const Expired: Story = {
  args: {
    status: 'expired',
  },
};

export const Cancelled: Story = {
  args: {
    status: 'cancelled',
  },
};

export const Closed: Story = {
  args: {
    status: 'closed',
  },
};

export const Refunded: Story = {
  args: {
    status: 'refunded',
  },
};

// Environment States
export const Sandbox: Story = {
  args: {
    status: 'sandbox',
  },
};

export const Live: Story = {
  args: {
    status: 'live',
  },
};

// Dispute States
export const Open: Story = {
  args: {
    status: 'open',
  },
};

// All Success States
export const AllSuccessStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge status="paid" />
      <Badge status="confirmed" />
      <Badge status="success" />
      <Badge status="resolved" />
      <Badge status="won" />
    </div>
  ),
};

// All Pending States
export const AllPendingStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge status="pending" />
      <Badge status="processing" />
      <Badge status="under_review" />
    </div>
  ),
};

// All Error States
export const AllErrorStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge status="failed" />
      <Badge status="declined" />
      <Badge status="lost" />
    </div>
  ),
};

// All Terminal States
export const AllTerminalStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge status="expired" />
      <Badge status="cancelled" />
      <Badge status="closed" />
      <Badge status="refunded" />
    </div>
  ),
};

// All Environment States
export const AllEnvironmentStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge status="sandbox" />
      <Badge status="live" />
    </div>
  ),
};

// All Dispute States
export const AllDisputeStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge status="open" />
      <Badge status="under_review" />
      <Badge status="resolved" />
      <Badge status="won" />
      <Badge status="lost" />
    </div>
  ),
};

// All States Showcase
export const AllStates: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-sm font-semibold text-ink">Success States</h3>
        <div className="flex flex-wrap gap-2">
          <Badge status="paid" />
          <Badge status="confirmed" />
          <Badge status="success" />
          <Badge status="resolved" />
          <Badge status="won" />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-ink">Pending/Processing States</h3>
        <div className="flex flex-wrap gap-2">
          <Badge status="pending" />
          <Badge status="processing" />
          <Badge status="under_review" />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-ink">Error/Failed States</h3>
        <div className="flex flex-wrap gap-2">
          <Badge status="failed" />
          <Badge status="declined" />
          <Badge status="lost" />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-ink">Terminal States</h3>
        <div className="flex flex-wrap gap-2">
          <Badge status="expired" />
          <Badge status="cancelled" />
          <Badge status="closed" />
          <Badge status="refunded" />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-ink">Environment States</h3>
        <div className="flex flex-wrap gap-2">
          <Badge status="sandbox" />
          <Badge status="live" />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-ink">Dispute States</h3>
        <div className="flex flex-wrap gap-2">
          <Badge status="open" />
          <Badge status="under_review" />
          <Badge status="resolved" />
          <Badge status="won" />
          <Badge status="lost" />
        </div>
      </div>
    </div>
  ),
};

// Badge in Context (Table Row)
export const InTableContext: Story = {
  render: () => (
    <table className="w-full text-sm">
      <thead className="bg-slate-50">
        <tr>
          <th className="px-4 py-2 text-left">ID</th>
          <th className="px-4 py-2 text-left">Amount</th>
          <th className="px-4 py-2 text-left">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-t border-slate-200">
          <td className="px-4 py-2">INV-001</td>
          <td className="px-4 py-2">$100.00</td>
          <td className="px-4 py-2">
            <Badge status="paid" />
          </td>
        </tr>
        <tr className="border-t border-slate-200">
          <td className="px-4 py-2">INV-002</td>
          <td className="px-4 py-2">$250.00</td>
          <td className="px-4 py-2">
            <Badge status="pending" />
          </td>
        </tr>
        <tr className="border-t border-slate-200">
          <td className="px-4 py-2">INV-003</td>
          <td className="px-4 py-2">$75.00</td>
          <td className="px-4 py-2">
            <Badge status="failed" />
          </td>
        </tr>
      </tbody>
    </table>
  ),
};

// Unknown Status (Fallback)
export const UnknownStatus: Story = {
  args: {
    status: 'unknown_status',
  },
};
