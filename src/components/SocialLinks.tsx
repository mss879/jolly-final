import { CONTACT } from "@/lib/data";

/* The WhatsApp mark (phone in a speech bubble), drawn on a 24-unit square and
   scaled in a little so it sits at the same size as the other icons. */
export function WhatsAppGlyph() {
  return (
    <path
      transform="translate(2.6 2.6) scale(0.783)"
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"
    />
  );
}

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
    path: <WhatsAppGlyph />,
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
