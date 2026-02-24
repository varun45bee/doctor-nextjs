"use client";

import { useEffect } from "react";

export default function ChatbaseWidget() {
  useEffect(() => {
    // @ts-ignore
    window.chatbaseConfig = {
      chatbotId: "pAK0ENtPfB3FGFKVrlSJv",
    };

    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}













 