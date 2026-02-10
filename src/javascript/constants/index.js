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
    },
}

export default constants;