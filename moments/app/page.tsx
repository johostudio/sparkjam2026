"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
  MotionValue,
} from "framer-motion";
import dynamic from "next/dynamic";
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
  "Slide 16_9 - 9.png",
  "Slide 16_9 - 10.png",
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
  "Slide 16_9 - 25.png",
  "Slide 16_9 - 26.png",
  "Slide 16_9 - 27.png",
];

const INTRO_VIDEO_URL = "https://www.youtube.com/watch?v=apK5kau4vqA";

function useMotionValueState(mv: MotionValue<number>): number {
  const [value, setValue] = useState<number>(mv.get());

  useEffect(() => {
    const unsubscribe = mv.on("change", setValue);
    return unsubscribe;
  }, [mv]);

  return value;
}

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

  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ["start start", "end end"],
  });

  const phoneRotation = useTransform(
    scrollYProgress,
    [0, 0.04, 0.15, 1],
    [0, 0, Math.PI, Math.PI]
  );

  const heroHeight = useTransform(scrollYProgress, [0, 0.06], ["100vh", "9vh"]);
  const heroBottomRadius = useTransform(scrollYProgress, [0, 0.06], [0, 108]);
  const heroShadowStrength = useTransform(scrollYProgress, [0, 0.06], [0, 0.58]);
  const heroShadow = useMotionTemplate`0 14px 40px rgba(0, 0, 0, ${heroShadowStrength})`;

  return (
    <div ref={pageRef} style={{ background: "#000", minHeight: "100vh" }}>
      <motion.section
        style={{
          height: heroHeight,
          width: "100%",
          position: "sticky",
          top: 0,
          zIndex: 50,
          overflow: "hidden",
          borderBottomLeftRadius: heroBottomRadius,
          borderBottomRightRadius: heroBottomRadius,
          boxShadow: heroShadow,
        }}
      >
        <IntroVideoEmbed />
      </motion.section>

      {isMobile ? (
        <MobileLayout phoneRotation={phoneRotation} />
      ) : (
        <DesktopLayout phoneRotation={phoneRotation} />
      )}

      {!isMobile && <LandingFooter />}
    </div>
  );
}

function IntroVideoEmbed() {
  const [isHovering, setIsHovering] = useState(false);
  const [hasMousePointer, setHasMousePointer] = useState(false);
  const cursorPopRef = useRef<HTMLSpanElement>(null);
  const cursorTargetRef = useRef({ x: 20, y: 20 });
  const cursorRafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setHasMousePointer(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    return () => {
      if (cursorRafRef.current !== null) {
        window.cancelAnimationFrame(cursorRafRef.current);
      }
    };
  }, []);

  const updateCursorPop = () => {
    cursorRafRef.current = null;
    const el = cursorPopRef.current;
    if (!el) return;
    const { x, y } = cursorTargetRef.current;
    el.style.transform = `translate3d(${x + 8}px, ${y - 16}px, 0)`;
  };

  return (
    <a
      className="intro-video-link"
      href={INTRO_VIDEO_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Watch full intro video on YouTube"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setIsHovering(true);
      }}
      onPointerLeave={() => setIsHovering(false)}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;
        const rect = event.currentTarget.getBoundingClientRect();
        cursorTargetRef.current = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        };
        if (cursorRafRef.current === null) {
          cursorRafRef.current = window.requestAnimationFrame(updateCursorPop);
        }
      }}
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
      {hasMousePointer && isHovering && (
        <span
          ref={cursorPopRef}
          className="intro-video-cursor-pop"
        >
          open on youtube
        </span>
      )}
      {!hasMousePointer && <span className="intro-video-static-pop">tap to open</span>}
    </a>
  );
}

function DesktopLayout({ phoneRotation }: { phoneRotation: MotionValue<number> }) {
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
          padding: "4vh 3vw 12vh 3vw",
          display: "flex",
          flexDirection: "column",
          gap: "4vh",
        }}
      >
        {SLIDES.map((fileName, index) => (
          <SlideSection key={fileName} src={`/Slides/${fileName}`} index={index} />
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
  const rotation = useMotionValueState(phoneRotation);

  return (
    <div style={{ width: "100%", height: "80vh" }}>
      <PhoneScene rotationY={rotation} interactive={false} />
    </div>
  );
}

function MobileLayout({ phoneRotation }: { phoneRotation: MotionValue<number> }) {
  return (
    <>
      <section
        style={{
          width: "100%",
          height: "70vh",
          position: "relative",
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
          width: "100%",
          height: "20px",
          position: "relative",
          overflow: "hidden",
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
      </section>

      <div style={{ position: "relative", background: "#000" }}>
        <GradientSideRail />

        <section
          style={{
            width: "100%",
            padding: "4vh 4vw 0 calc(4vw + 16px)",
            display: "flex",
            flexDirection: "column",
            gap: "3vh",
          }}
        >
          {SLIDES.map((fileName, index) => (
            <SlideSection key={fileName} src={`/Slides/${fileName}`} index={index} />
          ))}
        </section>

        <LandingFooter mobile />
      </div>
    </>
  );
}

function MobilePhoneWrapper({
  phoneRotation,
}: {
  phoneRotation: MotionValue<number>;
}) {
  const rotation = useMotionValueState(phoneRotation);
  return <PhoneScene rotationY={rotation} interactive={true} />;
}

function GradientSideRail() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        width: "12px",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 2,
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

function LandingFooter({ mobile = false }: { mobile?: boolean }) {
  return (
    <footer
      style={{
        position: "relative",
        marginTop: mobile ? "6vh" : "8vh",
        minHeight: mobile ? "92px" : "68px",
        display: "flex",
        alignItems: "flex-end",
        overflow: "hidden",
        borderTopLeftRadius: mobile ? "20px" : "24px",
        borderTopRightRadius: mobile ? "20px" : "24px",
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
        }}
      >
        <source src="/videos/Gradient.mp4" type="video/mp4" />
      </video>

      <section
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0, 0, 0, 0.22)",
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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.3rem",
          color: "#fff",
          lineHeight: 1.25,
          fontSize: mobile ? "0.8rem" : "0.9rem",
          textAlign: "center",
          fontWeight: 500,
        }}
      >
        <p style={{ fontWeight: 650 }}>
          Woah! You found our super secret footer.
        </p>
        <p style={{ opacity: 0.95 }}>
          thanks for visiting our project. show this to the booth team for
          something cool (if they still have some...sorry :&apos;&lt; )
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
          and
          <a
            href="https://www.jadenlee.ca/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "underline", marginLeft: "0.2rem" }}
          >
            jaden
          </a>
          for making us lock tf in :)
        </p>
      </div>
    </footer>
  );
}
