// Format
// index 0: HTML tag to use
// index 1: Content
// index 2: Exported class (if exists)

const constants =
{
    timeline:
    {
        home:
            [
                0.1,
                0.3,
                0.2,
                0.1,
                0.2 + 1.5,
            ]
    },
    home:
    {
        hero:
            [
                // ['p', 'Portfolio of', 'hero-animate-up'],
                ['h1', 'Hu Wenxuan', 'hero-animate-up'],
                ['p', '- A Student Exploring Computer Sciences and Mathematical Thinking', 'hero-animate-down'],
            ],

        about:
            [
                [
                    ['li', 'How I think', 'h1'],
                    ['li', 'I\'m interested in computer sciences and mathematical thinking, particularly in how to practically implement abstract ideas.', 'p'],
                    ['li', 'Hu Wenxuan', 'p']
                ],
                [
                    ['li', 'Principles', 'h1'],
                    ['li', 'I break problems into structure, constraints, and trade-offs.', 'p'],
                    ['li', 'I test ideas by implementing them.', 'p'],
                    ['li', 'I refine designs until they are simple to extend and hard to break.', 'p'],
                ]
            ],

        journey:
            [
                ['p', '— Discovering structured problem solving <br />I began participating in mathematics competitions, starting with the UKMT series. This introduced me to structured problem-solving and the habit of breaking complex problems into smaller, manageable parts.'],
                ['p', '— Moving from solving to building <br />While continuing to receive consistent results in competitions, I started learning programming, initially through Python. Programming shifted my focus from solving static problems to building systems that evolve over time.'],
                ['p', '— Connecting abstraction with implementation <br />After competing in higher-level contests such as the JMO and SMC, I became increasingly interested in how mathematical structure appears in code. This led me toward web development and logical programming, where design decisions directly affect behaviour. '],
                ['p', '— Systems, interaction, and scale<br />I focused on improving my programming skills using tools such as React and Three.js, building interactive systems rather than isolated scripts. At the same time, I continued exploring mathematical problem-solving through the AMC 12, reinforcing the connection between abstraction and implementation. '],
            ],

        achievements:
            [
                [
                    {
                        id: "mercury",
                        name: "Mercury",
                        colorKey: "1",
                        text:
                            "The smallest planet in our solar system and closest to the Sun, Mercury is only slightly larger than Earth's Moon. With extreme temperatures ranging from -290°F to 800°F, this rocky world has a cratered surface similar to our Moon.",
                    },
                    {
                        id: "venus",
                        name: "Venus",
                        colorKey: "2",
                        text:
                            "Venus is the second planet from the Sun and is similar in size to Earth. Its thick atmosphere traps heat, making it the hottest planet in our solar system. The surface of Venus is a scorching 867°F.",
                    },
                    {
                        id: "earth",
                        name: "Earth",
                        colorKey: "6",
                        text:
                            "Earth is the third planet from the Sun and the only known planet to harbor life. It has a diverse environment with oceans, continents, and a protective atmosphere. The average surface temperature is about 61°F.",
                    },
                    {
                        id: "mars",
                        name: "Mars",
                        colorKey: "0",
                        text:
                            'Mars, the fourth planet from the Sun, is often called the "Red Planet" due to its rusty color. It has a thin atmosphere and a cold, desert-like surface with a temperature averaging -81°F.',
                    },
                    {
                        id: "jupiter",
                        name: "Jupiter",
                        colorKey: "3",
                        text:
                            "Jupiter is the largest planet in our solar system, a gas giant with a powerful atmosphere. It's known for its Great Red Spot, a giant storm. The cloud-top temperature is around -234°F.",
                    },
                    {
                        id: "saturn",
                        name: "Saturn",
                        colorKey: "4",
                        text:
                            "Saturn, the sixth planet from the Sun, is famous for its prominent rings made of ice and rock. It's a gas giant with a cloud-top temperature of about -288°F.",
                    },
                    {
                        id: "uranus",
                        name: "Uranus",
                        colorKey: "8",
                        text:
                            "Uranus is the seventh planet from the Sun and an ice giant. It rotates on its side, giving it unique seasons. The cloud-top temperature is around -357°F.",
                    },
                    {
                        id: "neptune",
                        name: "Neptune",
                        colorKey: "10",
                        text:
                            "Neptune is the eighth and farthest planet from the Sun. It's another ice giant with strong winds and a deep blue color. The cloud-top temperature is about -353°F.",
                    },
                ],
                [
                    ['p', '2022 - UKMT JMC Gold'],
                    ['p', '2023 - UKMT JMC Gold'],
                    ['p', '2023 - UKMT IMC Gold'],
                    ['p', '2023 - UKMT JMO Distinction'],
                    ['p', '2024 - UKMT IMC Gold'],
                    ['p', '2024 - UKMT Cayley Olympiad Merit'],
                    ['p', '2024 - UKMT SMC Gold'],
                    ['p', '2025 - AMC 12B Distinction'],
                ],
                [
                    [
                        `
                            <div class="w-full h-full bg-black/5 rounded-lg overflow-x-hidden flex">
                                <div class="certificates flex-1 w-full h-full flex flex-col justify-end items-center">
                                    <h1 class="flex-1 text-[2.2rem] flex-center">Achievements</h1>

                                    <ul class="h-full flex-2 mb-10 flex flex-col justify-around">
                                        <li class="bg-black/10 p-2 rounded-md">	•	AMC 12B — Distinction (Top 5%), 2025</li>
                                        <li class="bg-black/10 p-2 rounded-md">	•	UKMT SMC — Gold, 2025</li>
                                        <li class="bg-black/10 p-2 rounded-md">	•	UKMT IMC — Gold, 2023-2024</li>
                                        <li class="bg-black/10 p-2 rounded-md">	•	UKMT JMO — Distinction, 2023</li>
                                        <li class="bg-black/10 p-2 rounded-md">	•	Cayley Olympiad — Merit, 2024</li>
                                    </ul>
                                </div>

                                <div class="animation flex-1 w-full h-full flex justify-center items-center">
                                    <div class="layered-animations">
                                        <svg class="small shape color-red" viewBox="0 0 96 96">
                                            <rect width="48" height="48" x="24" y="24" fill-rule="evenodd" stroke-linecap="square"></rect>
                                        </svg>

                                        <svg class="small shape color-red" viewBox="0 0 96 96">
                                            <polygon fill-rule="evenodd" points="48 17.28 86.4 80.11584 9.6 80.11584" stroke-linecap="square"></polygon>
                                        </svg>

                                        <svg class="small shape color-red" viewBox="0 0 96 96">
                                            <circle cx="48" cy="48" r="32" fill-rule="evenodd" stroke-linecap="square"></circle>
                                        </svg>

                                        <svg class="shape" viewBox="0 0 96 96">
                                            <circle cx="48" cy="48" r="28" fill-rule="evenodd" stroke-linecap="square"></circle>
                                        </svg>

                                        <svg class="shape" viewBox="0 0 96 96">
                                            <rect width="48" height="48" x="24" y="24" fill-rule="evenodd" stroke-linecap="square"></rect>
                                        </svg>

                                        <svg class="shape" viewBox="0 0 96 96">
                                            <polygon fill-rule="evenodd" points="48 17.28 86.4 80.11584 9.6 80.11584" stroke-linecap="square"></polygon>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        `
                    ],
                    [
                        `
                            <div class="w-full h-full bg-black/5 rounded-lg overflow-x-hidden flex">
                                <div class="certificates flex-1 w-full h-full flex flex-col justify-end items-center">
                                    <h1 class="flex-1 text-[2.2rem] flex-center">Achievements</h1>

                                    <ul class="h-full flex-2 mb-10 flex flex-col justify-around">
                                        <li class="bg-black/10 p-2 rounded-md">	•	USACO Gold Qualifier</li>
                                        <li class="bg-black/10 p-2 rounded-md">	•	C++ Proficiency</li>
                                        <li class="bg-black/10 p-2 rounded-md">	•	Fluent with Javascript, WEBGL</li>
                                    </ul>
                                </div>

                                <div class="flex-1 w-full h-full">
                                    hi
                                </div>
                            </div>
                        `
                    ]
                ],

                [
                    [
                        `Achievemenets`
                    ]
                ]
            ]
    },
}

export default constants;