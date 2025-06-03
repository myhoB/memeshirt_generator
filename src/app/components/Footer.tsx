import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0B3954] text-[#FEFFFE] py-8 px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">MemeShirt</h3>
          <p className="text-[#BFD7EA]">
            Create your own custom meme t-shirts with our easy-to-use designer.
          </p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/terms" className="text-[#BFD7EA] hover:text-[#FEFFFE] transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-[#BFD7EA] hover:text-[#FEFFFE] transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-[#BFD7EA] hover:text-[#FEFFFE] transition-colors">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
          <div className="flex space-x-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-[#BFD7EA] hover:text-[#FEFFFE]">
              Twitter
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#BFD7EA] hover:text-[#FEFFFE]">
              Instagram
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-[#BFD7EA] text-center text-[#BFD7EA]">
        <p>&copy; {new Date().getFullYear()} MemeShirt. All rights reserved.</p>
      </div>
    </footer>
  );
} 