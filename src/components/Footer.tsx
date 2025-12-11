/**
 * Footer Component
 * 
 * Simple footer with "Powered by the Overclock Accelerator" branding.
 * Displayed on all pages per FR-011.
 */

export default function Footer() {
  return (
    <footer className="border-t border-overcast-gray-dark/30 bg-overcast-black/50">
      <div className="container mx-auto flex h-16 items-center justify-center px-4">
        <p className="text-sm text-overcast-gray">
          Powered by the{' '}
          <a
            href="https://overclock.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-overcast-teal transition-colors hover:text-overcast-teal-dim"
          >
            Overclock Accelerator
          </a>
        </p>
      </div>
    </footer>
  );
}

