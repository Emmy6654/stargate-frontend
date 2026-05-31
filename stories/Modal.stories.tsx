import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

const meta = {
  title: 'UI/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controls modal visibility',
    },
    title: {
      control: 'text',
      description: 'Modal title',
    },
    description: {
      control: 'text',
      description: 'Modal description',
    },
  },
  args: {
    onClose: fn(),
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Modal
export const Basic: Story = {
  args: {
    open: true,
    title: 'Modal Title',
    description: 'This is a modal description',
    children: <p>Modal content goes here</p>,
  },
};

// Modal with Title Only
export const TitleOnly: Story = {
  args: {
    open: true,
    title: 'Confirm Action',
    children: <p>Are you sure you want to proceed?</p>,
  },
};

// Modal with Description Only
export const DescriptionOnly: Story = {
  args: {
    open: true,
    description: 'This is a modal description without a title',
    children: <p>Modal content goes here</p>,
  },
};

// Modal with No Title or Description
export const ContentOnly: Story = {
  args: {
    open: true,
    children: <p>Just the content, no title or description</p>,
  },
};

// Modal with Form Content
export const WithForm: Story = {
  args: {
    open: true,
    title: 'Create Invoice',
    description: 'Fill in the details to create a new invoice',
    children: (
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink">Amount (USDC)</label>
          <input
            type="number"
            className="mt-1 h-10 w-full rounded-md border border-slate-300 px-3 text-sm"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Description</label>
          <textarea
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="Invoice description"
            rows={3}
          />
        </div>
        <div className="flex gap-2 pt-4">
          <Button variant="primary" className="flex-1">
            Create
          </Button>
          <Button variant="secondary" className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    ),
  },
};

// Modal with Long Content
export const LongContent: Story = {
  args: {
    open: true,
    title: 'Terms and Conditions',
    children: (
      <div className="space-y-4 text-sm text-slate-700">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
        </p>
        <p>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </p>
        <p>
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <p>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem
          aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
        </p>
      </div>
    ),
  },
};

// Modal with Action Buttons
export const WithActions: Story = {
  args: {
    open: true,
    title: 'Delete Invoice',
    description: 'This action cannot be undone',
    children: (
      <div className="space-y-4">
        <p className="text-sm text-slate-700">Are you sure you want to delete this invoice? This action is permanent.</p>
        <div className="flex gap-2 pt-4">
          <Button variant="secondary" className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" className="flex-1" style={{ backgroundColor: '#e17055' }}>
            Delete
          </Button>
        </div>
      </div>
    ),
  },
};

// Modal Closed State
export const Closed: Story = {
  args: {
    open: false,
    title: 'This Modal is Closed',
    children: <p>You should not see this content</p>,
  },
};

// Interactive Modal with State
export const Interactive: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="space-y-4">
        <Button variant="primary" onClick={() => setIsOpen(true)}>
          Open Modal
        </Button>
        <Modal {...args} open={isOpen} onClose={() => setIsOpen(false)}>
          <div className="space-y-4">
            <p className="text-sm text-slate-700">This is an interactive modal. Click the close button or press Escape to close.</p>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setIsOpen(false)} className="flex-1">
                Close
              </Button>
              <Button variant="primary" onClick={() => setIsOpen(false)} className="flex-1">
                Confirm
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  },
  args: {
    title: 'Interactive Modal',
    description: 'Try interacting with this modal',
  },
};

// Modal with Different Content Types
export const WithList: Story = {
  args: {
    open: true,
    title: 'Select Payment Method',
    children: (
      <div className="space-y-2">
        {['Credit Card', 'Bank Transfer', 'Wallet', 'Crypto'].map((method) => (
          <button
            key={method}
            className="w-full rounded-md border border-slate-300 px-4 py-2 text-left text-sm hover:bg-slate-50"
          >
            {method}
          </button>
        ))}
      </div>
    ),
  },
};

// Modal with Success State
export const SuccessState: Story = {
  args: {
    open: true,
    title: 'Success!',
    children: (
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
            <span className="text-xl text-emerald-600">✓</span>
          </div>
        </div>
        <p className="text-sm text-slate-700">Your invoice has been created successfully.</p>
        <Button variant="primary" className="w-full">
          Done
        </Button>
      </div>
    ),
  },
};

// Modal with Error State
export const ErrorState: Story = {
  args: {
    open: true,
    title: 'Error',
    children: (
      <div className="space-y-4">
        <div className="flex gap-3 rounded-md bg-coral/10 p-3">
          <span className="text-xl text-coral">⚠</span>
          <p className="text-sm text-coral">Something went wrong. Please try again.</p>
        </div>
        <Button variant="primary" className="w-full">
          Retry
        </Button>
      </div>
    ),
  },
};

// All Modal States Showcase
export const AllStates: Story = {
  render: () => {
    const [openBasic, setOpenBasic] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button variant="primary" onClick={() => setOpenBasic(true)}>
            Basic Modal
          </Button>
          <Button variant="primary" onClick={() => setOpenForm(true)}>
            Form Modal
          </Button>
          <Button variant="primary" onClick={() => setOpenSuccess(true)}>
            Success Modal
          </Button>
        </div>

        <Modal open={openBasic} onClose={() => setOpenBasic(false)} title="Basic Modal">
          <p className="text-sm text-slate-700">This is a basic modal with simple content.</p>
        </Modal>

        <Modal open={openForm} onClose={() => setOpenForm(false)} title="Form Modal" description="Fill in the form">
          <form className="space-y-3">
            <input type="text" placeholder="Name" className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm" />
            <input type="email" placeholder="Email" className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm" />
            <Button variant="primary" className="w-full">
              Submit
            </Button>
          </form>
        </Modal>

        <Modal open={openSuccess} onClose={() => setOpenSuccess(false)} title="Success!">
          <div className="text-center">
            <p className="text-sm text-slate-700">Operation completed successfully!</p>
          </div>
        </Modal>
      </div>
    );
  },
};
