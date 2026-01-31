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
      ryxenTasks: 'Create/optimize Ryxen Instagram, TikTok, X, Threads, LinkedIn, YouTube, GitHub profiles',
      havenXTasks: 'Create/optimize HavenX Instagram, TikTok, X, Threads, LinkedIn, YouTube, GitHub profiles',
      learningResources: [
        { title: 'Social Media Profile Optimization', url: 'https://blog.hootsuite.com/how-to-optimize-social-media-profiles/' },
        { title: 'GitHub Profile README Guide', url: 'https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme' }
      ],
      outcome: '7 platforms set up per brand'
    },
    {
      dayNumber: 4,
      date: '2025-12-04',
      dayName: 'Thursday',
      focus: 'Automation Tool Setup - Buffer/Hootsuite',
      ryxenTasks: 'Set up Buffer/Hootsuite account, connect all 7 Ryxen platforms, test automation with 1 scheduled post',
      havenXTasks: 'Set up Buffer/Hootsuite account, connect all 7 HavenX platforms, test automation with 1 scheduled post',
      learningResources: [
        { title: 'Buffer Setup Guide - Connect All Platforms', url: 'https://buffer.com/help/articles/connect-social-accounts' },
        { title: 'How to Schedule Posts on Buffer', url: 'https://buffer.com/help/articles/how-to-schedule-posts' },
        { title: 'Hootsuite Setup Guide', url: 'https://help.hootsuite.com/hc/en-us/articles/360040314234-Connect-your-social-networks' }
      ],
      outcome: 'Automation tool configured - all platforms connected, test post scheduled'
    },
    {
      dayNumber: 5,
      date: '2025-12-05',
      dayName: 'Friday',
      focus: 'Content Pillars (Quick)',
      ryxenTasks: 'Define 3 Ryxen content pillars (keep it simple: wealth mindset, financial freedom, personal growth)',
      havenXTasks: 'Define 3 HavenX content pillars (keep it simple: automation tips, business systems, efficiency)',
      learningResources: [
        { title: 'Content Pillar Strategy', url: 'https://blog.hootsuite.com/content-pillars/' },
        { title: 'Content Pillar Framework - Buffer', url: 'https://buffer.com/library/content-pillars/' }
      ],
      outcome: '3 content pillars defined per brand (simple & actionable)'
    },
    {
      dayNumber: 6,
      date: '2025-12-06',
      dayName: 'Saturday',
      focus: 'Bios & About Sections',
      ryxenTasks: 'Write bios for all Ryxen platforms (use templates, keep it simple)',
      havenXTasks: 'Write bios for all HavenX platforms (use templates, keep it simple)',
      learningResources: [
        { title: 'How to Write a Bio', url: 'https://www.themuse.com/advice/how-to-write-a-bio' },
        { title: 'Instagram Bio Ideas', url: 'https://blog.hootsuite.com/instagram-bio-ideas/' }
      ],
      outcome: 'Bios written for all platforms (practical & simple)'
    },
    {
      dayNumber: 7,
      date: '2025-12-07',
      dayName: 'Sunday',
      focus: 'Week Reflection',
      ryxenTasks: 'Test automation: Schedule 1 test post to all Ryxen platforms via Buffer/Hootsuite',
      havenXTasks: 'Test automation: Schedule 1 test post to all HavenX platforms via Buffer/Hootsuite',
      learningResources: [
        { title: 'Buffer Best Times to Post', url: 'https://buffer.com/library/best-time-to-post' }
      ],
      outcome: 'Automation tested - 1 post scheduled to all platforms, ready for Week 2 content creation'
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

