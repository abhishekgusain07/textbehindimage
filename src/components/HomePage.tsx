import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <main className="flex flex-1 flex-col items-start mt-3 md:mt-1 justify-center">
      <section className="w-full py-7 md:py-15">
        <div className="container mx-auto px-4 text-center sm:px-6">
          <h1 className="text-4xl font-bold leading-tight tracking-tighter sm:text-5xl md:text-6xl md:leading-tight">
            Auto Insert{' '}
            <span className="relative inline-block text-blue-400">
              text between
              <svg
                className="absolute -bottom-1.5 left-0 w-full md:-bottom-2"
                height="8"
                viewBox="0 0 230 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.39832 6.75C29.8394 2.03125 119.95 -2.34375 228.602 5.25"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </span>{' '}
            your images
          </h1>
          <p className="mx-auto pl-4 pr-4 md:p-0 mt-4 max-w-lg md:max-w-xl text-xs text-slate-600 md:text-lg">
            Create pov-style Youtube thumbnails and other social media posts
            that actually go viral.
          </p>
          <div className="mt-8 flex flex-row items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <button
              data-slot="button"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20  aria-invalid:border-destructive shadow-xs h-9 px-4 py-2 has-[>svg]:px-3 bg-black text-white hover:bg-slate-800 sm:w-auto"
              onClick={() => navigate('/sign-in')}
            >
              Try Now
            </button>
            <a
              data-slot="button"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20  aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground  h-9 px-4 py-2 has-[>svg]:px-3"
              href="https://youtu.be/iedOUP4Kl0U"
            >
              Demo
            </a>
          </div>
        </div>
      </section>
      <section className="mb-6 mx-auto">
        <div className="w-full items-start overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start max-w-5xl mx-auto gap-10 py-10 px-2">
            <div className="grid gap-10">
              <div
                className="cursor-pointer"
                style={{ transform: 'translateY(-50px)' }}
              >
                <img
                  alt="thumbnail"
                  loading="lazy"
                  width="400"
                  height="400"
                  decoding="async"
                  data-nimg="1"
                  className="h-auto w-full object-cover rounded-lg"
                  style={{ color: 'transparent' }}
                  src="/compare-images/a.jpg"
                />
              </div>
              <div
                className="cursor-pointer"
                style={{ transform: 'translateY(-50px)' }}
              >
                <img
                  alt="thumbnail"
                  loading="lazy"
                  width="400"
                  height="400"
                  decoding="async"
                  data-nimg="1"
                  className="h-auto w-full object-cover rounded-lg"
                  style={{ color: 'transparent' }}
                  src="/compare-images/b.jpg"
                />
              </div>
              <div
                className="cursor-pointer"
                style={{ transform: 'translateY(-50px)' }}
              >
                <img
                  alt="thumbnail"
                  loading="lazy"
                  width="400"
                  height="400"
                  decoding="async"
                  data-nimg="1"
                  className="h-auto w-full object-cover rounded-lg"
                  style={{ color: 'transparent' }}
                  src="/compare-images/c.jpg"
                />
              </div>
            </div>
            <div className="grid gap-10">
              <div
                className="cursor-pointer"
                style={{ transform: 'translateY(50px)' }}
              >
                <img
                  alt="thumbnail"
                  loading="lazy"
                  width="400"
                  height="400"
                  decoding="async"
                  data-nimg="1"
                  className="h-auto w-full object-cover rounded-lg"
                  style={{ color: 'transparent' }}
                  src="/compare-images/d.png"
                />
              </div>
              <div
                className="cursor-pointer"
                style={{ transform: 'translateY(50px)' }}
              >
                <img
                  alt="thumbnail"
                  loading="lazy"
                  width="400"
                  height="400"
                  decoding="async"
                  data-nimg="1"
                  className="h-auto w-full object-cover rounded-lg"
                  style={{ color: 'transparent' }}
                  src="/compare-images/e.jpg"
                />
              </div>
              <div
                className="cursor-pointer"
                style={{ transform: 'translateY(50px)' }}
              >
                <img
                  alt="thumbnail"
                  loading="lazy"
                  width="400"
                  height="400"
                  decoding="async"
                  data-nimg="1"
                  className="h-auto w-full object-cover rounded-lg"
                  style={{ color: 'transparent' }}
                  src="/compare-images/f.jpg"
                />
              </div>
            </div>
            <div className="grid gap-10">
              <div
                className="cursor-pointer"
                style={{ transform: 'translateY(-50px)' }}
              >
                <img
                  alt="thumbnail"
                  loading="lazy"
                  width="400"
                  height="400"
                  decoding="async"
                  data-nimg="1"
                  className="h-auto w-full object-cover rounded-lg"
                  style={{ color: 'transparent' }}
                  src="/compare-images/g.png"
                />
              </div>
              <div
                className="cursor-pointer"
                style={{ transform: 'translateY(-50px)' }}
              >
                <img
                  alt="thumbnail"
                  loading="lazy"
                  width="400"
                  height="400"
                  decoding="async"
                  data-nimg="1"
                  className="h-auto w-full object-cover rounded-lg"
                  style={{ color: 'transparent' }}
                  src="/compare-images/h.png"
                />
              </div>
              <div
                className="cursor-pointer"
                style={{ transform: 'translateY(-50px)' }}
              >
                <img
                  alt="thumbnail"
                  loading="lazy"
                  width="400"
                  height="400"
                  decoding="async"
                  data-nimg="1"
                  className="h-auto w-full object-cover rounded-lg"
                  style={{ color: 'transparent' }}
                  src="/compare-images/i.png"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
