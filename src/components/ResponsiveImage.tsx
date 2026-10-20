import Image, { getImageProps } from "next/image";

const BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

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
  // Fetch nothing below mobileBreakpoint: the caller draws that layout itself.
  desktopOnly = false,
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
  desktopOnly?: boolean;
  loading?: "eager" | "lazy";
}) {
  if (desktopOnly) {
    const { props } = getImageProps({ alt, fill: true, sizes, src, loading: preload ? "eager" : loading, fetchPriority: preload ? "high" : "auto" });
    // A <picture> whose only <source> is the desktop one: narrower viewports
    // fall back to the <img>, whose src is a blank data URI, so no request.
    return (
      <picture className="absolute inset-0 block">
        <source media={`(min-width: ${mobileBreakpoint}px)`} srcSet={props.srcSet} sizes={sizes} />
        <img {...props} src={BLANK} srcSet={undefined} alt={alt} className={className} />
      </picture>
    );
  }

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
