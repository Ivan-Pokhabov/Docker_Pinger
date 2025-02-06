import { useState } from 'react';
import { IconAlertTriangle } from '@tabler/icons-react';
import { TextInput, Paper, Title } from '@mantine/core';
import { PostButton } from './PostButton';
import { PostRequest } from '../requests/PostReqest';
import classes from './InputValidation.module.css';

function validateIP(ip: string): boolean {
  const ipRegex = /^(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)$/;
  return ipRegex.test(ip);
}

export function InputValidation() {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setValue(inputValue);
    setError(validateIP(inputValue) ? null : 'Invalid IP address');
  };

  const handleSendRequest = async () => {
    if (!value.trim() || error) {
      alert('Введите корректный IP перед отправкой');
      return;
    }

    try {
      const data = await PostRequest(value);
      setResponse(`Ответ: ${JSON.stringify(data)}`);
    } catch (error) {
      setResponse(`${(error as Error).message}`);
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

      <PostButton onClick={handleSendRequest}/>

      {response && (
        <Paper withBorder p="sm" mt="md" radius="sm" bg="gray.0">
          <pre style={{ margin: 0 }}>{response}</pre>
        </Paper>
      )}
    </Paper>
  );
}