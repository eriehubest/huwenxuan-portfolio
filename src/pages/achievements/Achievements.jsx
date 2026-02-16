import React, { useRef, useState } from "react";
import gsap from "gsap";
import Flip from "gsap/Flip.js";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger, SplitText } from "gsap/all";
import AnimationTracker from "../../javascript/three/AnimationTracker";

gsap.registerPlugin(Flip, ScrollTrigger);

const cardInfo = ["Maths", "Computer Sciences", "Projects"];
const colorInfor = ["#FFDBBB", "#CCBEB1", "#997E67"];

const animationTracker = AnimationTracker.getInstance();

const Achievements = () => {
  const [hasCardClicked, setHasCardClicked] = useState(null);
  const prevCard = useRef("0");
  const [currentCard, setCurrentCard] = useState("0");

  const root = useRef(null);

  useGSAP(() => {
    if (hasCardClicked === null) return;

    const group = document.querySelector(".card-container");
    const gallery = document.querySelector(".squished");
    const toggleElement = document.querySelector(`.card${currentCard}`);

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

      if (currentCard === prevCard.current) {
        // collapse current paragraph smoothly
        const currentP = document.querySelector(`.card-info-${currentCard}`);
        closeP(currentP);

        gallery.prepend(toggleElement);
        gallery.classList.remove("flex-col");
        gallery.append(document.querySelector(`.card3`));
        gallery.prepend(document.querySelector(`.card1`));

        prevCard.current = "0";
        setCurrentCard("0");
      } else {
        const cardParagraphCurrent = document.querySelector(
          `.card-info-${currentCard}`
        );
        openP(cardParagraphCurrent);

        if (prevCard.current !== "0") {
          const prevElement = document.querySelector(`.card${prevCard.current}`);
          gallery.prepend(prevElement);

          gallery.classList.add("flex-col");
          group.prepend(toggleElement);

          const cardParagraphPrev = document.querySelector(
            `.card-info-${prevCard.current}`
          );
          closeP(cardParagraphPrev);
        } else {
          group.prepend(toggleElement);
          gallery.classList.add("flex-col");
        }

        prevCard.current = currentCard;
      }

      Flip.from(state, {
        absolute: true,
        duration: 0.5,
        ease: "power1.inOut",
      });
    };

    toggle();
  }, [currentCard, hasCardClicked]);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const section = document.querySelector(".card-main-container");
      const cards = gsap.utils.toArray(".achievements .card");

      gsap.set(section, { perspective: 1000 });
      gsap.set(cards, {
        transformOrigin: "50% 100%",
        rotateX: 90,
        opacity: 0,
        y: 30,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".achievements",
          duration: 2,
          start: () => `top -=${window.innerHeight * 6}`,
          toggleActions: "play none none none",
          onEnter: (self) => {
            animationTracker.setProgress('achievements', self.progress, true);
          },
        },
      });

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
    });

    return () => ctx.revert();
  }, []);

  const getCardData = (_info, _index) => {
    return (
      <div
        key={_index}
        className={`card card${_index + 1} flex-3 flex flex-col justify-around items-center w-full h-full bg-[${colorInfor[_index]}] opacity-0 overflow-hidden hover:bg-[${colorInfor[_index]}]/80 cursor-pointer`}
        onClick={() => {
          setHasCardClicked((v) => !v);
          setCurrentCard(String(_index + 1));
        }}
      >
        <h1 className="flex-1 text-[3rem] font-CDR transition-all text-center h-full flex-center">
          {_info}
        </h1>

        {/* Minimal change: no hidden/flex toggles; animate height+opacity with GSAP */}
        <p
          className={`flex-0 card-info-${_index + 1} undisplayed-seciton opacity-0 overflow-hidden`}
          style={{ height: 0 }}
        >
          Paragraph
        </p>
      </div>
    );
  };

  return (
    <div className="achievements achievements-trigger relative top-0 left-0 overflow-hidden">
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
