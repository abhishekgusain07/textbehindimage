import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

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
            <Button
              onClick={() => navigate("/sign-in")}
              variant={"secondary"}
              className='bg-black text-white w-[8vw]'
            >
              Try Now
            </Button>
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
