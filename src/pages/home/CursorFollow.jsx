import React, { useEffect, useLayoutEffect, useState, useRef } from 'react'
import gsap from 'gsap'

import { useGSAP } from '@gsap/react';

const CursorFollow = ({ setIsHover, setIsMouseClick, isHover, isMouseClick }) => {
    // Cursor Follow
    useGSAP(() => {
        const dot = document.querySelector(".cursor-dot");
        if (!dot) return;

        gsap.set(dot, { xPercent: -50, yPercent: -50 });

        const xTo = gsap.quickTo(dot, "x", {
            duration: 0.3,
            ease: "power3.out"
        });

        const yTo = gsap.quickTo(dot, "y", {
            duration: 0.3,
            ease: "power3.out"
        });

        const move = (e) => {
            xTo(e.clientX + 40);
            yTo(e.clientY + 40);
        };

        window.addEventListener("mousemove", move);

        return () => {
            window.removeEventListener("mousemove", move);
        };
    }, []);

    // Mouse Click Animation
    useGSAP(() => {
        const ctx = gsap.context(() => {
            if (!isMouseClick)
                return;

            const cursorDot = document.querySelector('.cursor-dot');

            gsap.to(cursorDot, {
                width: 90,
                height: 90,
                duration: 0.15,
                // background: "#ffffff"
            })

            gsap.to(cursorDot, {
                width: isHover ? 75 : 60,
                height: isHover ? 75 : 60,
                duration: 0.14,
                // background: "#99a1af",
                onComplete: () => {
                    setIsMouseClick(false);
                }
            }, ">")
        })

        // console.log('changed')

        return () => { ctx.revert() };;
    }, [isMouseClick])

    // Mouse Hover Animation
    useGSAP(() => {
        const ctx = gsap.context(() => {
            if (isMouseClick) {
                return;
            }

            const cursorDot = document.querySelector('.cursor-dot');

            if (isHover) {
                gsap.to(cursorDot, {
                    width: 75,
                    height: 75,
                    opacity: 1,
                    duration: 0.2,
                })

                cursorDot.innerHTML = "Click"
            } else {
                gsap.to(cursorDot, {
                    width: 60,
                    height: 60,
                    opacity: 1,
                    duration: 0.2,
                })

                cursorDot.innerHTML = "Scroll"
            }
        })

        return () => ctx.revert();
    }, [isHover])
    return (
        <div className={`cursor-dot pointer-events-none fixed top-0 left-0 rounded-full backdrop-blur-2xl bg-white/90 z-9999 translate-x-[50%] flex-center border border-black`} >
            Scroll
        </div>
    )
}

export default CursorFollow