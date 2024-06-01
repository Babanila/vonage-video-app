import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { Button as ButtonMUI } from '../components/Button';

const meta = {
  title: 'Components/ButtonMUI',
  component: ButtonMUI,
  args: {
    // onClick: fn(),
  },
} satisfies Meta<typeof ButtonMUI>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: 'Sample Submit Button',
  },
};

export const Secondary: Story = {
  args: {
    label: 'Secondary Button',
  },
};
