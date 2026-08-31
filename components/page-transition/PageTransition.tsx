"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { flushSync } from "react-dom";
import { useEffect, useRef, useState } from "react";

const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/blog",
  "/contact",
  "/portfolio",
];

function isPublicRoute(pathname: string) {
  return (
    PUBLIC_ROUTES.includes(pathname) ||
    pathname.startsWith("/blog/") ||
    pathname.startsWith("/portfolio/")
  );
}

function getRouteLabel(pathname: string) {
  return pathname === "/" ? "/" : pathname;
}

function waitForPaint() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  });
}

export default function PageTransition() {
  const pathname = usePathname();

  const [visible, setVisible] = useState(true);
  const [route, setRoute] = useState(pathname);

  const initialRevealDone = useRef(false);
  const navigating = useRef(false);

  const currentPath = useRef(pathname);
  const previousPath = useRef(pathname);

  const startedAt = useRef<number>(performance.now());

  /*
   * ---------------------------------------------------------
   * INITIAL PAGE LOAD
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!isPublicRoute(pathname)) {
      setVisible(false);
      return;
    }

    if (initialRevealDone.current) {
      return;
    }

    const revealInitialPage = async () => {
      /*
       * Allow the actual page to mount and paint.
       */
      await waitForPaint();

      /*
       * Wait for fonts.
       */
      if ("fonts" in document) {
        try {
          await document.fonts.ready;
        } catch {
          // Ignore font readiness errors.
        }
      }

      /*
       * Allow layout to settle after fonts.
       */
      await waitForPaint();

      /*
       * Small minimum visual duration.
       *
       * This prevents an unpleasant one-frame flash,
       * but does NOT determine loading completion.
       */
      const elapsed = performance.now() - startedAt.current;
      const minimum = 700;

      if (elapsed < minimum) {
        await new Promise((resolve) =>
          setTimeout(resolve, minimum - elapsed),
        );
      }

      initialRevealDone.current = true;

      setVisible(false);
    };

    revealInitialPage();
  }, [pathname]);

  /*
   * ---------------------------------------------------------
   * DESTINATION READY
   * ---------------------------------------------------------
   */

  useEffect(() => {
    currentPath.current = pathname;

    if (previousPath.current === pathname) {
      return;
    }

    previousPath.current = pathname;

    if (!navigating.current) {
      return;
    }

    const revealDestination = async () => {
      /*
       * Wait until destination has rendered.
       */
      await waitForPaint();

      /*
       * Wait for fonts.
       */
      if ("fonts" in document) {
        try {
          await document.fonts.ready;
        } catch {
          // Ignore.
        }
      }

      /*
       * One additional paint for stable layout.
       */
      await waitForPaint();

      navigating.current = false;

      setVisible(false);
    };

    revealDestination();
  }, [pathname]);

  /*
   * ---------------------------------------------------------
   * INTERNAL NAVIGATION
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!isPublicRoute(pathname)) return;

    const handleClick = (event: MouseEvent) => {
      if (event.button !== 0) return;

      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const link = target?.closest("a");

      if (!link) return;

      const href = link.getAttribute("href");

      if (!href) return;

      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        link.hasAttribute("download")
      ) {
        return;
      }

      const url = new URL(href, window.location.origin);

      if (url.origin !== window.location.origin) {
        return;
      }

      if (!isPublicRoute(url.pathname)) {
        return;
      }

      if (url.pathname === currentPath.current) {
        return;
      }

      navigating.current = true;
      startedAt.current = performance.now();

      /*
       * Show transition BEFORE Next.js changes route.
       */
      flushSync(() => {
        setRoute(url.pathname);
        setVisible(true);
      });
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [pathname]);

  /*
   * ---------------------------------------------------------
   * BACK / FORWARD
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const handlePopState = () => {
      const nextPath = window.location.pathname;

      if (!isPublicRoute(nextPath)) return;

      if (nextPath === currentPath.current) return;

      navigating.current = true;
      startedAt.current = performance.now();

      flushSync(() => {
        setRoute(nextPath);
        setVisible(true);
      });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  /*
   * ---------------------------------------------------------
   * UI
   * ---------------------------------------------------------
   */

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key="fertechtive-transition"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: 0.55,
              ease: [0.76, 0, 0.24, 1],
            },
          }}
          className="pointer-events-none fixed inset-0 z-[99999] flex min-h-[100dvh] items-center justify-center overflow-hidden bg-black text-white"
          aria-hidden="true"
        >
          {/* =====================================================
              FRAME
          ===================================================== */}

          <div className="absolute inset-4 border border-white/[0.055] sm:inset-7 lg:inset-9" />

          {/* Corner marks */}

          <div className="absolute left-4 top-4 h-3 w-3 border-l border-t border-white/25 sm:left-7 sm:top-7 lg:left-9 lg:top-9" />

          <div className="absolute right-4 top-4 h-3 w-3 border-r border-t border-white/25 sm:right-7 sm:top-7 lg:right-9 lg:top-9" />

          <div className="absolute bottom-4 left-4 h-3 w-3 border-b border-l border-white/25 sm:bottom-7 sm:left-7 lg:bottom-9 lg:left-9" />

          <div className="absolute bottom-4 right-4 h-3 w-3 border-b border-r border-white/25 sm:bottom-7 sm:right-7 lg:right-9 lg:bottom-9" />

          {/* =====================================================
              MAIN
          ===================================================== */}

          <div className="relative flex w-full max-w-3xl flex-col items-center px-6 text-center sm:px-10">

            {/* Brand */}

            <motion.div
              initial={{
                opacity: 0,
                y: -8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex items-center gap-2.5"
            >
              <span className="h-1.5 w-1.5 bg-white" />

              <span className="text-[9px] font-medium uppercase tracking-[0.28em] text-white/55 sm:text-[10px]">
                Fertechtive
              </span>

              <span className="h-1.5 w-1.5 bg-white/20" />
            </motion.div>

            {/* System */}

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                duration: 0.35,
                delay: 0.08,
              }}
              className="mt-6 flex items-center gap-3"
            >
              <span className="text-[8px] font-medium uppercase tracking-[0.2em] text-white/25 sm:text-[9px]">
                System
              </span>

              <span className="h-px w-7 bg-white/15 sm:w-10" />

              <span className="text-[8px] font-medium uppercase tracking-[0.2em] text-white/25 sm:text-[9px]">
                Loading
              </span>
            </motion.div>

            {/* =====================================================
                ROUTE
            ===================================================== */}

            <div className="mt-7 w-full px-2 sm:mt-9 sm:px-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={route}
                  initial={{
                    opacity: 0,
                    y: 18,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -12,
                  }}
                  transition={{
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="mx-auto max-w-2xl"
                >
                  <p
                    className="
                      break-words
                      text-[clamp(1.75rem,5vw,4rem)]
                      font-medium
                      leading-[1.05]
                      tracking-[-0.045em]
                      text-white
                    "
                  >
                    {getRouteLabel(route)}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* =====================================================
                PROGRESS
            ===================================================== */}

            <div className="mt-10 w-full max-w-xl sm:mt-12">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="text-[8px] font-medium uppercase tracking-[0.2em] text-white/30 sm:text-[9px]">
                  Loading
                </span>

                <span className="text-[8px] font-medium uppercase tracking-[0.18em] text-white/20 sm:text-[9px]">
                  FRT / 01
                </span>
              </div>

              <div className="relative h-px w-full bg-white/10">
                <motion.div
                  initial={{
                    scaleX: 0,
                  }}
                  animate={{
                    scaleX: 1,
                  }}
                  transition={{
                    duration: 1.1,
                    ease: [0.76, 0, 0.24, 1],
                  }}
                  className="absolute inset-0 origin-left bg-white"
                />
              </div>
            </div>

            {/* =====================================================
                META
            ===================================================== */}

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                duration: 0.35,
                delay: 0.15,
              }}
              className="mt-3 flex w-full max-w-xl items-center justify-between text-[7px] font-medium uppercase tracking-[0.16em] text-white/20 sm:text-[8px]"
            >
              <span>Navigation</span>

              <span>2026</span>

              <span>Online</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}