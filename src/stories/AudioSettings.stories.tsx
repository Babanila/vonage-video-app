import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect, fn } from '@storybook/test';

import { AudioSettings } from '../components/AudioSettings';

const meta: Meta = {
  title: 'Components/AudioSettings',
  component: AudioSettings,
  argTypes: {
    hasAudio: {
      control: { type: 'boolean' },
      defaultValue: true,
    },
    onAudioChange: fn(),
  },
} satisfies Meta<typeof AudioSettings>;

export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    hasAudio: true,
  },
};

export const AudioSettingsPlay: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('checkbox'));
  },
};
