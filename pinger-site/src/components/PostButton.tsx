import { Button } from '@mantine/core';

export function PostButton({ onClick }: { onClick: () => void }) {
  return <Button onClick={onClick} mt="md" variant="filled">Enter</Button>;
}