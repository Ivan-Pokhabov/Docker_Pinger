import { Button } from '@mantine/core';

export function PostButton({ onClick }: { onClick: () => void }) {
  return (
    <Button 
      onClick={onClick} 
      size="md"
      color="blue"
      variant="light"
      fullWidth
    >
      Add Container
    </Button>
  );
}