// Complete journey data with all links, quizzes, and details
// This supplements the main journeyData.js file

// Dual Brand Complete Data with All Links
export const dualBrandCompleteData = {
  week1: [
    {
      dayNumber: 1,
      date: '2025-12-01',
      dayName: 'Monday',
      focus: 'Brand Identity',
      ryxenTasks: 'Define Ryxen mission, values, target persona',
      havenXTasks: 'Define HavenX mission, positioning, ideal client',
      learningResources: [
        { title: 'How to Build a Personal Brand', url: 'https://www.youtube.com/watch?v=Z_4VkH17XoM' }
      ],
      outcome: 'Mission statements for both brands'
    },
    {
      dayNumber: 2,
      date: '2025-12-02',
      dayName: 'Tuesday',
      focus: 'Visual Identity',
      ryxenTasks: 'Design Ryxen logo concept, color palette',
      havenXTasks: 'Design HavenX logo concept, brand guidelines',
      learningResources: [
        { title: 'Logo Design Basics', url: 'https://www.canva.com/learn/logo-design/' }
      ],
      outcome: 'Logo concepts + brand guidelines'
    },
    {
      dayNumber: 3,
      date: '2025-12-03',
      dayName: 'Wednesday',
      focus: 'Platform Setup - Social',
      ryxenTasks: 'Create/optimize Ryxen Instagram, X, TikTok profiles',
      havenXTasks: 'Create/optimize HavenX LinkedIn, X, Instagram profiles',
      learningResources: [
        { title: 'Social Media Profile Optimization', url: 'https://blog.hootsuite.com/how-to-optimize-social-media-profiles/' }
      ],
      outcome: '3 platforms set up per brand'
    },
    {
      dayNumber: 4,
      date: '2025-12-04',
      dayName: 'Thursday',
      focus: 'Platform Setup - Video',
      ryxenTasks: 'Create Ryxen YouTube channel, optimize description',
      havenXTasks: 'Create HavenX YouTube channel, optimize description',
      learningResources: [
        { title: 'YouTube Channel Setup', url: 'https://www.youtube.com/watch?v=UZ2fkdFzN8s' }
      ],
      outcome: 'YouTube channels live'
    },
    {
      dayNumber: 5,
      date: '2025-12-05',
      dayName: 'Friday',
      focus: 'Content Pillars',
      ryxenTasks: 'Define 5 Ryxen content pillars (wealth, mindset, skills, etc.)',
      havenXTasks: 'Define 5 HavenX content pillars (automation, systems, etc.)',
      learningResources: [
        { title: 'Content Pillar Strategy', url: 'https://blog.hootsuite.com/content-pillars/' }
      ],
      outcome: 'Content pillar documents'
    },
    {
      dayNumber: 6,
      date: '2025-12-06',
      dayName: 'Saturday',
      focus: 'Bios & About Sections',
      ryxenTasks: 'Write compelling bios for all Ryxen platforms',
      havenXTasks: 'Write compelling bios for all HavenX platforms',
      learningResources: [
        { title: 'How to Write a Bio', url: 'https://www.themuse.com/advice/how-to-write-a-bio' }
      ],
      outcome: 'Optimized bios across platforms'
    },
    {
      dayNumber: 7,
      date: '2025-12-07',
      dayName: 'Sunday',
      focus: 'Week Reflection',
      ryxenTasks: 'Review week\'s foundation work, plan content calendar',
      havenXTasks: 'Review week\'s foundation work, plan content calendar',
      learningResources: [
        { title: 'Content Calendar Template', url: 'https://coschedule.com/content-calendar-template' }
      ],
      outcome: 'Week 1 foundation complete'
    }
  ]
}

// Software Engineering Quiz Data
export const softwareEngineeringQuizzes = {
  week1: {
    day1: {
      questions: [
        {
          category: 'Foundation',
          question: 'What is the purpose of the `<!DOCTYPE html>` declaration?',
          options: [
            'It tells the browser which version of HTML to use',
            'It\'s required for HTML5 validation',
            'It enables modern browser features',
            'All of the above'
          ],
          correctAnswer: 3,
          explanation: 'The DOCTYPE declaration tells browsers which HTML version to use, is required for validation, and enables modern features.'
        },
        {
          category: 'Structure',
          question: 'Which HTML5 element should be used for the main content of a page?',
          options: [
            '<div class="main">',
            '<main>',
            '<section>',
            '<article>'
          ],
          correctAnswer: 1,
          explanation: 'The <main> element is the semantic HTML5 element specifically designed for the main content of a page.'
        },
        {
          category: 'Advanced',
          question: 'What is the difference between <article> and <section>?',
          options: [
            '<article> is for standalone content, <section> is for thematic grouping',
            'They are interchangeable',
            '<section> must always contain <article>',
            '<article> is only for blog posts'
          ],
          correctAnswer: 0,
          explanation: '<article> represents standalone, independently distributable content, while <section> is for thematic grouping of content.'
        },
        {
          category: 'Integration',
          question: 'How do you create an accessible link that opens in a new tab?',
          options: [
            '<a href="url" target="_blank">',
            '<a href="url" target="_blank" rel="noopener noreferrer">',
            '<a href="url" newtab>',
            '<a href="url" target="new">'
          ],
          correctAnswer: 1,
          explanation: 'Using rel="noopener noreferrer" prevents security vulnerabilities and is the accessible way to open links in new tabs.'
        },
        {
          category: 'Applied Reasoning',
          question: 'Why is semantic HTML important for SEO and accessibility?',
          options: [
            'Search engines understand content structure better',
            'Screen readers can navigate pages more effectively',
            'It improves code maintainability',
            'All of the above'
          ],
          correctAnswer: 3,
          explanation: 'Semantic HTML benefits SEO, accessibility, and code maintainability - making it essential for modern web development.'
        }
      ]
    },
    day2: {
      questions: [
        {
          category: 'Foundation',
          question: 'What is the default value of the `box-sizing` property?',
          options: ['border-box', 'content-box', 'padding-box', 'margin-box'],
          correctAnswer: 1,
          explanation: 'The default box-sizing is content-box, which means width/height only includes content, not padding or border.'
        },
        {
          category: 'Structure',
          question: 'Which CSS unit is relative to the root element\'s font size?',
          options: ['em', 'rem', 'px', '%'],
          correctAnswer: 1,
          explanation: 'rem (root em) is relative to the root element\'s font size, making it more predictable than em.'
        },
        {
          category: 'Advanced',
          question: 'What is the specificity of the selector `.card .title:hover`?',
          options: ['21', '22', '30', '31'],
          correctAnswer: 1,
          explanation: 'Two classes (10 each) + one pseudo-class (1) + one element (1) = 22 specificity points.'
        },
        {
          category: 'Integration',
          question: 'How do you center an element horizontally using CSS?',
          options: [
            'margin: 0 auto; (for block elements)',
            'text-align: center; (for inline elements)',
            'Both a and b depending on element type',
            'display: center;'
          ],
          correctAnswer: 2,
          explanation: 'Block elements use margin: 0 auto, while inline elements use text-align: center.'
        },
        {
          category: 'Applied Reasoning',
          question: 'Why should you use `rem` instead of `px` for font sizes?',
          options: [
            'Better accessibility (respects user font size preferences)',
            'Easier to scale entire design',
            'More maintainable code',
            'All of the above'
          ],
          correctAnswer: 3,
          explanation: 'rem units provide better accessibility, scalability, and maintainability compared to fixed px values.'
        }
      ]
    }
  }
}

// Software Engineering Complete Daily Data Structure
export const softwareEngineeringDailyData = {
  week1: {
    day1: {
      theme: 'HTML5 Semantic Structure & Document Anatomy',
      dailyLearning: {
        title: 'HTML5 Fundamentals (60 minutes)',
        topics: [
          'HTML document structure: <!DOCTYPE html>, <html>, <head>, <body>',
          'Semantic HTML5 elements: <header>, <nav>, <main>, <article>, <section>, <aside>, <footer>',
          'Text elements: headings (<h1>-<h6>), paragraphs (<p>), lists (<ul>, <ol>, <dl>)',
          'Links and navigation: <a>, href attributes, relative vs absolute paths',
          'Images: <img>, alt attributes, srcset for responsive images',
          'Forms: <form>, <input> types, <label>, <button>, <textarea>, <select>',
          'Metadata: <meta> tags, Open Graph, SEO basics',
          'Accessibility: ARIA labels, semantic structure, keyboard navigation'
        ],
        resources: [
          { title: 'MDN HTML5 Elements', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element', time: '30 min' },
          { title: 'MDN Semantic HTML', url: 'https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantic_elements', time: '20 min' },
          { title: 'HTML5 Doctor', url: 'http://html5doctor.com/', time: '20 min' },
          { title: 'MDN CSS Basics', url: 'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics', time: '30 min' }
        ]
      },
      cursorWorkflow: {
        setupCommands: [
          'mkdir week-01-day-01',
          'cd week-01-day-01',
          'mkdir css js images',
          'touch index.html css/style.css'
        ],
        prompts: [
          'Generate a semantic HTML5 document structure with header, nav, main, and footer sections',
          'Create an accessible navigation menu with proper ARIA labels',
          'Add meta tags for SEO including Open Graph tags',
          'Generate a contact form with proper input types and labels',
          'Refactor this HTML to use semantic elements instead of divs'
        ],
        refactoringTasks: [
          'Convert div-based layouts to semantic HTML5',
          'Add proper alt text to all images',
          'Ensure all interactive elements have proper labels',
          'Validate HTML using Cursor\'s built-in validation'
        ]
      },
      miniProject: {
        title: 'Personal Introduction Page',
        description: 'Build a single-page HTML document that introduces yourself.',
        requirements: [
          'Semantic HTML5 structure',
          'Header with your name and title',
          'Navigation menu (even if single page)',
          'About section with text content',
          'Skills/interests section using lists',
          'Contact form (styling comes later)',
          'Footer with copyright'
        ],
        mustHave: [
          'Valid HTML5',
          'All images have alt text',
          'Proper heading hierarchy (h1 → h2 → h3)',
          'Accessible form labels',
          'Semantic elements only (no div soup)'
        ]
      },
      monetization: {
        task: 'Create a simple HTML template that could be sold on ThemeForest or similar marketplace.',
        actionItems: [
          'Build a clean, professional single-page template',
          'Document it with comments',
          'Create a README explaining the structure',
          'Take screenshots for portfolio',
          'List it on GitHub with proper description'
        ]
      },
      socialPosting: {
        text: 'Day 1 of my 90-day software engineering journey complete! 🚀 Just built my first semantic HTML5 page from scratch. Learning the foundations that will power everything else. #WebDev #HTML5 #90DayChallenge #CodeNewbie',
        platforms: ['Twitter/X', 'LinkedIn', 'Dev.to', 'GitHub']
      },
      reflection: {
        questions: [
          'What was the most challenging concept today?',
          'How does semantic HTML differ from what you knew before?',
          'What questions do you still have?',
          'What are you most excited to learn next?'
        ]
      }
    }
  }
}

