import React, { useEffect, useLayoutEffect, useState, useRef } from 'react'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText, ScrollTrigger } from 'gsap/all';
import AnimationTracker from '../../javascript/three/AnimationTracker';

gsap.registerPlugin(SplitText, ScrollTrigger)

const animationTracker = AnimationTracker.getInstance();

const Menu = ({ setIsMouseClick, setIsHover, setShowSettings, isMouseClick, isHover, showSettings }) => {
    const topBarRef = useRef(null);
    const midBarRef = useRef(null);
    const botBarRef = useRef(null);

    // Menu Animation
    useGSAP(() => {
        let menuSplitText;

        const ctx = gsap.context(() => {
            const settingsContainer = document.querySelector('.settings');
            const settingsToggle = document.querySelector('.settings .toggle');
            const settingsPage = document.querySelector('.settings .settings-page');

            const top = topBarRef.current;
            const mid = midBarRef.current;
            const bot = botBarRef.current;
            if (!top || !mid || !bot) return;

            gsap.set([top, bot], { transformOrigin: "50% 50%" });

            const burgerForTl = gsap.timeline({ paused: true, defaults: { duration: 0.1, ease: "power2.out" } });
            burgerForTl
                .to(top, { y: 10, rotate: 45, background: '#ffffff' }, 0)
                .to(bot, { y: -10, rotate: -45, background: '#ffffff' }, 0)
                .to(mid, { opacity: 0, scaleX: 0, background: '#ffffff' }, 0);

            const burgerBackTl = gsap.timeline({ paused: true, defaults: { duration: 0.1, ease: "power2.out" } });
            burgerBackTl
                .to(top, { y: 0, rotate: 0, background: "#000000" }, 0)
                .to(bot, { y: 0, rotate: 0, background: "#000000" }, 0)
                .to(mid, { opacity: 1, scaleX: 1, background: "#000000" }, 0);

            menuSplitText = new SplitText(".settings-tag", {
                type: "chars",
                charsClass: "char",
            })


            if (showSettings === null) {
                settingsPage.classList.add('hidden')

                gsap.set(settingsPage, {
                    xPercent: -100,
                })

                return true;
            }

            if (showSettings) {
                settingsPage.classList.remove('hidden')
                settingsPage.classList.add('flex');

                gsap.killTweensOf(settingsPage)
                gsap.to(settingsPage, {
                    xPercent: 0,
                    ease: 'power2.out',
                    duration: 0.8
                })

                gsap.set(menuSplitText.chars, { yPercent: 100 });
                gsap.to(menuSplitText.chars, {
                    yPercent: 0,
                    duration: 1,
                    ease: 'power2.inOut',
                    stagger: 0.02,
                })

                burgerForTl.play();
            } else {
                gsap.killTweensOf(settingsPage);

                gsap.to(menuSplitText.chars, {
                    yPercent: 100,
                    duration: 0.3,
                    ease: 'power2.inOut',
                    stagger: 0.01,
                })

                gsap.to(settingsPage, {
                    xPercent: -100,
                    ease: 'power2.out',
                    duration: 1,
                    onComplete: () => {
                        settingsPage.classList.remove('flex');
                        settingsPage.classList.add('hidden');
                    }
                }, "<")

                burgerBackTl.play();
            }
        })

        return () => {
            ctx.revert();
        }
    }, [showSettings]);

    return (
        <div className="settings fixed z-1000 top-0 left-0 flex justify-start items-start">
            <div
                className="toggle relative click-toggle w-[30px] h-[30px] m-5 cursor-pointer flex flex-col justify-around items-center z-1001"
                onClick={() => { setIsMouseClick(true); setShowSettings(v => (v === null ? true : !v)); }}
                onMouseEnter={() => { setIsHover(true) }}
                onMouseLeave={() => { setIsHover(false) }}
            >
                <div ref={topBarRef} className="relative undeerline w-full bg-black h-[2px]"></div>
                <div ref={midBarRef} className="relative undeerline bg-black w-full h-[2px]"></div>
                <div ref={botBarRef} className="relative undeerline w-full bg-black h-[2px]"></div>
            </div>

            <div className={`settings-page inset-0 absolute top-0 left-0 w-screen h-screen flex justify-center items-center bg-neutral-700 p-20 text-white`}>
                <div className="relative current-display flex-1 max-w-full h-full flex flex-col justify-around items-center text-[6rem]">
                    <div className="relative w-full flex justify-start">
                        <h1 className='settings-tag overflow-hidden uppercase relative after:w-full after:h-[1px] after:absolute after:bottom-0 after:left-0 after:origin-bottom-right after:scale-x-0 after:bg-white after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100 dark:after:bg-white cursor-pointer'>
                            Home
                        </h1>
                    </div>
                    <div className="relative w-full flex justify-center">
                        <h1 className='settings-tag overflow-hidden uppercase relative after:w-full after:h-[1px] after:absolute after:bottom-0 after:left-0 after:origin-bottom-right after:scale-x-0 after:bg-white after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100 dark:after:bg-white cursor-pointer'>
                            My Journey
                        </h1>
                    </div>
                    <div className="relative w-full flex justify-center">
                        <h1 className='settings-tag overflow-hidden uppercase relative after:w-full after:h-[1px] after:absolute after:bottom-0 after:left-0 after:origin-bottom-right after:scale-x-0 after:bg-white after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100 dark:after:bg-white cursor-pointer'>
                            About Me
                        </h1>
                    </div>
                    <div className="relative w-full flex justify-end">
                        <h1 className='settings-tag overflow-hidden uppercase relative after:w-full after:h-[1px] after:absolute after:bottom-0 after:left-0 after:origin-bottom-right after:scale-x-0 after:bg-white after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100 dark:after:bg-white cursor-pointer'>
                            Certificate
                        </h1>
                    </div>
                </div>

                <div className="other-pages flex-1 w-full h-full">

                </div>
            </div>
        </div>
    )
}

export default Menu