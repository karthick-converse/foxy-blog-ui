// src/mocks/singleBlog.ts

export const mockSingleBlog = {
  _id: "69846de13e5c633dac79a606",
  title: "How to Implement Payment Gateway on PayPal",
  slug: "how-to-implement-payment-gateway-on-paypal",
  excerpt: "0% commission rate and easy setup",
  contentHtml: 
  `
<table style=\"min-width: 317px;\"><colgroup><col style=\"min-width: 25px;\"><col style=\"width: 267px;\"><col style=\"min-width: 25px;\"></colgroup><tbody><tr><th colspan=\"1\" rowspan=\"1\"><p>bcxvncx</p></th><th colspan=\"1\" rowspan=\"1\" colwidth=\"267\"><p>vbncxvnbcv</p></th><th colspan=\"1\" rowspan=\"1\"><p>vcnbxcvb</p></th></tr><tr><td colspan=\"1\" rowspan=\"1\"><p>subash</p></td><td colspan=\"1\" rowspan=\"1\" colwidth=\"267\"><p>fdsfd</p></td><td colspan=\"1\" rowspan=\"1\"><p>gvfdg</p></td></tr><tr><td colspan=\"1\" rowspan=\"1\"><p>dfgdfgdf</p></td><td colspan=\"1\" rowspan=\"1\" colwidth=\"267\"><p>dfgdfg</p></td><td colspan=\"1\" rowspan=\"1\"><p>dfgdfgdf</p><p></p></td></tr></tbody></table><ul><li><p>hvcjhdbjhdsbfhjadsbfjhs</p></li><li><p>jhbhjsdbfhjsdbfhj</p></li><li><p>jfbvhjbvcjbdvf</p></li></ul><p style=\"text-align: center;\"><strong>bvhjbvhjbdfjhvbjh</strong></p>`
,
  coverImageUrl:
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1600&auto=format&fit=crop",

  galleryImageUrls: [
    "https://images.unsplash.com/photo-1556742111-a301076d9d18?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop",
  ],

  createdAt: "2026-02-05T10:16:01.302Z",

  author: {
    name: "Karthik",
  },

  category: {
    name: "Education",
    slug: "education",
  },

  stats: {
    views: 128,
    likes: 24,
    comments: 6,
  },

  tags: [
    { _id: "1", name: "Startup Life", slug: "startup-life" },
    { _id: "2", name: "Payments", slug: "payments" },
    { _id: "3", name: "PayPal", slug: "paypal" },
  ],

  relatedPosts: [
    {
      _id: "69845bb6d65143f5f104aba2",
      title: "Why Node.js is Great",
      slug: "why-node.js-is-great",
      excerpt: "Node.js is fast, scalable, and widely used in modern backends.",
      coverImageUrl:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    },
    {
      _id: "69845bb6d65143f5f104aba3",
      title: "Stripe vs PayPal: Which One to Choose?",
      slug: "stripe-vs-paypal",
      excerpt:
        "A detailed comparison between Stripe and PayPal payment gateways.",
      coverImageUrl:
        "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=1200&auto=format&fit=crop",
    },
  ],
};
