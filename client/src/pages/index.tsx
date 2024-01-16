import { AppShell } from "@mantine/core";
import ActivityRegister from "./ActivityRegister";

export default function App() {
  return (
    <AppShell padding={{ base: 10, md: "xl" }}>
      <AppShell.Main>
        <ActivityRegister />
      </AppShell.Main>
    </AppShell>
  );
}
