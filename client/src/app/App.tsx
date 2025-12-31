import { useEffect } from "react";
import { Providers } from "./providers";
import { useAuthStore } from "../store/auth.store";

export default function App() {
  const hydrate = useAuthStore(s => s.hydrate);

  useEffect(() => {
    hydrate();
  }, []);

  return <Providers />;
}
