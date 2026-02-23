import AppRoutes from "./AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster position="top-center" richColors />
    </AuthProvider>
  );
}

export default App;