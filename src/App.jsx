import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import { ReactLenis } from "lenis/react";
import { useRef } from "react";
import Header from "./Header";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, Observer, ScrollTrigger);

function App() {
  const container = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isSm: "(max-width: 640px)",
          isMd: "(min-width: 641px) and (max-width: 1024px)",
          isLg: "(min-width: 1025px)",
        },
        (context) => {
          const { isSm, isMd, isLg } = context.conditions;

          const colSize = isLg ? 4 : isMd ? 3 : 1;

          gsap.set(".grit-item-img", {
            scale: 1.1,
          });

          const gridItems = gsap.utils.toArray(".grid-item");
          // const gridImgs = gsap.utils.toArray(".grit-item-img");

          gridItems.forEach((item) => {
            const gridImg = item.querySelector(".grit-item-img");
            gsap.fromTo(
              gridImg,
              {
                yPercent: -10,
              },
              {
                scrollTrigger: {
                  trigger: item,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
                yPercent: 10,
              }
            );
          });

          if (isSm) return;

          const itemsQuickToArr = gridItems.map((item) => {
            return gsap.quickTo(item, "y", {
              duration: 0.5,
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
                item((i % colSize) * (self.velocityY / 50))
              );
            },
          });
        }
      );
    },
    { scope: container }
  );

  return (
    <>
      <ReactLenis root />
      <div ref={container} className="bg-amber-50">
        <Header />
        <main className="px-5 sm:px-8 lg:px-10 pt-24">
          <h2 className="font-display text-6xl sm:text-7xl lg:text-8xl font-bold uppercase">
            Crafted for living
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-y-16 sm:gap-x-24 sm:gap-y-32 lg:gap-x-32 lg:gap-y-40 overflow-clip py-10 border-t">
            {new Array(32).fill(1).map((_, i) => (
              <div
                className={"grid-item aspect-4/5 relative overflow-hidden"}
                key={`grid-item-${i}`}
              >
                <img
                  src={`/furniture/furniture-${i + 1}.jpg`}
                  alt={`Furniture-${i + 1}`}
                  className="grit-item-img absolute top-0 left-0 size-full object-cover"
                />
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
