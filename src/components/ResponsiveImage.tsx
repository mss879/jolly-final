import Image, { getImageProps } from "next/image";

/* Art direction: the browser fetches one optimized source for its viewport.
   Keep headings and controls in HTML; these variants change only the photo. */
export default function ResponsiveImage({
  src,
  mobileSrc,
  mobileBreakpoint = 768,
  alt,
  sizes = "100vw",
  className,
  preload = false,
  // WebKit can leave lazy art-directed fill images blank after scrolling.
  // The slider separately defers its later slides until the first load.
  loading = mobileSrc ? "eager" : "lazy",
}: {
  src: string;
  mobileSrc?: string;
  mobileBreakpoint?: number;
  alt: string;
  sizes?: string;
  className?: string;
  preload?: boolean;
  loading?: "eager" | "lazy";
}) {
  if (!mobileSrc) {
    return <Image src={src} alt={alt} fill sizes={sizes} className={className} preload={preload} loading={preload ? undefined : loading} />;
  }

  const common = {
    alt,
    fill: true,
    sizes,
    loading: preload ? "eager" : loading,
    fetchPriority: preload ? "high" : "auto",
  } as const;
  const { props: desktop } = getImageProps({ ...common, src });
  const { props: mobile } = getImageProps({ ...common, src: mobileSrc });

  return (
    <picture className="absolute inset-0 block">
      <source media={`(min-width: ${mobileBreakpoint}px)`} srcSet={desktop.srcSet} sizes={sizes} />
      <img {...mobile} alt={alt} className={className} />
    </picture>
  );
}
