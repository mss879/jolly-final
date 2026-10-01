import { CONTACT } from "@/lib/data";

const SOCIALS = [
  {
    label: "Instagram",
    href: CONTACT.instagram,
    path: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
      </>
    ),
    stroke: true,
  },
  {
    label: "Facebook",
    href: CONTACT.facebook,
    path: <path d="M13.5 21v-7h2.6l.4-3h-3V9.1c0-.9.3-1.5 1.6-1.5H16.7V4.9c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4V11H7.9v3h2.6v7h3z" />,
    stroke: false,
  },
  {
    label: "TikTok",
    href: CONTACT.tiktok,
    path: <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.6 2.6 0 0 1-2.59-2.59c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" />,
    stroke: false,
  },
  {
    label: "LinkedIn",
    href: CONTACT.linkedin,
    path: (
      <>
        <path d="M4 9h3.4v11H4z" />
        <circle cx="5.7" cy="5.4" r="1.95" />
        <path d="M20 20h-3.4v-5.9c0-1.5-.55-2.5-1.85-2.5-1 0-1.6.7-1.87 1.35-.1.23-.12.56-.12.9V20H9.4s.04-10.1 0-11h3.36v1.5c.45-.7 1.25-1.75 3.1-1.75 2.3 0 4.14 1.5 4.14 4.75V20z" />
      </>
    ),
    stroke: false,
  },
  {
    label: "WhatsApp",
    href: CONTACT.whatsappHref,
    path: <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3zm0 1.7a7.3 7.3 0 1 1-3.9 13.5l-.3-.2-2.8.7.8-2.7-.2-.3A7.3 7.3 0 0 1 12 4.7zm-2.6 3.2c-.2 0-.5 0-.7.3-.2.3-.9.9-.9 2.1s.9 2.5 1 2.6c.1.2 1.8 2.8 4.4 3.8 2.1.9 2.6.7 3 .7.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2l-.5-.3-1.7-.8c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.7-.3-1.5-.7-2.3-1.4-.6-.6-1-1.2-1.3-1.8-.1-.2 0-.4.1-.5l.6-.7c.1-.2.1-.4 0-.6L9.9 8.3c-.1-.3-.3-.4-.5-.4z" />,
    stroke: false,
  },
];

const TONES = {
  /* on the plum footer */
  dark: "border-cream-100/20 text-cream-100/75 hover:border-gold-300 hover:text-gold-300",
  /* on cream cards */
  light: "border-gold-300/80 text-plum-900 hover:border-plum-900 hover:bg-plum-900 hover:text-cream-100",
};

export default function SocialLinks({
  tone = "dark",
  whatsapp = true,
  className = "",
}: {
  tone?: keyof typeof TONES;
  whatsapp?: boolean;
  className?: string;
}) {
  const socials = whatsapp ? SOCIALS : SOCIALS.filter((s) => s.label !== "WhatsApp");
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {socials.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          title={s.label}
          className={`flex h-10 w-10 items-center justify-center rounded-btn border transition-all duration-300 ${TONES[tone]}`}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-[18px] w-[18px]"
            fill={s.stroke ? "none" : "currentColor"}
            stroke={s.stroke ? "currentColor" : undefined}
            strokeWidth={s.stroke ? 1.5 : undefined}
          >
            {s.path}
          </svg>
        </a>
      ))}
    </div>
  );
}
