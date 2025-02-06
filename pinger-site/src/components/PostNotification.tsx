import { IconX, IconCheck } from '@tabler/icons-react';
import { Notification } from '@mantine/core';

interface PostNotificationProps {
  message: string | null;
  type: 'success' | 'error';
  onClose: () => void;
}

export function PostNotification({ message, type, onClose }: PostNotificationProps) {
  if (!message) return null;

  const icon = type === 'success' ? <IconCheck size={20} /> : <IconX size={20} />;
  const color = type === 'success' ? 'teal' : 'red';
  const title = type === 'success' ? 'All good!"' : 'Bummer!';

  return (
    <Notification icon={icon} color={color} title={title} mt="md" onClose={onClose}>
      {message}
    </Notification>
  );
}
