"use client";

import dynamic from "next/dynamic";

/* The chat widget is rendered in the browser only: it depends on what this
   visitor has saved (their conversation, whether they've seen the help
   bubble), and its code loads after the page, never ahead of it. */
const ChatWidget = dynamic(() => import("./ChatWidget"), { ssr: false });

export default function ChatLauncher() {
  return <ChatWidget />;
}
