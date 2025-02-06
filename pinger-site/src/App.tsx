import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { TableScrollArea } from "./components/TableScrollArea";
import { InputValidation } from "./components/InputValidation";
import { Header } from "./components/Header";
import { Container } from '@mantine/core';

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Header />
      <Container size="md" py="xl">
        <TableScrollArea />
        <InputValidation mt="xl" />
      </Container>
    </MantineProvider>
  );
}