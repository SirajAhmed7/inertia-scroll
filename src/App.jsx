import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ReactLenis } from "lenis/react";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText, Observer);

function App() {
  const container = useRef(null);
  const navHeading = useRef(null);

  useGSAP(
    (context, contextSafe) => {
      const headerTextAnimation = contextSafe(() => {
        const headingText = SplitText.create(navHeading.current, {
          type: "words,chars",
          mask: "chars",
          onSplit: (self) => {
            const charsToAnimate = self.chars.filter((char) => {
              return !self.words.some(
                (word) => word.firstChild?.firstChild === char
              );
            });

            let tl, tlRev;

            tl = gsap.timeline({
              paused: true,
            });

            tl.to(charsToAnimate, {
              xPercent: -105,
              duration: 0.8,
              ease: "power4.out",
            });

            tl.to(
              self.words[1].firstChild,
              {
                x: -self.words[0].getBoundingClientRect().width,
                duration: 1,
                ease: "power4.out",
              },
              "<"
            );

            tlRev = gsap.timeline({
              paused: true,
            });

            tlRev.to(charsToAnimate, {
              xPercent: 0,
              duration: 0.8,
              ease: "power4.out",
            });

            tlRev.to(
              self.words[1].firstChild,
              {
                x: 0,
                duration: 1,
                ease: "power4.out",
              },
              "<"
            );

            ScrollTrigger.create({
              trigger: container.current,
              start: "top -60px",
              onEnter: () => {
                // tlRev.pause();
                tl.restart();
              },
              onLeaveBack: () => {
                // tl.pause();
                tlRev.restart();
              },
            });
          },
        });
      });

      document.fonts.ready.then(headerTextAnimation);

      const gridItems = gsap.utils.toArray(".grid-item");

      const itemsQuickToArr = gridItems.map((item, i) => {
        return gsap.quickTo(item, "y", {
          duration: 0.4,
          ease: "power3.out",
        });
      });

      Observer.create({
        target: window,
        type: "wheel,scroll",
        onChange: (self) => {
          if (
            (window.scrollY === 0 && self.velocityY < 0) ||
            (window.scrollY >
              document.body.scrollHeight - window.innerHeight * 1.1 &&
              self.velocityY > 0)
          ) {
            itemsQuickToArr.forEach((item) => item(0));
            return;
          }

          itemsQuickToArr.forEach((item, i) =>
            item((i % 4) * (self.velocityY / 60))
          );
        },
      });
    },
    { scope: container }
  );

  return (
    <>
      <ReactLenis root />
      <div ref={container} className="bg-amber-50">
        <header className="fixed top-4 left-1/2 -translate-x-1/2 rounded-md bg-neutral-50/30 backdrop-blur-2xl px-3 py-1 w-full max-w-sm z-50">
          <div className="flex items-center justify-between">
            <h1
              ref={navHeading}
              className="text-2xl text-neutral-950 uppercase"
            >
              Inertia Scroll
            </h1>

            <a href="#" target="_blank" className="size-5 block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                // class="bi bi-github"
                viewBox="0 0 16 16"
                className="bi bi-github size-full"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
              </svg>
            </a>
          </div>
        </header>

        <main className="px-10 pt-24 pb-10">
          <div className="grid grid-cols-4 gap-x-32 gap-y-40 overflow-clip">
            {new Array(32).fill(1).map((_, i) => (
              <div
                className={
                  "grid-item bg-linear-to-br/oklch from-amber-400 to-orange-500 aspect-4/5"
                }
                key={`grid-item-${i}`}
              ></div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
