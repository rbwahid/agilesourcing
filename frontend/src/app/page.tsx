import Image from "next/image";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white">
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 h-full w-full animate-pulse rounded-full bg-gradient-to-br from-agile-teal/10 via-transparent to-transparent blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 h-full w-full animate-pulse rounded-full bg-gradient-to-tl from-mint-accent/10 via-transparent to-transparent blur-3xl [animation-delay:1s]" />
      </div>

      {/* Decorative grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <main className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Logo */}
        <div className="mb-12 transform transition-transform duration-700 hover:scale-105">
          <Image
            src="/agilesourcing-logo.png"
            alt="AgileSourcing"
            width={280}
            height={80}
            priority
            className="h-auto w-auto max-w-[280px]"
          />
        </div>

        {/* Coming Soon Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-agile-teal/20 bg-agile-teal/5 px-4 py-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-agile-teal opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-agile-teal"></span>
          </span>
          <span className="text-sm font-medium tracking-wide text-agile-teal">
            LAUNCHING SOON
          </span>
        </div>

        {/* Heading */}
        <h1 className="mb-6 font-serif text-4xl font-semibold tracking-tight text-charcoal sm:text-5xl md:text-6xl">
          Something Amazing
          <br />
          <span className="bg-gradient-to-r from-agile-teal to-mint-accent bg-clip-text text-transparent">
            Is Coming
          </span>
        </h1>

        {/* Subheading */}
        <p className="mb-12 max-w-md text-lg text-charcoal-light">
          We&apos;re building the future of fashion design validation.
          Connect with suppliers and validate your designs with real market feedback.
        </p>

        {/* Divider */}
        <div className="mb-12 flex items-center gap-4">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-agile-teal/30"></div>
          <div className="h-1.5 w-1.5 rounded-full bg-agile-teal/40"></div>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-agile-teal/30"></div>
        </div>

        {/* Contact */}
        <p className="text-sm text-charcoal-light">
          Questions?{" "}
          <a
            href="mailto:hello@agilesourcing.ca"
            className="font-medium text-agile-teal transition-colors hover:text-mint-accent"
          >
            hello@agilesourcing.ca
          </a>
        </p>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-8 text-center text-xs text-charcoal-light/60">
        © {new Date().getFullYear()} AgileSourcing. All rights reserved.
      </footer>
    </div>
  );
}
