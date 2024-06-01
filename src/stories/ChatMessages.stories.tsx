import type { Meta, StoryObj } from '@storybook/react';
import { ChatMessages } from "../components/Chat"


const meta = {
  title: 'Components/ChatMessages',
  component: ChatMessages,
} satisfies Meta<typeof ChatMessages>;

export default meta;

type Story = StoryObj<typeof meta>;
export const FirstStory: Story = {
  args: {
    chatMessages: [],
    chatClass: '',
  },
  decorators: [
    (Story) => {
      return <Story />;
    },
  ],
};
