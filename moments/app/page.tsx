"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type MouseEvent,
  type TouchEvent,
} from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useScroll,
  useTransform,
  MotionValue,
} from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import SlideSection from "./components/SlideSection";

const PhoneScene = dynamic(() => import("./components/PhoneScene"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          border: "3px solid #333",
          borderTopColor: "#888",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
    </div>
  ),
});

const SLIDES = [
  "Slide 16_9 - 1.png",
  "Slide 16_9 - 2.png",
  "Slide 16_9 - 3.png",
  "Slide 16_9 - 4.png",
  "Slide 16_9 - 5.png",
  "Slide 16_9 - 6.png",
  "Slide 16_9 - 7.png",
  "Slide 16_9 - 8.png",
  "Slide 16_9 - 9.png",
  "Slide 16_9 - 10.png",
  "Slide 16_9 - 11.png",
  "Slide 16_9 - 12.png",
  "Slide 16_9 - 13.png",
  "Slide 16_9 - 14.png",
  "Slide 16_9 - 15.png",
  "Slide 16_9 - 16.png",
  "Slide 16_9 - 17.png",
  "Slide 16_9 - 18.png",
  "Slide 16_9 - 19.png",
  "Slide 16_9 - 20.png",
  "Slide 16_9 - 21.png",
  "Slide 16_9 - 22.png",
  "Slide 16_9 - 23.png",
  "Slide 16_9 - 24.png",
] as const;

const INTRO_VIDEO_URL = "https://www.youtube.com/watch?v=apK5kau4vqA";
const FIGMA_PROTO_URL =
  "https://www.figma.com/design/w0BrBbqlmgZwMhzdMNOleB/Revision--test-?node-id=2079-3140&t=1XX630OBlW6hYhHn-1";
const PROJECT_PAGE_URL = "https://www.sparkjam.design/";
const BADGE_IMAGES = [
  "/videos/badge-1.png",
  "/videos/badge-3.png",
  "/videos/badge-2.png",
] as const;
const BADGE_TIP_TEXT = [
  "first badge!",
  "one more to go...",
  "thats all of them :)",
] as const;

function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const forceMobilePreview = new URLSearchParams(window.location.search).get(
        "mobile"
      ) === "1";
      setIsMobile(window.innerWidth < breakpoint || forceMobilePreview);
    };
    check();
    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isMobile;
}

export default function Home() {
  const pageRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { scrollY } = useScroll();

  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, behavior: "auto" });

    return () => {
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  const phoneRotation = useTransform(
    scrollYProgress,
    [0, 0.04, 0.15, 1],
    [0, 0, Math.PI, Math.PI]
  );

  const curlDistance = isMobile ? 1600 : 1260;
  const curledHeightVh = isMobile ? 12 : 9;
  const postCurlHoldDistance = isMobile ? 1900 : 1300;
  const totalDistance = curlDistance + postCurlHoldDistance;
  const curlPhaseEnd = curlDistance / totalDistance;
  const rawPhaseProgress = useTransform(scrollY, [0, totalDistance], [0, 1], {
    clamp: true,
  });
  const curlProgress = useTransform(rawPhaseProgress, [0, curlPhaseEnd], [0, 1], {
    clamp: true,
  });

  const heroHeight = useTransform(
    curlProgress,
    (value) => `${100 - (100 - curledHeightVh) * value}vh`
  );
  const heroRadius = useTransform(curlProgress, [0, 1], [0, isMobile ? 132 : 172]);
  const heroShadow = useTransform(
    curlProgress,
    (value) =>
      `0 ${Math.round(8 + 22 * value)}px ${Math.round(20 + 34 * value)}px rgba(0, 0, 0, ${(0.16 + value * 0.45).toFixed(3)})`
  );

  return (
    <div
      ref={pageRef}
      style={{ background: "#000", minHeight: "100vh", position: "relative" }}
    >
      {isMobile && <GlobalGradientRail />}

      <motion.section
        style={{
          height: heroHeight,
          borderBottomLeftRadius: heroRadius,
          borderBottomRightRadius: heroRadius,
          boxShadow: heroShadow,
          width: "100%",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 70,
          overflow: "hidden",
          willChange: "height, border-radius, box-shadow",
        }}
      >
        <IntroVideoEmbed />
        <HeroQuickLinks mobile={isMobile} />
      </motion.section>

      <motion.section
        aria-hidden
        style={{
          height: `${totalDistance}px`,
          width: "100%",
          background: "#000",
          position: "relative",
          overflow: "visible",
        }}
      >
        <SpacerArtwork
          revealProgress={rawPhaseProgress}
          revealStart={curlPhaseEnd}
        />
      </motion.section>

      {isMobile ? (
        <MobileLayout
          phoneRotation={phoneRotation}
          showSlideDebug={false}
        />
      ) : (
        <DesktopLayout phoneRotation={phoneRotation} showSlideDebug={false} />
      )}

      {!isMobile && <LandingFooter />}
    </div>
  );
}

function IntroVideoEmbed() {
  return (
    <div
      className="intro-video-link"
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/videos/image.png"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      >
        <source src="/videos/Intro 1.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

type QuickLinkTip = "youtube" | "figma" | "project";

function HeroQuickLinks({ mobile }: { mobile: boolean }) {
  const [activeTip, setActiveTip] = useState<{
    key: QuickLinkTip;
    x: number;
    y: number;
  } | null>(null);
  const tipTimeoutRef = useRef<number | null>(null);
  const iconSize = mobile ? 38 : 42;

  useEffect(() => {
    return () => {
      if (tipTimeoutRef.current !== null) {
        window.clearTimeout(tipTimeoutRef.current);
      }
    };
  }, []);

  const setTipAtPoint = (tip: QuickLinkTip, x: number, y: number) => {
    setActiveTip({ key: tip, x, y });
  };

  const onIconMouseEnter = (
    event: MouseEvent<HTMLAnchorElement>,
    tip: QuickLinkTip
  ) => {
    setTipAtPoint(tip, event.clientX, event.clientY);
  };

  const onIconFocus = (event: FocusEvent<HTMLAnchorElement>, tip: QuickLinkTip) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTipAtPoint(tip, rect.left + rect.width / 2, rect.top + rect.height / 2);
  };

  const hideTip = () => setActiveTip(null);

  const onTouchPreview = (
    event: TouchEvent<HTMLAnchorElement>,
    tip: QuickLinkTip
  ) => {
    if (activeTip?.key !== tip) {
      event.preventDefault();
      const touch = event.touches[0];
      setTipAtPoint(tip, touch.clientX, touch.clientY);
      if (tipTimeoutRef.current !== null) {
        window.clearTimeout(tipTimeoutRef.current);
      }
      tipTimeoutRef.current = window.setTimeout(() => {
        setActiveTip(null);
      }, 1100);
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: mobile ? "1.05rem" : "1.2rem",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: mobile ? "1.05rem" : "1.12rem",
        zIndex: 140,
      }}
    >
      <a
        className="quick-link-icon"
        href={FIGMA_PROTO_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open Figma prototype"
        onMouseEnter={(event) => onIconMouseEnter(event, "figma")}
        onMouseLeave={hideTip}
        onFocus={(event) => onIconFocus(event, "figma")}
        onBlur={hideTip}
        onTouchStart={(event) => onTouchPreview(event, "figma")}
        style={{
          width: `${iconSize}px`,
          height: `${iconSize}px`,
          color: "#fff",
          opacity: 0.96,
          position: "relative",
          marginLeft: "0rem",
          transform: "translateX(0.5rem)",
          overflow: "visible",
        }}
      >
        <span
          style={{
            width: "100%",
            height: "100%",
            display: "inline-flex",
            transform: "scale(0.86)",
            transformOrigin: "center",
          }}
        >
          <FigmaIcon />
        </span>
      </a>
      <a
        className="quick-link-icon"
        href={PROJECT_PAGE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open project page"
        onMouseEnter={(event) => onIconMouseEnter(event, "project")}
        onMouseLeave={hideTip}
        onFocus={(event) => onIconFocus(event, "project")}
        onBlur={hideTip}
        onTouchStart={(event) => onTouchPreview(event, "project")}
        style={{
          width: `${iconSize}px`,
          height: `${iconSize}px`,
          color: "#fff",
          opacity: 0.96,
          position: "relative",
          overflow: "visible",
        }}
      >
        <Image
          src="/videos/sfusurge.png"
          alt="SFU Surge icon"
          width={iconSize}
          height={iconSize}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            transform: "scale(2)",
            transformOrigin: "center",
          }}
        />
      </a>
      <a
        className="quick-link-icon"
        href={INTRO_VIDEO_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open YouTube video"
        onMouseEnter={(event) => onIconMouseEnter(event, "youtube")}
        onMouseLeave={hideTip}
        onFocus={(event) => onIconFocus(event, "youtube")}
        onBlur={hideTip}
        onTouchStart={(event) => onTouchPreview(event, "youtube")}
        style={{
          width: `${iconSize}px`,
          height: `${iconSize}px`,
          color: "#fff",
          opacity: 0.96,
          position: "relative",
          marginLeft: "0.16rem",
          overflow: "visible",
        }}
      >
        <YoutubeIcon />
      </a>

      <AnimatePresence>
        {activeTip && (
          <motion.span
            key={activeTip.key}
            className="quick-link-tip-card"
            initial={{ opacity: 0, scale: 0.96, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 2 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            style={{
              position: "fixed",
              left: activeTip.x,
              top: activeTip.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            <span className="quick-link-tip-title">
              {activeTip.key === "figma"
                ? "figma"
                : activeTip.key === "youtube"
                  ? "youtube"
                  : "project page"}
            </span>
            <span className="quick-link-tip-sub">
              {activeTip.key === "figma"
                ? "check out our prototype :)"
                : activeTip.key === "youtube"
                  ? "check out our demo :)"
                  : "check out project page :)"}
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="white">
      <path d="M23.498 6.186a2.997 2.997 0 0 0-2.11-2.12C19.52 3.545 12 3.545 12 3.545s-7.52 0-9.388.52a2.997 2.997 0 0 0-2.11 2.12A31.866 31.866 0 0 0 0 12a31.866 31.866 0 0 0 .502 5.814 2.997 2.997 0 0 0 2.11 2.12c1.868.521 9.388.521 9.388.521s7.52 0 9.388-.52a2.997 2.997 0 0 0 2.11-2.12A31.866 31.866 0 0 0 24 12a31.866 31.866 0 0 0-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function FigmaIcon() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none">
      <rect x="6.2" y="2.2" width="5.8" height="5.8" rx="2.9" fill="white" />
      <rect x="6.2" y="8.2" width="5.8" height="5.8" rx="2.9" fill="white" />
      <rect x="6.2" y="14.2" width="5.8" height="5.8" rx="2.9" fill="white" />
      <rect x="12.2" y="2.2" width="5.8" height="5.8" rx="2.9" fill="white" />
      <circle cx="15.1" cy="11.1" r="2.9" fill="white" />
    </svg>
  );
}

function DesktopLayout({
  phoneRotation,
  showSlideDebug,
}: {
  phoneRotation: MotionValue<number>;
  showSlideDebug: boolean;
}) {
  return (
    <section
      style={{
        display: "flex",
        width: "100%",
        maxWidth: "1800px",
        margin: "0 auto",
        position: "relative",
      }}
    >
      <div
        style={{
          flex: "0 0 58%",
          width: "58%",
          padding: "8vh 3vw 12vh 3vw",
          display: "flex",
          flexDirection: "column",
          gap: "4vh",
        }}
      >
        {SLIDES.map((fileName, index) => (
          <SlideSection
            key={fileName}
            src={`/Slides/${fileName}`}
            index={index}
            showDebug={showSlideDebug}
          />
        ))}
      </div>

      <div
        style={{
          flex: "0 0 42%",
          width: "42%",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <DesktopPhoneWrapper phoneRotation={phoneRotation} />
        </div>
      </div>
    </section>
  );
}

function DesktopPhoneWrapper({
  phoneRotation,
}: {
  phoneRotation: MotionValue<number>;
}) {
  return (
    <div style={{ width: "100%", height: "80vh" }}>
      <LazyPhoneScene rotationY={phoneRotation} interactive={false} />
    </div>
  );
}

function MobileLayout({
  phoneRotation,
  showSlideDebug,
}: {
  phoneRotation: MotionValue<number>;
  showSlideDebug: boolean;
}) {
  return (
    <div style={{ position: "relative", background: "#000" }}>
      <section
        style={{
          width: "100%",
          height: "70vh",
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          style={{
            position: "absolute",
            bottom: "3vh",
            color: "#666",
            fontSize: "0.85rem",
            letterSpacing: "0.05em",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          Drag to rotate
        </motion.p>

        <div style={{ width: "100%", height: "100%" }}>
          <MobilePhoneWrapper phoneRotation={phoneRotation} />
        </div>
      </section>

      <section
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          padding: "7vh 4vw 0 calc(4vw + 12px)",
          display: "flex",
          flexDirection: "column",
          gap: "3vh",
        }}
      >
        {SLIDES.map((fileName, index) => (
          <SlideSection
            key={fileName}
            src={`/Slides/${fileName}`}
            index={index}
            showDebug={showSlideDebug}
          />
        ))}
      </section>

      <LandingFooter mobile />
    </div>
  );
}

function MobilePhoneWrapper({
  phoneRotation,
}: {
  phoneRotation: MotionValue<number>;
}) {
  return <LazyPhoneScene rotationY={phoneRotation} interactive={true} />;
}

function GlobalGradientRail() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        width: "7px",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 6,
        opacity: 0.78,
      }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      >
        <source src="/videos/Gradient.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

function SpacerArtwork({
  revealProgress,
  revealStart,
}: {
  revealProgress: MotionValue<number>;
  revealStart: number;
}) {
  const artworkRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(artworkRef, { margin: "-12% 0px -12% 0px" });
  const revealBlend = useTransform(
    revealProgress,
    [Math.max(0, revealStart - 0.01), revealStart + 0.09],
    [0, 1],
    { clamp: true }
  );
  const revealStrength = useTransform(revealBlend, (v) => (isInView ? v : 0));
  const opacity = useTransform(revealStrength, [0, 1], [0, 1]);
  const scale = useTransform(revealStrength, [0, 1], [0.78, 1.08]);
  const y = useTransform(revealStrength, [0, 1], [154, 92]);
  const blur = useTransform(revealStrength, [0, 1], [12, 0]);
  const style: CSSProperties = {
    transition:
      "opacity 420ms ease-out, transform 620ms cubic-bezier(0.22, 1, 0.36, 1), filter 520ms ease-out",
    willChange: "opacity, transform, filter",
  };

  return (
    <div
      ref={artworkRef}
      style={{
        position: "sticky",
        top: 0,
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      <motion.div
        style={{
          ...style,
          opacity,
          scale,
          y,
          filter: useTransform(blur, (v) => `blur(${v}px)`),
        }}
      >
        <Image
          src="/videos/Untitled-1.png"
          alt="Spacer artwork"
          width={1200}
          height={1200}
          priority
          style={{
            width: "min(96vw, 760px)",
            height: "auto",
            maxHeight: "82vh",
            objectFit: "contain",
            display: "block",
          }}
        />
      </motion.div>
    </div>
  );
}

function LazyPhoneScene({
  rotationY,
  interactive,
}: {
  rotationY: MotionValue<number>;
  interactive: boolean;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isNearView = useInView(wrapperRef, {
    margin: "450px 0px 450px 0px",
    once: false,
  });

  return (
    <div ref={wrapperRef} style={{ width: "100%", height: "100%" }}>
      {isNearView ? (
        <PhoneScene rotationY={rotationY} interactive={interactive} />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            minHeight: "360px",
            background: "transparent",
          }}
        />
      )}
    </div>
  );
}

function LandingFooter({ mobile = false }: { mobile?: boolean }) {
  const footerRef = useRef<HTMLElement>(null);
  const footerSeenRef = useRef(false);
  const [isBadgeOpen, setIsBadgeOpen] = useState(false);
  const [badgeCount, setBadgeCount] = useState(0);
  const [isIconPopping, setIsIconPopping] = useState(false);
  const [activeBadgeTip, setActiveBadgeTip] = useState<{
    slot: number;
    x: number;
    y: number;
  } | null>(null);
  const badgeTipTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storageKey = "sparkjam_badges_count_v1";
    try {
      const stored = Number.parseInt(localStorage.getItem(storageKey) ?? "0", 10);
      let nextCount = Number.isFinite(stored) ? stored : 0;
      nextCount = Math.max(0, Math.min(3, nextCount));
      nextCount = Math.min(3, nextCount + 1);
      localStorage.setItem(storageKey, String(nextCount));
      window.requestAnimationFrame(() => {
        setBadgeCount(nextCount);
      });
    } catch {
      // Fallback when storage is unavailable.
      window.requestAnimationFrame(() => {
        setBadgeCount((prev) => Math.min(3, Math.max(1, prev + 1)));
      });
    }
  }, []);

  useEffect(() => {
    if (!footerRef.current || typeof window === "undefined") return;
    const node = footerRef.current;

    const triggerPop = () => {
      setIsIconPopping(true);
      window.setTimeout(() => setIsIconPopping(false), 900);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !footerSeenRef.current) {
            footerSeenRef.current = true;
            triggerPop();
          }
          if (!entry.isIntersecting) {
            footerSeenRef.current = false;
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -16% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (badgeTipTimeoutRef.current !== null) {
        window.clearTimeout(badgeTipTimeoutRef.current);
      }
    };
  }, []);

  const setBadgeTipAtPoint = (slot: number, x: number, y: number) => {
    setActiveBadgeTip({ slot, x, y });
  };

  const onBadgeTouchPreview = (event: TouchEvent<HTMLButtonElement>, slot: number) => {
    const touch = event.touches[0];
    setBadgeTipAtPoint(slot, touch.clientX, touch.clientY);
    if (badgeTipTimeoutRef.current !== null) {
      window.clearTimeout(badgeTipTimeoutRef.current);
    }
    badgeTipTimeoutRef.current = window.setTimeout(() => {
      setActiveBadgeTip(null);
    }, 1000);
  };

  return (
    <footer
      ref={footerRef}
      style={{
        position: "relative",
        marginTop: mobile ? "6vh" : "8vh",
        minHeight: mobile ? "92px" : "68px",
        display: "flex",
        alignItems: "flex-end",
        overflow: "visible",
        borderTopLeftRadius: mobile ? "20px" : "24px",
        borderTopRightRadius: mobile ? "20px" : "24px",
        zIndex: 60,
        isolation: "isolate",
      }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderTopLeftRadius: mobile ? "20px" : "24px",
          borderTopRightRadius: mobile ? "20px" : "24px",
        }}
      >
        <source src="/videos/Gradient.mp4" type="video/mp4" />
      </video>

      <section
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0, 0, 0, 0.22)",
          borderTopLeftRadius: mobile ? "20px" : "24px",
          borderTopRightRadius: mobile ? "20px" : "24px",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          margin: 0,
          padding: mobile
            ? "0.75rem 6vw 0.85rem calc(6vw + 16px)"
            : "0.7rem 1rem 0.75rem 1rem",
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "0.6rem",
          color: "#fff",
          lineHeight: 1.25,
          fontSize: mobile ? "0.78rem" : "0.88rem",
          textAlign: "left",
          fontWeight: 500,
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "0.22rem",
          }}
        >
          <p style={{ fontWeight: 700 }}>
            woah! you made it to the bottom :)
          </p>
          <p style={{ opacity: 0.92 }}>
            a Project by &apos;4vibes&apos; (
            <a
              href="https://evelynyu.framer.website/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "underline", marginLeft: "0.2rem" }}
            >
              Evelyn Yu
            </a>
            , Alyssa Yang,
            <a
              href="https://danielshi.ca/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "underline", marginLeft: "0.2rem" }}
            >
              Daniel Shi
            </a>
            ,
            <a
              href="https://joho.studio/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "underline", marginLeft: "0.2rem" }}
            >
              Johnny Ho
            </a>
            ) for
            <a
              href="https://www.sparkjam.design/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "underline", marginLeft: "0.2rem" }}
            >
              SparkJam 2026
            </a>
            . thank u to all sparkjam staff, big shoutout to
            <a
              href="https://keyaanvegdani.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "underline", marginLeft: "0.2rem" }}
            >
              keyaan
            </a>
            {" "}and{" "}
            <a
              href="https://www.jadenlee.ca/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "underline" }}
            >
              jaden
            </a>
            {" "}for making us lock tf in :)
          </p>
        </div>

        <motion.button
          type="button"
          whileHover={{ scale: 1.07, rotate: -6, y: -1 }}
          whileTap={{ scale: 0.94 }}
          animate={
            isIconPopping
              ? { scale: [1, 1.19, 1, 1.12, 1], rotate: [0, -8, 0, -4, 0], y: [0, -2, 0, -1, 0] }
              : { scale: 1, rotate: 0, y: 0 }
          }
          transition={{ duration: 0.82, ease: "easeOut" }}
          onClick={() => setIsBadgeOpen((prev) => !prev)}
          onMouseEnter={() => setIsIconPopping(true)}
          onMouseLeave={() => window.setTimeout(() => setIsIconPopping(false), 140)}
          onTouchStart={() => setIsIconPopping(true)}
          style={{
            marginTop: "0.2rem",
            width: mobile ? "44px" : "34px",
            height: mobile ? "44px" : "34px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            alignSelf: mobile ? "center" : "flex-start",
            marginLeft: mobile ? 0 : "auto",
            flexShrink: 0,
            zIndex: 80,
            overflow: "visible",
          }}
          aria-label="Open badge collection"
        >
          <img
            src="/videos/Vector.png"
            alt="Badge collection icon"
            width={34}
            height={34}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </motion.button>
      </div>

      <AnimatePresence>
        {isBadgeOpen && (
          <>
            <motion.div
              key="badge-card"
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              style={{
                position: mobile ? "fixed" : "absolute",
                inset: mobile ? 0 : "auto",
                left: mobile ? 0 : "auto",
                right: mobile ? 0 : "1.1rem",
                top: mobile ? 0 : "auto",
                bottom: mobile ? 0 : "112px",
                margin: mobile ? "auto" : 0,
                width: mobile ? "100%" : "380px",
                height: mobile ? "100%" : "auto",
                borderRadius: "20px",
                zIndex: 120,
                display: mobile ? "flex" : "block",
                alignItems: mobile ? "center" : "initial",
                justifyContent: mobile ? "center" : "initial",
                background: mobile ? "rgba(0, 0, 0, 0.24)" : "transparent",
                overflow: "hidden",
              }}
              onClick={() => {
                if (mobile) setIsBadgeOpen(false);
              }}
            >
              <div
                onClick={(event) => event.stopPropagation()}
                style={{
                  width: mobile ? "min(92vw, 360px)" : "380px",
                  borderRadius: "20px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(0, 0, 0, 0.76)",
                  backdropFilter: "blur(7px)",
                  padding: mobile ? "1rem 0.9rem" : "1.05rem",
                  color: "#fff",
                  fontFamily: '"Instagram Sans", "Segoe UI", Helvetica, Arial, sans-serif',
                  overflow: "hidden",
                }}
              >
                <p
                  style={{
                    fontSize: mobile ? "1.04rem" : "1.12rem",
                    fontWeight: 700,
                    lineHeight: 1.1,
                    marginBottom: "0.3rem",
                    textAlign: "center",
                  }}
                >
                  badge collection !
                </p>
                <p
                  style={{
                    fontSize: mobile ? "0.86rem" : "0.9rem",
                    lineHeight: 1.2,
                    color: "rgba(255,255,255,0.88)",
                    textAlign: "center",
                    marginBottom: "0.85rem",
                    fontWeight: 400,
                  }}
                >
                  thanks for stopping by :)
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gap: mobile ? "0.6rem" : "0.75rem",
                    marginBottom: "0.6rem",
                  }}
                >
                  {BADGE_IMAGES.map((badgeImage, slot) => {
                    const unlocked = slot < badgeCount;
                    return (
                      <motion.button
                        key={slot}
                        type="button"
                        onMouseEnter={(event) =>
                          setBadgeTipAtPoint(slot, event.clientX, event.clientY)
                        }
                        onMouseLeave={() => setActiveBadgeTip(null)}
                        onTouchStart={(event) => onBadgeTouchPreview(event, slot)}
                        whileHover={{ scale: 1.04, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          position: "relative",
                          minHeight: mobile ? "80px" : "96px",
                          width: "100%",
                          borderRadius: "14px",
                          border: "1px solid rgba(255,255,255,0.2)",
                          padding: "0.35rem",
                          background: "rgba(255,255,255,0.06)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        {unlocked ? (
                          <Image
                            src={badgeImage}
                            alt={`Badge ${slot + 1}`}
                            width={84}
                            height={84}
                            style={{
                              width: "100%",
                              height: "auto",
                              maxHeight: mobile ? "74px" : "86px",
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          <span
                            aria-hidden
                            style={{
                              width: "11px",
                              height: "11px",
                              borderRadius: "999px",
                              background: "rgba(255,255,255,0.28)",
                              display: "inline-block",
                            }}
                          />
                        )}
                        <AnimatePresence>
                          {activeBadgeTip?.slot === slot && (
                            <motion.span
                              initial={{ opacity: 0, y: 4, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 3, scale: 0.99 }}
                              transition={{ duration: 0.16, ease: "easeOut" }}
                              style={{
                                position: "fixed",
                                top: activeBadgeTip.y,
                                left: activeBadgeTip.x,
                                transform: "translate(-50%, -50%)",
                                whiteSpace: "nowrap",
                                fontSize: "0.56rem",
                                lineHeight: 1.1,
                                color: "#f1f1f1",
                                background: "rgba(7, 7, 8, 0.74)",
                                border: "1px solid rgba(255,255,255,0.16)",
                                borderRadius: "999px",
                                padding: "0.24rem 0.4rem",
                                pointerEvents: "none",
                                zIndex: 320,
                                fontWeight: 400,
                              }}
                            >
                              {BADGE_TIP_TEXT[slot]}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    );
                  })}
                </div>

                {badgeCount < 3 ? (
                  <p
                    style={{
                      fontSize: mobile ? "0.95rem" : "1rem",
                      lineHeight: 1.3,
                      opacity: 0.8,
                      textAlign: "center",
                    }}
                  >
                    you&apos;ve collected {badgeCount}/3 badges. collect 3 to win a
                    small prize :)
                  </p>
                ) : (
                  <p
                    style={{
                      fontSize: mobile ? "0.95rem" : "1rem",
                      lineHeight: 1.3,
                      opacity: 0.8,
                      textAlign: "center",
                    }}
                  >
                    thank you!! show this to our team and collect a small prize (if
                    theres any left...)
                  </p>
                )}
                <p
                  style={{
                    fontSize: mobile ? "0.66rem" : "0.68rem",
                    lineHeight: 1.2,
                    opacity: 0.52,
                    textAlign: "center",
                    marginTop: "0.42rem",
                  }}
                >
                  (try refreshing the page...)
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </footer>
  );
}

