import { SiCaffeine } from 'react-icons/si';
import { Heart } from 'lucide-react';

export default function AppFooter() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' ? window.location.hostname : 'thunderlab';

  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>© {currentYear} Thunderlab. All rights reserved.</p>
        <a
          href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(appIdentifier)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-foreground transition-colors"
        >
          Built with <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" /> using caffeine.ai
        </a>
      </div>
    </footer>
  );
}
