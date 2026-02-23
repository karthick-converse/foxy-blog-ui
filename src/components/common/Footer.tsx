export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-[1700px] px-6 py-5 sm:px-8 lg:px-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h2 className="text-lg font-bold text-gray-900">Foxy Blog</h2>
            <p className="mt-3 text-sm text-gray-500">
              A modern blogging platform to share knowledge, stories, and ideas
              with the world.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Explore</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li>
                <a href="/" className="hover:text-gray-900">
                  Home
                </a>
              </li>
              <li>
                <a href="/explore" className="hover:text-gray-900">
                  Explore Blogs
                </a>
              </li>
              <li>
                <a href="/add-blog" className="hover:text-gray-900">
                  Write a Blog
                </a>
              </li>
              <li>
                <a href="/bookmarks" className="hover:text-gray-900">
                  Bookmarks
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Resources</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li>
                <a href="/about" className="hover:text-gray-900">
                  About Us
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-gray-900">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-gray-900">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-gray-900">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Follow</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li>
                <a
                  href="#"
                  className="hover:text-gray-900"
                  target="_blank"
                  rel="noreferrer"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gray-900"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gray-900"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <footer className="mt-10 border-t pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Foxy Blog. All rights reserved.
        </footer>
      </div>
    </footer>
  );
}
