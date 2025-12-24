import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useRef } from "react";

gsap.registerPlugin(SplitText);

function Header() {
  const navHeading = useRef(null);

  useGSAP((context, contextSafe) => {
    const headerTextAnimation = contextSafe(() => {
      SplitText.create(navHeading.current, {
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
          tl.to(
            self.words[2].firstChild,
            {
              x: -(
                self.words[0].getBoundingClientRect().width +
                self.words[1].getBoundingClientRect().width -
                6
              ),
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
          tlRev.to(
            self.words[2].firstChild,
            {
              x: 0,
              duration: 1,
              ease: "power4.out",
            },
            "<"
          );

          ScrollTrigger.create({
            trigger: document.body,
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
  });

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 rounded-md bg-amber-50/40 backdrop-blur-2xl px-3 py-1 w-[calc(100%-40px)] md:w-full sm:max-w-sm z-50">
      <div className="flex items-center justify-between">
        <h1
          ref={navHeading}
          className="font-display text-3xl text-neutral-900 font-semibold uppercase"
        >
          Inertia Scroll <span className="font-normal">Demo</span>
        </h1>

        <a
          href="https://github.com/SirajAhmed7/inertia-scroll"
          target="_blank"
          className="size-5 block"
        >
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
  );
}

export default Header;
