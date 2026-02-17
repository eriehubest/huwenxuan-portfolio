import React, { useRef, useState } from "react";
import gsap from "gsap";
import Flip from "gsap/Flip.js";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger, SplitText } from "gsap/all";
import AnimationTracker from "../../javascript/three/AnimationTracker";

import "../../styles/compStyles/achievements.css";
import constants from "../../javascript/constants";

gsap.registerPlugin(Flip, ScrollTrigger);
gsap.ticker.lagSmoothing(0);

const cardInfo = ["Maths", "Computer Sciences", "Projects"];
const colorInfor = ["#FFDBBB", "#CCBEB1", "#997E67"];

const animationTracker = AnimationTracker.getInstance();

const Achievements = ({ ClickChangeFunction, HoverChangeFunction }) => {
  const [hasCardClicked, setHasCardClicked] = useState(null);
  const [currentCard, setCurrentCard] = useState("0");

  const prevCard = useRef("0");
  const root = useRef(null);
  const animTLRef = useRef(null);

  const startLayeredAnimation = () => {
    const container = root.current?.querySelector(
      `.card-info-1 .layered-animations`
    );
    if (!container) return;

    animTLRef.current?.kill();
    animTLRef.current = null;

    const shapeEls = container.querySelectorAll(".shape");
    const triangleEl = container.querySelector("polygon");
    if (!shapeEls.length || !triangleEl) return;

    const points = triangleEl
      .getAttribute("points")
      .trim()
      .split(/\s+/)
      .map(Number);

    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const rand = (min, max) => gsap.utils.random(min, max);
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const eases = [
      "power1.inOut",
      "circ.inOut",
      "sine.inOut",
      "elastic.out(1, 0.4)",
    ];

    const scaledTrianglePoints = (scale) =>
      `${points[0] * scale} ${points[1] * scale} ${points[2] * scale} ${points[3] * scale
      } ${points[4] * scale} ${points[5] * scale}`;

    const master = gsap.timeline();

    shapeEls.forEach((el) => {
      const circleEl = el.querySelector("circle");
      const rectEl = el.querySelector("rect");
      const polyEl = el.querySelector("polygon");

      const tl = gsap.timeline({ repeat: -1 });

      for (let i = 0; i < 100; i++) {
        const duration = rand(0.8, 1.6);
        const ease = pick(eases);

        const step = `step${i}`;
        tl.addLabel(step);

        tl.to(
          el,
          {
            x: rand(-4, 4) * rem,
            y: rand(-4, 4) * rem,
            rotation: rand(-180, 180),
            duration,
            ease,
          },
          step
        );

        if (circleEl) {
          tl.to(circleEl, { attr: { r: rand(24, 56) }, duration, ease }, step);
        }

        if (rectEl) {
          tl.to(
            rectEl,
            { attr: { width: rand(56, 96), height: rand(56, 96) }, duration, ease },
            step
          );
        }

        if (polyEl) {
          tl.to(
            polyEl,
            { attr: { points: scaledTrianglePoints(rand(0.9, 1.6)) }, duration, ease },
            step
          );
        }
      }

      master.add(tl, 0); // parallel with other shapes
    });

    animTLRef.current = master;
  };

  useGSAP(() => {
    if (hasCardClicked === null) return;

    const group = root.current?.querySelector(".card-container");
    const gallery = root.current?.querySelector(".squished");
    const toggleElement = root.current?.querySelector(`.card${currentCard}`);

    if (!group || !gallery || !toggleElement) return;

    const openP = (p) => {
      if (!p) return;
      gsap.killTweensOf(p);
      gsap.to(p, {
        flex: 3,
        opacity: 1,
        duration: 0.35,
        ease: "power2.inOut",
      });
    };

    const closeP = (p) => {
      if (!p) return;
      gsap.killTweensOf(p);
      gsap.to(p, {
        flex: 0,
        opacity: 0,
        duration: 0.25,
        ease: "power2.inOut",
      });
    };

    const toggle = () => {
      const state = Flip.getState(".card-container, .card");

      // stop layered animation when collapsing
      const stopLayered = () => {
        animTLRef.current?.kill();
        animTLRef.current = null;
      };

      if (currentCard === prevCard.current) {
        const currentP = root.current?.querySelector(`.card-info-${currentCard}`);
        closeP(currentP);

        gallery.prepend(toggleElement);
        gallery.classList.remove("flex-col");
        gallery.append(root.current?.querySelector(`.card3`));
        gallery.prepend(root.current?.querySelector(`.card1`));

        prevCard.current = "0";
        setCurrentCard("0");

        Flip.from(state, {
          absolute: true,
          duration: 0.5,
          ease: "power1.inOut",
        });

        return;
      }

      const cardParagraphCurrent = root.current?.querySelector(
        `.card-info-${currentCard}`
      );
      openP(cardParagraphCurrent);

      if (prevCard.current !== "0") {
        const prevElement = root.current?.querySelector(`.card${prevCard.current}`);
        gallery.prepend(prevElement);

        gallery.classList.add("flex-col");
        group.prepend(toggleElement);

        const cardParagraphPrev = root.current?.querySelector(
          `.card-info-${prevCard.current}`
        );
        closeP(cardParagraphPrev);
      } else {
        group.prepend(toggleElement);
        gallery.classList.add("flex-col");
      }

      prevCard.current = currentCard;

      Flip.from(state, {
        absolute: true,
        duration: 0.5,
        ease: "power1.inOut",
        onComplete: startLayeredAnimation,
      });
    };

    toggle();
  }, [currentCard, hasCardClicked]);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const section = root.current?.querySelector(".card-main-container");
      const cards = gsap.utils.toArray(root.current?.querySelectorAll(".achievements .card"));

      if (!section || !cards.length) return;

      gsap.set(section, { perspective: 1000 });
      gsap.set(cards, {
        transformOrigin: "50% 100%",
        rotateX: 90,
        opacity: 0,
        y: 30,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current?.querySelector(".achievements"),
          duration: 2,
          start: () => `top -=${window.innerHeight * 8}`,
          toggleActions: "play none none none",
          onEnter: (self) => {
            animationTracker.setProgress("achievements", self.progress, true);
            animationTracker.setFocus("achievements");
          },
          onEnterBack: () => {
            animationTracker.setFocus("achievements");
          },
        },
      });

      tl.to({}, { duration: 0.2 });

      tl.to(".card", {
        rotateX: 0,
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
      }).to(
        ".achievement-description",
        {
          opacity: 0,
          duration: 0.6,
        },
        "<"
      );
    }, root);

    return () => {
      animTLRef.current?.kill();
      animTLRef.current = null;
      ctx.revert();
    };
  }, []);

  const getCardData = (_info, _index) => {
    return (
      <div
        key={_index}
        className={`card card${_index + 1} flex-2 flex flex-col justify-around items-center w-full h-full opacity-0 overflow-hidden cursor-pointer`}
        style={{ backgroundColor: colorInfor[_index] }}
        onClick={() => {
          setHasCardClicked((v) => !v);
          setCurrentCard(String(_index + 1));
          ClickChangeFunction(true);
        }}
        onMouseEnter={() => HoverChangeFunction(true)}
        onMouseLeave={() => HoverChangeFunction(false)}
      >
        <h1 className="flex-1 text-[3rem] font-CDR transition-all text-center h-full flex-center pt-5">
          {_info}
        </h1>

        <div
          className={`flex-0 card-info-${_index + 1} undisplayed-seciton opacity-0 w-full h-full overflow-hidden p-5`}
          style={{ height: 0 }}
          dangerouslySetInnerHTML={{
            __html: constants.home.achievements[2][_index],
          }}
        />
      </div>
    );
  };

  return (
    <div ref={root} className="achievements achievements-trigger relative top-0 left-0 overflow-hidden">
      <div className="achievement-description absolute w-screen h-screen top-0 left-0 flex-center z-0">
        <h1 className="text-[6rem]">Achievements</h1>
      </div>

      <div className="card-main-container w-screen h-screen relative z-10">
        <div className="card-container relative flex flex-between items-center w-full h-full">
          <div className="flex-1 flex w-full h-full squished">
            {cardInfo.map((_data, _index) => getCardData(_data, _index))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
