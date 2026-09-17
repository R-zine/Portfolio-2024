import { createRoot } from "react-dom/client";
import { Home } from "./Home";

export function mountHome(element: HTMLElement): () => void {
  const root = createRoot(element);
  root.render(<Home />);
  return () => root.unmount();
}
