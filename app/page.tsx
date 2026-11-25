"use client";

import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    let active = true;

    const blockContextMenu = (event: MouseEvent) => event.preventDefault();
    const blockDevShortcuts = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const blocked =
        event.key === "F12" ||
        (event.ctrlKey && event.shiftKey && ["i", "j", "c"].includes(key)) ||
        (event.ctrlKey && ["u"].includes(key));

      if (blocked) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    const blockDrag = (event: DragEvent) => event.preventDefault();

    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("keydown", blockDevShortcuts, true);
    document.addEventListener("dragstart", blockDrag);

    import("./legacy").then(({ mountLegacyApp }) => {
      if (active) mountLegacyApp();
    });

    return () => {
      active = false;
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("keydown", blockDevShortcuts, true);
      document.removeEventListener("dragstart", blockDrag);
    };
  }, []);

  return <div id="app" />;
}
