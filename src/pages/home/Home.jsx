import React, { useEffect, useLayoutEffect, useState } from 'react'
import gsap from 'gsap'

import '../../styles/compStyles/home.css'
import constants from '../../javascript/constants'
import { useGSAP } from '@gsap/react'
import { SplitText, ScrollTrigger } from 'gsap/all'
import AnimationTracker from '../../javascript/three/AnimationTracker'
import Achievements from '../achievements/achievements'

gsap.registerPlugin(SplitText, ScrollTrigger)

const Home = () => {
    const [currentMaxJourney, setCurrentMaxJourney] = useState(0);

    useGSAP(() => {
        let heroUpSplitText;
        let heroDownSplitText;
        const ctx = gsap.context(() => {
            const animationTracker = AnimationTracker.getInstance();

            //
            // HERO
            //

            heroUpSplitText = new SplitText(".hero-animate-up", {
                type: "chars",
                charsClass: "char",
            })

            heroDownSplitText = new SplitText(".hero-animate-down", {
                type: "words",
                wordsClass: "word",
            })

            gsap.set(heroUpSplitText.chars, { yPercent: 100 })
            gsap.set(heroDownSplitText.words, { yPercent: -100 })

            gsap.to(heroUpSplitText.chars, {
                yPercent: 0,
                duration: 1,
                ease: "power4.out",
                stagger: 0.01,
            })

            gsap.to(heroDownSplitText.words, {
                yPercent: 0,
                duration: 1,
                ease: "power4.out",
                stagger: 0.05,
            })

            const heroTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,

                    onUpdate: (self) => {
                        // console.log(self.progress)
                        animationTracker.setProgress('home', self.progress)
                    }
                }
            })

            //
            // JOURNEY
            //

            const indicator = document.querySelector(".scrollIndicator");
            const dot = document.querySelector(".scrollDot");
            const yearDigitEl = document.querySelector(".yearDigit");

            const digits = ["2", "3", "4", "5"];
            const tp = constants.timeline.home;
            const timeFrames = gsap.utils.toArray(".time-frame");
            const timeTextCont = ".time-text-cont";

            const getTravel = () => {
                if (!indicator || !dot) return 0;
                return indicator.clientHeight - dot.clientHeight;
            };

            const journeyTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: ".scroll",
                    start: "top top",
                    end: () => `+=${window.innerHeight * 6}`,
                    pin: true,
                    scrub: true,
                    anticipatePin: 1,
                    pinSpacing: true,
                    // markers: true, 
                    onUpdate: (self) => {
                        const last = tp.reduce((sum, n) => sum + n, 0);
                        const restSum = tp.slice(0, -1).reduce((sum, n) => sum + n, 0);
                        const start = restSum / last;
                        const end = 1;

                        const p = gsap.utils.clamp(0, 1, (self.progress - start) / (end - start));
                        const idx = Math.min(digits.length - 1, Math.floor(p * digits.length));

                        const d = digits[idx];
                        document.querySelector(".yearDigit").textContent = d;
                        document.querySelector(".yearShadowDigit").textContent = d;

                        const shadow = document.querySelector(".yearShadow");
                        gsap.set(shadow, {
                            opacity: 0.5 + 0.25 * self.progress,
                            rotateX: 70 + 10 * self.progress,  // 70° -> 80°
                            y: 5 + 20 * self.progress
                        });
                    }
                }
            })

            gsap.set(".scrollIndicator", { scaleY: 0 })

            // Start Delay
            journeyTimeline.to({}, { duration: tp[0] });

            // Hide Description
            journeyTimeline.to(".about-section-text0", {
                xPercent: 100,
                opacity: 0,
                duration: tp[1],
            }).to(".about-section-text1", {
                xPercent: -100,
                opacity: 0,
                duration: tp[1],
            }, "<")

            // Show ScrollIndicator
            journeyTimeline.to(".scrollIndicator", {
                scaleY: 1,
                duration: tp[2],
                transformOrigin: "center center",
                ease: "none"
            })

            // Show Timeline Element
            journeyTimeline.to(dot, {
                opacity: 1,
                duration: tp[3],
            }).to('.time-text-cont', {
                translateX: 0,
                opacity: 1,
                duration: tp[3],
            }, "<")

            // Show Time Frames one by one
            journeyTimeline.to(".time-frame", {
                opacity: 1,
                duration: 0.2,
                stagger: 0.5,
            })

            // Move the time frame indicator
            journeyTimeline.to(dot, {
                y: () => getTravel(),
                ease: "none",
                duration: 0.2 + 0.5 * (document.querySelectorAll(".time-frame").length - 1),
            }, "<");

           ScrollTrigger.refresh();
        });

        return () => {
            heroUpSplitText?.revert?.();
            heroDownSplitText?.revert?.();
            ctx.revert();
        };
    }, []);

    useEffect(() => {
        setCurrentMaxJourney(constants.home.journey.length);
    }, []);

    useLayoutEffect(() => {
        ScrollTrigger.refresh();
    }, []);

    const constantMap = (_originalMap, containerClass = ``) => {
        return _originalMap.map((_content, _index) => {
            if (!_content[0] || !_content[1]) {
                console.warn('Error: Constant Naming Format Error')
                return;
            }

            if (!_content[2]) _content[2] = '';

            const Tag = _content[0]
            return (
                <Tag className={`${containerClass} ${_content[2]}`} key={_index}>{_content[1]}</Tag>
            );
        })
    }

    return (
        <div className='home-page relative'>

            <div className="hero relative">
                <div className="text">
                    {
                        constantMap(constants.home.hero, `overflow-hidden`)
                    }
                </div>
            </div>

            <div className="scroll h-screen w-screen relative">
                <div className="scrollIndicator w-px h-[85dvh] absolute top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] bg-black">
                    <div className="scrollDot absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-black will-change-transform opacity-0"></div>
                </div>

                <div className="about absolute opacity-100 flex items-center">
                    {
                        constants.home.about.map((_section, _sectionIndex) => {
                            return (<ul className="about-section flex-1 first w-full min-h-[30%] flex flex-col justify-between items-center overflow-hidden" key={_sectionIndex}>
                                {
                                    constantMap(constants.home.about[_sectionIndex], `about-inner-container about-section-text${_sectionIndex}`)
                                }
                            </ul>)
                        })
                    }
                </div>

                <div className="journey h-screen w-screen absolute flex items-center">
                    <div className="journey-time-text w-[50dvw] h-[100dvh] relative box-border flex flex-col justify-around">
                        <div className="yearBottom w-full flex-center overflow-hidden">
                            <div className="relative flex justify-center items-center overflow-visible px-10 opacity-50 text-[10rem] font-CDM">
                                <div className="yearWrap relative flex justify-center items-center overflow-visible opacity-100">
                                    <div className="time-text-cont translate-x-[150%] relative opacity-0">
                                        <span className="yearReal">
                                            202<div className="inline-block yearDigit w-[1ch]">2</div>
                                        </span>

                                        {/* shadow / projection */}
                                        <span className="yearShadow" aria-hidden="true">
                                            202<span className="yearShadowDigit">2</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="journey-items w-[50dvw] h-[85dvh] relative box-border px-5 flex flex-col justify-around">
                        {
                            constants.home.journey.map((_content, _index) => {
                                if (!_content[0] || !_content[1]) {
                                    console.warn('Error: Constant Naming Format Error')
                                    return;
                                }

                                const Tag = _content[0];
                                return <Tag key={_index} className="time-frame" dangerouslySetInnerHTML={{ __html: _content[1] }}></Tag>
                            })
                        }
                    </div>
                </div>
            </div>

            <Achievements />
        </div>
    )
}

export default Home;