import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'date', 'time', 'search'],
      description: 'Input type',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the input',
    },
    readOnly: {
      control: 'boolean',
      description: 'Make input read-only',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Input
export const Default: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter text...',
  },
};

// Text Input
export const TextInput: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter your name',
  },
};

// Email Input
export const EmailInput: Story = {
  args: {
    type: 'email',
    placeholder: 'Enter your email',
  },
};

// Password Input
export const PasswordInput: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter your password',
  },
};

// Number Input
export const NumberInput: Story = {
  args: {
    type: 'number',
    placeholder: '0.00',
  },
};

// Tel Input
export const TelInput: Story = {
  args: {
    type: 'tel',
    placeholder: '+1 (555) 000-0000',
  },
};

// URL Input
export const URLInput: Story = {
  args: {
    type: 'url',
    placeholder: 'https://example.com',
  },
};

// Date Input
export const DateInput: Story = {
  args: {
    type: 'date',
  },
};

// Time Input
export const TimeInput: Story = {
  args: {
    type: 'time',
  },
};

// Search Input
export const SearchInput: Story = {
  args: {
    type: 'search',
    placeholder: 'Search...',
  },
};

// Disabled Input
export const Disabled: Story = {
  args: {
    type: 'text',
    placeholder: 'Disabled input',
    disabled: true,
    value: 'Cannot edit',
  },
};

// Read-only Input
export const ReadOnly: Story = {
  args: {
    type: 'text',
    value: 'Read-only value',
    readOnly: true,
  },
};

// Input with Value
export const WithValue: Story = {
  args: {
    type: 'text',
    value: 'Pre-filled value',
  },
};

// Large Input
export const Large: Story = {
  args: {
    type: 'text',
    placeholder: 'Large input',
    className: 'h-12 px-4 text-base',
  },
};

// Small Input
export const Small: Story = {
  args: {
    type: 'text',
    placeholder: 'Small input',
    className: 'h-8 px-2 text-xs',
  },
};

// Full Width Input
export const FullWidth: Story = {
  args: {
    type: 'text',
    placeholder: 'Full width input',
    className: 'w-full',
  },
};

// Input with Error State (using className)
export const ErrorState: Story = {
  args: {
    type: 'text',
    placeholder: 'Error input',
    className: 'border-coral focus:border-coral focus:ring-coral/15',
    value: 'Invalid input',
  },
};

// Input with Success State (using className)
export const SuccessState: Story = {
  args: {
    type: 'text',
    placeholder: 'Success input',
    className: 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/15',
    value: 'Valid input',
  },
};

// Interactive Input with State
export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = useState('');

    return (
      <div className="space-y-2">
        <Input {...args} value={value} onChange={(e) => setValue(e.target.value)} />
        <p className="text-xs text-slate-500">Current value: {value || '(empty)'}</p>
      </div>
    );
  },
  args: {
    type: 'text',
    placeholder: 'Type something...',
  },
};

// Form with Multiple Inputs
export const FormExample: Story = {
  render: () => (
    <form className="w-full max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-ink">Name</label>
        <Input type="text" placeholder="John Doe" className="mt-1 w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink">Email</label>
        <Input type="email" placeholder="john@example.com" className="mt-1 w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink">Amount (USDC)</label>
        <Input type="number" placeholder="0.00" className="mt-1 w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink">Description</label>
        <textarea placeholder="Enter description" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
      </div>
      <button className="w-full rounded-md bg-violet px-4 py-2 text-sm font-medium text-white hover:bg-ocean">
        Submit
      </button>
    </form>
  ),
};

// All Input Types
export const AllTypes: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-600">Text</label>
        <Input type="text" placeholder="Text input" className="mt-1 w-full" />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600">Email</label>
        <Input type="email" placeholder="Email input" className="mt-1 w-full" />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600">Password</label>
        <Input type="password" placeholder="Password input" className="mt-1 w-full" />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600">Number</label>
        <Input type="number" placeholder="Number input" className="mt-1 w-full" />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600">Tel</label>
        <Input type="tel" placeholder="Tel input" className="mt-1 w-full" />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600">URL</label>
        <Input type="url" placeholder="URL input" className="mt-1 w-full" />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600">Date</label>
        <Input type="date" className="mt-1 w-full" />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600">Time</label>
        <Input type="time" className="mt-1 w-full" />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600">Search</label>
        <Input type="search" placeholder="Search input" className="mt-1 w-full" />
      </div>
    </div>
  ),
};

// All States
export const AllStates: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-600">Default</label>
        <Input type="text" placeholder="Default state" className="mt-1 w-full" />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600">Focused</label>
        <Input type="text" placeholder="Focused state" className="mt-1 w-full" autoFocus />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600">Disabled</label>
        <Input type="text" placeholder="Disabled state" className="mt-1 w-full" disabled />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600">Read-only</label>
        <Input type="text" value="Read-only state" className="mt-1 w-full" readOnly />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600">With Value</label>
        <Input type="text" value="Pre-filled value" className="mt-1 w-full" />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600">Error</label>
        <Input
          type="text"
          placeholder="Error state"
          className="mt-1 w-full border-coral focus:border-coral focus:ring-coral/15"
          value="Invalid"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600">Success</label>
        <Input
          type="text"
          placeholder="Success state"
          className="mt-1 w-full border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/15"
          value="Valid"
        />
      </div>
    </div>
  ),
};

// Input Sizes
export const Sizes: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-600">Small</label>
        <Input type="text" placeholder="Small input" className="mt-1 h-8 px-2 text-xs" />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600">Medium (Default)</label>
        <Input type="text" placeholder="Medium input" className="mt-1" />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600">Large</label>
        <Input type="text" placeholder="Large input" className="mt-1 h-12 px-4 text-base" />
      </div>
    </div>
  ),
};
