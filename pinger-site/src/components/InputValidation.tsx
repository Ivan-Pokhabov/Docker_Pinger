import { useState } from 'react';
import { IconAlertTriangle } from '@tabler/icons-react';
import { TextInput } from '@mantine/core';
import classes from './InputValidation.module.css';

function validateIP(ip: string): boolean {
  const ipRegex = /^(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)$/;
  return ipRegex.test(ip);
}

export function InputValidation() {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setValue(inputValue);
    setError(validateIP(inputValue) ? null : 'Invalid IP address');
  };

  return (
    <TextInput
      label="Enter IP address"
      value={value}
      onChange={handleChange}
      error={error}
      classNames={{ input: error ? classes.invalid : undefined }}
      rightSection={error ? <IconAlertTriangle stroke={1.5} size={18} className={classes.icon} /> : null}
      placeholder="Example: 192.168.1.1"
    />
  );
}
