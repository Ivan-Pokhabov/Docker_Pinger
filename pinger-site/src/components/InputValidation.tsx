import { useState } from 'react';
import { IconAlertTriangle } from '@tabler/icons-react';
import { TextInput, Paper, Title } from '@mantine/core';
import { PostButton } from './PostButton';
import { PostRequest } from '../requests/PostReqest';
import classes from './InputValidation.module.css';
import { PostNotification } from './PostNotification';

function validateIP(ip: string): boolean {
  const ipRegex = /^(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)$/;
  return ipRegex.test(ip);
}

export function InputValidation() {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string | null; type: 'success' | 'error' } | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setValue(inputValue);
    setError(validateIP(inputValue) ? null : 'Invalid IP address');
  };

  const handleSendRequest = async () => {
    if (!value.trim() || error) {
      setNotification({ message: 'Введите корректный IP перед отправкой', type: 'error' });
      return;
    }

    try {
      await PostRequest(value);
      setNotification({ message: 'IP-адрес успешно добавлен', type: 'success' });
    } catch {
      setNotification({ message: 'Ошибка при добавлении IP-адреса', type: 'error' });
    }
  };

  return (
    <Paper shadow="sm" p="md" radius="md">
      <Title order={2} mb="md">Add New Container</Title>

      <TextInput
        label="IP Address"
        value={value}
        onChange={handleChange}
        error={error}
        classNames={{ input: error ? classes.invalid : undefined }}
        rightSection={error ? <IconAlertTriangle stroke={1.5} size={18} className={classes.icon} /> : null}
        placeholder="Example: 192.168.1.1"
        mb="md"
      />

      <PostButton onClick={handleSendRequest} />

      {notification && <PostNotification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
    </Paper>
  );
}