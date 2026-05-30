import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Copy, ExternalLink, Trash2, Edit2 } from 'lucide-react';

const meta = {
  title: 'UI/Table',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Table
export const Basic: Story = {
  render: () => (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-slate-100">
            <td className="px-4 py-3">1</td>
            <td className="px-4 py-3">John Doe</td>
            <td className="px-4 py-3">john@example.com</td>
            <td className="px-4 py-3">
              <Badge status="active" />
            </td>
          </tr>
          <tr className="border-t border-slate-100">
            <td className="px-4 py-3">2</td>
            <td className="px-4 py-3">Jane Smith</td>
            <td className="px-4 py-3">jane@example.com</td>
            <td className="px-4 py-3">
              <Badge status="active" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};

// Invoice Table
export const InvoiceTable: Story = {
  render: () => (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3">Invoice ID</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Gross</th>
            <th className="px-4 py-3">Fee</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-slate-100">
            <td className="px-4 py-3 font-mono text-xs">INV-2024-001</td>
            <td className="px-4 py-3">$1,000.00</td>
            <td className="px-4 py-3">$1,050.00</td>
            <td className="px-4 py-3">$50.00</td>
            <td className="px-4 py-3">
              <Badge status="paid" />
            </td>
            <td className="px-4 py-3">2024-01-15</td>
            <td className="px-4 py-3">
              <div className="flex gap-2">
                <a href="#" className="text-ocean hover:underline">
                  Open
                </a>
                <Button className="h-8 w-8 bg-white p-0 text-ink ring-1 ring-slate-300" title="Copy">
                  <Copy size={14} />
                </Button>
              </div>
            </td>
          </tr>
          <tr className="border-t border-slate-100">
            <td className="px-4 py-3 font-mono text-xs">INV-2024-002</td>
            <td className="px-4 py-3">$2,500.00</td>
            <td className="px-4 py-3">$2,625.00</td>
            <td className="px-4 py-3">$125.00</td>
            <td className="px-4 py-3">
              <Badge status="pending" />
            </td>
            <td className="px-4 py-3">2024-01-16</td>
            <td className="px-4 py-3">
              <div className="flex gap-2">
                <a href="#" className="text-ocean hover:underline">
                  Open
                </a>
                <Button className="h-8 w-8 bg-white p-0 text-ink ring-1 ring-slate-300" title="Copy">
                  <Copy size={14} />
                </Button>
              </div>
            </td>
          </tr>
          <tr className="border-t border-slate-100">
            <td className="px-4 py-3 font-mono text-xs">INV-2024-003</td>
            <td className="px-4 py-3">$750.00</td>
            <td className="px-4 py-3">$787.50</td>
            <td className="px-4 py-3">$37.50</td>
            <td className="px-4 py-3">
              <Badge status="expired" />
            </td>
            <td className="px-4 py-3">2024-01-14</td>
            <td className="px-4 py-3">
              <div className="flex gap-2">
                <a href="#" className="text-ocean hover:underline">
                  Open
                </a>
                <Button className="h-8 w-8 bg-white p-0 text-ink ring-1 ring-slate-300" title="Copy">
                  <Copy size={14} />
                </Button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};

// Dispute Table
export const DisputeTable: Story = {
  render: () => (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Reason</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Created</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <tr className="hover:bg-slate-50">
              <td className="px-4 py-3">
                <span className="font-mono text-sm text-violet">DISP-001...</span>
              </td>
              <td className="px-4 py-3">
                <span className="font-medium text-ink">$500.00</span>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-slate-700">Fraudulent</span>
              </td>
              <td className="px-4 py-3">
                <Badge status="open" />
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-slate-700">customer@example.com</span>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-slate-600">2 days ago</span>
              </td>
              <td className="px-4 py-3">
                <a href="#" className="inline-flex items-center gap-1 text-sm text-violet hover:underline">
                  View <ExternalLink size={14} />
                </a>
              </td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-4 py-3">
                <span className="font-mono text-sm text-violet">DISP-002...</span>
              </td>
              <td className="px-4 py-3">
                <span className="font-medium text-ink">$250.00</span>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-slate-700">Duplicate Payment</span>
              </td>
              <td className="px-4 py-3">
                <Badge status="under_review" />
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-slate-700">user@example.com</span>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-slate-600">1 day ago</span>
              </td>
              <td className="px-4 py-3">
                <a href="#" className="inline-flex items-center gap-1 text-sm text-violet hover:underline">
                  View <ExternalLink size={14} />
                </a>
              </td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-4 py-3">
                <span className="font-mono text-sm text-violet">DISP-003...</span>
              </td>
              <td className="px-4 py-3">
                <span className="font-medium text-ink">$1,000.00</span>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-slate-700">Product Not Received</span>
              </td>
              <td className="px-4 py-3">
                <Badge status="resolved" />
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-slate-700">buyer@example.com</span>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-slate-600">5 days ago</span>
              </td>
              <td className="px-4 py-3">
                <a href="#" className="inline-flex items-center gap-1 text-sm text-violet hover:underline">
                  View <ExternalLink size={14} />
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  ),
};

// Table with Actions
export const WithActions: Story = {
  render: () => (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-slate-100">
            <td className="px-4 py-3">1</td>
            <td className="px-4 py-3">John Doe</td>
            <td className="px-4 py-3">john@example.com</td>
            <td className="px-4 py-3">
              <Badge status="active" />
            </td>
            <td className="px-4 py-3">
              <div className="flex gap-2">
                <Button variant="secondary" className="h-8 w-8 p-0">
                  <Edit2 size={14} />
                </Button>
                <Button variant="secondary" className="h-8 w-8 p-0">
                  <Trash2 size={14} />
                </Button>
              </div>
            </td>
          </tr>
          <tr className="border-t border-slate-100">
            <td className="px-4 py-3">2</td>
            <td className="px-4 py-3">Jane Smith</td>
            <td className="px-4 py-3">jane@example.com</td>
            <td className="px-4 py-3">
              <Badge status="active" />
            </td>
            <td className="px-4 py-3">
              <div className="flex gap-2">
                <Button variant="secondary" className="h-8 w-8 p-0">
                  <Edit2 size={14} />
                </Button>
                <Button variant="secondary" className="h-8 w-8 p-0">
                  <Trash2 size={14} />
                </Button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};

// Table with Hover State
export const WithHoverState: Story = {
  render: () => (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-slate-100 hover:bg-slate-50">
            <td className="px-4 py-3">1</td>
            <td className="px-4 py-3">Transaction A</td>
            <td className="px-4 py-3">$1,000.00</td>
            <td className="px-4 py-3">
              <Badge status="paid" />
            </td>
          </tr>
          <tr className="border-t border-slate-100 hover:bg-slate-50">
            <td className="px-4 py-3">2</td>
            <td className="px-4 py-3">Transaction B</td>
            <td className="px-4 py-3">$2,500.00</td>
            <td className="px-4 py-3">
              <Badge status="pending" />
            </td>
          </tr>
          <tr className="border-t border-slate-100 hover:bg-slate-50">
            <td className="px-4 py-3">3</td>
            <td className="px-4 py-3">Transaction C</td>
            <td className="px-4 py-3">$750.00</td>
            <td className="px-4 py-3">
              <Badge status="failed" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};

// Empty Table
export const Empty: Story = {
  render: () => (
    <div className="rounded-md border border-slate-200 bg-white p-12 text-center">
      <p className="text-slate-500">No data available</p>
    </div>
  ),
};

// Table with Striped Rows
export const StripedRows: Story = {
  render: () => (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-slate-100 bg-white">
            <td className="px-4 py-3">1</td>
            <td className="px-4 py-3">Item A</td>
            <td className="px-4 py-3">$1,000.00</td>
            <td className="px-4 py-3">
              <Badge status="paid" />
            </td>
          </tr>
          <tr className="border-t border-slate-100 bg-slate-50">
            <td className="px-4 py-3">2</td>
            <td className="px-4 py-3">Item B</td>
            <td className="px-4 py-3">$2,500.00</td>
            <td className="px-4 py-3">
              <Badge status="pending" />
            </td>
          </tr>
          <tr className="border-t border-slate-100 bg-white">
            <td className="px-4 py-3">3</td>
            <td className="px-4 py-3">Item C</td>
            <td className="px-4 py-3">$750.00</td>
            <td className="px-4 py-3">
              <Badge status="failed" />
            </td>
          </tr>
          <tr className="border-t border-slate-100 bg-slate-50">
            <td className="px-4 py-3">4</td>
            <td className="px-4 py-3">Item D</td>
            <td className="px-4 py-3">$500.00</td>
            <td className="px-4 py-3">
              <Badge status="processing" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};

// Compact Table
export const Compact: Story = {
  render: () => (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-2 py-2">ID</th>
            <th className="px-2 py-2">Name</th>
            <th className="px-2 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-slate-100">
            <td className="px-2 py-2">1</td>
            <td className="px-2 py-2">Item A</td>
            <td className="px-2 py-2">
              <Badge status="paid" />
            </td>
          </tr>
          <tr className="border-t border-slate-100">
            <td className="px-2 py-2">2</td>
            <td className="px-2 py-2">Item B</td>
            <td className="px-2 py-2">
              <Badge status="pending" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};

// Responsive Table (Horizontal Scroll)
export const Responsive: Story = {
  render: () => (
    <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3 whitespace-nowrap">ID</th>
            <th className="px-4 py-3 whitespace-nowrap">Name</th>
            <th className="px-4 py-3 whitespace-nowrap">Email</th>
            <th className="px-4 py-3 whitespace-nowrap">Phone</th>
            <th className="px-4 py-3 whitespace-nowrap">Address</th>
            <th className="px-4 py-3 whitespace-nowrap">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-slate-100">
            <td className="px-4 py-3 whitespace-nowrap">1</td>
            <td className="px-4 py-3 whitespace-nowrap">John Doe</td>
            <td className="px-4 py-3 whitespace-nowrap">john@example.com</td>
            <td className="px-4 py-3 whitespace-nowrap">+1 (555) 000-0000</td>
            <td className="px-4 py-3 whitespace-nowrap">123 Main St, City, State</td>
            <td className="px-4 py-3 whitespace-nowrap">
              <Badge status="active" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};

// Table with Multiple Badge States
export const MultipleBadgeStates: Story = {
  render: () => (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-slate-100">
            <td className="px-4 py-3">1</td>
            <td className="px-4 py-3">Payment</td>
            <td className="px-4 py-3">
              <Badge status="paid" />
            </td>
          </tr>
          <tr className="border-t border-slate-100">
            <td className="px-4 py-3">2</td>
            <td className="px-4 py-3">Invoice</td>
            <td className="px-4 py-3">
              <Badge status="pending" />
            </td>
          </tr>
          <tr className="border-t border-slate-100">
            <td className="px-4 py-3">3</td>
            <td className="px-4 py-3">Dispute</td>
            <td className="px-4 py-3">
              <Badge status="open" />
            </td>
          </tr>
          <tr className="border-t border-slate-100">
            <td className="px-4 py-3">4</td>
            <td className="px-4 py-3">Refund</td>
            <td className="px-4 py-3">
              <Badge status="refunded" />
            </td>
          </tr>
          <tr className="border-t border-slate-100">
            <td className="px-4 py-3">5</td>
            <td className="px-4 py-3">Failed</td>
            <td className="px-4 py-3">
              <Badge status="failed" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};
