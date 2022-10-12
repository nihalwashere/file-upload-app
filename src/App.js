import { SnackbarProvider } from "notistack";
import RoutesContainer from "./routes";

export default function App() {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      hideIconVariant
      preventDuplicate
    >
      <RoutesContainer />
    </SnackbarProvider>
  );
}
