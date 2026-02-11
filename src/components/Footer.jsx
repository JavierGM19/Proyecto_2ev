import { Link } from "react-router-dom";

function SocialIcon({ children }) {
  return (
    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600">
      {children}
    </span>
  );
}

export default function Footer() {
  return (
    <footer className="mt-14 border-t border-gray-200 bg-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 md:grid-cols-4 md:px-6">
        <div className="space-y-4">
          <Link to="/" className="text-2xl font-bold tracking-tight text-gray-900">
            react-ecomers
          </Link>
          <p className="max-w-xs text-sm text-gray-600">
            Modern design meets high-quality craftsmanship. We create timeless essentials for modern lifestyle.
          </p>
          <div className="flex items-center gap-2">
            <SocialIcon>@</SocialIcon>
            <SocialIcon>⤴</SocialIcon>
            <SocialIcon>💬</SocialIcon>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-gray-900">Shop</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>All Collections</li>
            <li>New Arrivals</li>
            <li>Accessories</li>
            <li>Sale</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-gray-900">Support</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>Order Status</li>
            <li>Shipping & Returns</li>
            <li>Contact Us</li>
            <li>FAQ</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-gray-900">Newsletter</h3>
          <p className="mb-3 text-sm text-gray-600">Get early access to drops.</p>
          <div className="flex items-center gap-2">
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none"
            />
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white"
              aria-label="Suscribirse"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 border-t border-gray-100 px-4 py-5 text-xs text-gray-500 md:flex-row md:justify-between md:px-6">
        <p>© 2024 react-ecomers studio. All rights reserved.</p>
        <div className="flex items-center gap-5">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
