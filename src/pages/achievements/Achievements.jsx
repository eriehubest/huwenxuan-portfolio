import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import Flip from "gsap/Flip.js";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger, SplitText } from "gsap/all";

gsap.registerPlugin(Flip, ScrollTrigger);

const Achievements = () => {
  const [hasCardClicked, setHasCardClicked] = useState(null);
  const prevCard = useRef('0')
  const currentCard = useRef('0')

  const root = useRef(null);

  useGSAP(() => {
    if (hasCardClicked === null)
      return;

    const group = document.querySelector(".card-container");

    const toggleElement = document.querySelector(`.card${currentCard.current}`);

    const toggle = () => {
      const state = Flip.getState(".card-container, .card");

      const gallery = document.querySelector('.squished');

      if (currentCard.current === prevCard.current) {
        gallery.prepend(toggleElement)

        gallery.classList.remove('flex-col');

        prevCard.current = '0';
      }

      else {
        if (prevCard.current !== '0') {
          const prevElement = document.querySelector(`.card${prevCard.current}`)
          gallery.prepend(prevElement);

          gallery.classList.add('flex-col');

          group.prepend(toggleElement);
        }
        else {
          group.prepend(toggleElement);

          gallery.classList.add('flex-col');
        }

        prevCard.current = currentCard.current;
      }

      Flip.from(state, {
        absolute: true,
        duration: 0.5,
        ease: "power1.inOut",
      });
    };

    toggle()
  }, [hasCardClicked]);

  useGSAP(() => {
    const ctx = gsap.context(()=>{
      const section = document.querySelector(".card-main-container");
      const cards = gsap.utils.toArray(".achievements .card");
  
      gsap.set(section, { perspective: 1000 });
      gsap.set(cards, { transformOrigin: "50% 100%", rotateX: 90, opacity: 0, y: 30 });
  
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".achievements",
          duration: 1,
          start: () => `start -=${window.innerHeight * 6}`,
          toggleActions: "play none none reverse",
          onUpdate: () => { console.log('update') }
        }
      })
      tl.to('.card', {
        rotateX: 0,
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
      });
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="achievements achievements-trigger relative top-0 left-0 overflow-hidden">
      <div className="achievement-description absolute w-screen h-screen top-0 left-0 flex-center z-0">
        <h1 className="text-[6rem]">
          Achievements
        </h1>
      </div>

      <div className="card-main-container w-screen h-screen relative z-10">
        <div className="card-container relative flex flex-between items-center w-full h-full">
          <div className="flex-1 flex w-full h-full squished">
            <div className="card card1 flex-2 flex-center w-full h-full bg-neutral-300 opacity-0"
              onClick={() => { setHasCardClicked(!hasCardClicked); currentCard.current = '1' }}>
              MT
            </div>
            <div className="card card2 flex-2 flex-center w-full h-full bg-blue-200 opacity-0"
              onClick={() => { setHasCardClicked(!hasCardClicked); currentCard.current = '2' }}
            >
              PJ
            </div>
            <div className="card card3 flex-2 flex-center w-full h-full bg-amber-100 opacity-0"
              onClick={() => { setHasCardClicked(!hasCardClicked); currentCard.current = '3' }}
            >
              CS
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Achievements;