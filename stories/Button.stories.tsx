import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from '@/components/ui/Button';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
      description: 'Button style variant',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the button',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  args: {
    onClick: fn(),
    children: 'Button',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Primary Variant Stories
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const PrimaryHover: Story = {
  args: {
    variant: 'primary',
    children: 'Hover State',
  },
  parameters: {
    pseudo: { hover: true },
  },
};

export const PrimaryDisabled: Story = {
  args: {
    variant: 'primary',
    children: 'Disabled Button',
    disabled: true,
  },
};

// Secondary Variant Stories
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const SecondaryHover: Story = {
  args: {
    variant: 'secondary',
    children: 'Hover State',
  },
  parameters: {
    pseudo: { hover: true },
  },
};

export const SecondaryDisabled: Story = {
  args: {
    variant: 'secondary',
    children: 'Disabled Button',
    disabled: true,
  },
};

// Size Variants (using className)
export const Small: Story = {
  args: {
    variant: 'primary',
    children: 'Small Button',
    className: 'h-8 px-3 text-xs',
  },
};

export const Large: Story = {
  args: {
    variant: 'primary',
    children: 'Large Button',
    className: 'h-12 px-6 text-base',
  },
};

// Icon Button
export const IconButton: Story = {
  args: {
    variant: 'primary',
    className: 'h-10 w-10 p-0',
    children: '✕',
  },
};

// Full Width
export const FullWidth: Story = {
  args: {
    variant: 'primary',
    children: 'Full Width Button',
    className: 'w-full',
  },
};

// With Loading State (simulated with disabled)
export const Loading: Story = {
  args: {
    variant: 'primary',
    children: 'Loading...',
    disabled: true,
  },
};

// Multiple Buttons Group
export const ButtonGroup: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button variant="primary">Save</Button>
      <Button variant="secondary">Cancel</Button>
      <Button variant="secondary" disabled>
        Delete
      </Button>
    </div>
  ),
};

// All States Showcase
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="mb-2 text-sm font-semibold">Primary</h3>
        <div className="flex gap-2">
          <Button variant="primary">Default</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold">Secondary</h3>
        <div className="flex gap-2">
          <Button variant="secondary">Default</Button>
          <Button variant="secondary" disabled>
            Disabled
          </Button>
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold">Sizes</h3>
        <div className="flex gap-2">
          <Button variant="primary" className="h-8 px-3 text-xs">
            Small
          </Button>
          <Button variant="primary">Medium</Button>
          <Button variant="primary" className="h-12 px-6 text-base">
            Large
          </Button>
        </div>
      </div>
    </div>
  ),
};
