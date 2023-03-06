import { useMatomo } from "@datapunt/matomo-tracker-react";
import { useEffect } from "react";

export default function useTrackPageViews(pathname) {
  const { trackPageView } = useMatomo();

  useEffect(
    () => {
      trackPageView({
        href: pathname,
      });
    },
    [pathname]
  );
}
