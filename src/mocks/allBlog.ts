export const blogs = [
  {
    id: "69845bb6d65143f5f104aba2",
    title: "How to Implement Payment Gateway on PayPal",
    slug: "how-to-implement-payment-gateway-on-paypal",
    excerpt: `
      <h1 class="text-lg font-bold text-indigo-600">Happy Payments 🎉</h1>
      <p class="mt-2 text-slate-600">
        Learn how to integrate <strong>PayPal</strong> with 0% commission
        and start accepting payments globally.
      </p>
    `,
    stats: { likes: 12, comments: 4, views: 180 },
    author: { name: "Karthik" },
    category: { name: "Education" },
    coverImage: {
      url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d",
    },
    tags: [
      { id: "t1", name: "Payments" },
      { id: "t2", name: "PayPal" },
    ],
  },

  {
    id: "b2",
    title: "Build a MERN Stack Blog Application",
    slug: "build-a-mern-stack-blog-application",
    excerpt: `<p>Step-by-step guide to building a full-stack blog using MongoDB, Express, React, and Node.js.</p>`,
    stats: { likes: 32, comments: 9, views: 520 },
    author: { name: "Dhanush" },
    category: { name: "Web Development" },
    coverImage: {
      url: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    },
    tags: [
      { id: "t3", name: "MERN" },
      { id: "t4", name: "React" },
    ],
  },

  {
    id: "b3",
    title: "Mastering React Hooks in 2025",
    slug: "mastering-react-hooks",
    excerpt: `<p>Understand useState, useEffect, and custom hooks with real-world examples.</p>`,
    stats: { likes: 45, comments: 12, views: 890 },
    author: { name: "Hari" },
    category: { name: "Frontend" },
    coverImage: {
      url: "https://images.unsplash.com/photo-1587620962725-abab7fe55159",
    },
    tags: [{ id: "t5", name: "React" }],
  },

  {
    id: "b4",
    title: "Node.js Authentication with JWT",
    slug: "nodejs-authentication-with-jwt",
    excerpt: `<p>Secure your backend using JSON Web Tokens and best practices.</p>`,
    stats: { likes: 28, comments: 6, views: 410 },
    author: { name: "Karthik" },
    category: { name: "Backend" },
    coverImage: {
      url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    },
    tags: [
      { id: "t6", name: "Node.js" },
      { id: "t7", name: "JWT" },
    ],
  },

  {
    id: "b5",
    title: "Designing Clean UI with Tailwind CSS",
    slug: "designing-clean-ui-with-tailwind-css",
    excerpt: `<p>Create modern and responsive UIs faster using Tailwind CSS.</p>`,
    stats: { likes: 64, comments: 15, views: 1020 },
    author: { name: "Sneha" },
    category: { name: "UI/UX" },
    coverImage: {
      url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    },
    tags: [{ id: "t8", name: "Tailwind" }],
  },

  {
    id: "b6",
    title: "Understanding REST API Design",
    slug: "understanding-rest-api-design",
    excerpt: `<p>Learn REST principles, status codes, and API versioning.</p>`,
    stats: { likes: 21, comments: 3, views: 350 },
    author: { name: "Ravi" },
    category: { name: "API" },
    coverImage: {
      url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    },
    tags: [{ id: "t9", name: "REST" }],
  },

  {
    id: "b7",
    title: "How Git & GitHub Work Together",
    slug: "how-git-and-github-work",
    excerpt: `<p>Beginner-friendly guide to version control using Git and GitHub.</p>`,
    stats: { likes: 18, comments: 2, views: 290 },
    author: { name: "Anu" },
    category: { name: "DevOps" },
    coverImage: {
      url: "https://images.unsplash.com/photo-1531482615713-2afd69097998",
    },
    tags: [{ id: "t10", name: "Git" }],
  },

  {
    id: "b8",
    title: "MongoDB Schema Design Best Practices",
    slug: "mongodb-schema-design-best-practices",
    excerpt: `<p>Design scalable and efficient schemas for MongoDB applications.</p>`,
    stats: { likes: 39, comments: 8, views: 610 },
    author: { name: "Vijay" },
    category: { name: "Database" },
    coverImage: {
      url: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d",
    },
    tags: [{ id: "t11", name: "MongoDB" }],
  },

  {
    id: "b9",
    title: "Deploying React Apps with Vercel",
    slug: "deploying-react-apps-with-vercel",
    excerpt: `<p>One-click deployment guide for React apps using Vercel.</p>`,
    stats: { likes: 50, comments: 10, views: 980 },
    author: { name: "Nisha" },
    category: { name: "Deployment" },
    coverImage: {
      url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8",
    },
    tags: [{ id: "t12", name: "Vercel" }],
  },

  {
    id: "b10",
    title: "TypeScript for JavaScript Developers",
    slug: "typescript-for-javascript-developers",
    excerpt: `<p>Level up your JS skills with strong typing using TypeScript.</p>`,
    stats: { likes: 72, comments: 20, views: 1400 },
    author: { name: "Arjun" },
    category: { name: "Programming" },
    coverImage: {
      url: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
    },
    tags: [{ id: "t13", name: "TypeScript" }],
  },

  {
    id: "b11",
    title: "Implement Google OAuth in MERN",
    slug: "implement-google-oauth-in-mern",
    excerpt: `<p>Add secure Google login to your MERN application.</p>`,
    stats: { likes: 58, comments: 14, views: 1100 },
    author: { name: "Karthik" },
    category: { name: "Authentication" },
    coverImage: {
      url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    },
    tags: [{ id: "t14", name: "OAuth" }],
  },

  {
    id: "b12",
    title: "Understanding HTTP Status Codes",
    slug: "understanding-http-status-codes",
    excerpt: `<p>A complete guide to HTTP status codes and their meanings.</p>`,
    stats: { likes: 19, comments: 4, views: 300 },
    author: { name: "Priya" },
    category: { name: "Networking" },
    coverImage: {
      url: "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
    },
    tags: [{ id: "t15", name: "HTTP" }],
  },

  {
    id: "b13",
    title: "Clean Code Principles Every Developer",
    slug: "clean-code-principles",
    excerpt: `<p>Write readable, maintainable, and scalable code.</p>`,
    stats: { likes: 90, comments: 25, views: 1800 },
    author: { name: "Suresh" },
    category: { name: "Best Practices" },
    coverImage: {
      url: "https://images.unsplash.com/photo-1484417894907-623942c8ee29",
    },
    tags: [{ id: "t16", name: "Clean Code" }],
  },

  {
    id: "b14",
    title: "Build a Notification System with Socket.io",
    slug: "notification-system-with-socketio",
    excerpt: `<p>Create real-time notifications using Socket.io and Node.js.</p>`,
    stats: { likes: 41, comments: 11, views: 720 },
    author: { name: "Hari" },
    category: { name: "Realtime" },
    coverImage: {
      url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    },
    tags: [{ id: "t17", name: "Socket.io" }],
  },

  {
    id: "b15",
    title: "How to Write SEO Friendly Blog Posts",
    slug: "how-to-write-seo-friendly-blog-posts",
    excerpt: `<p>Improve your blog visibility with SEO best practices.</p>`,
    stats: { likes: 26, comments: 5, views: 430 },
    author: { name: "Meena" },
    category: { name: "SEO" },
    coverImage: {
      url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e",
    },
    tags: [{ id: "t18", name: "SEO" }],
  },

  {
    id: "b16",
    title: "Scaling Node.js Applications",
    slug: "scaling-nodejs-applications",
    excerpt: `<p>Techniques to scale Node.js apps for high traffic.</p>`,
    stats: { likes: 67, comments: 18, views: 1300 },
    author: { name: "Karthik" },
    category: { name: "Architecture" },
    coverImage: {
      url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    },
    tags: [{ id: "t19", name: "Scalability" }],
  },
];