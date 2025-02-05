import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { TableScrollArea } from "./components/TableScrollArea";
import { InputValidation } from "./components/InputValidation";
import { PostButton } from "./components/PostButton";
import { Header } from "./components/Header";

export default function App() {
  return <MantineProvider theme={theme}>
    <Header></Header>
    <TableScrollArea></TableScrollArea>
      <InputValidation></InputValidation>
      <PostButton></PostButton>
    </MantineProvider>;
}