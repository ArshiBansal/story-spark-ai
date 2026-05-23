import React from "react";

type Props = {
  children: React.ReactNode;
  title: string;
  subtitle: string;
};

const AuthLayout = ({ children, title, subtitle }: Props) => {
  return (
    <div className="flex min-h-screen flex-row">
      
      {/* Left Branding Section */}
      <div className="relative flex w-full flex-col justify-center border-b border-zinc-800 bg-[#0B1120]/90 px-8 py-14 backdrop-blur-xl lg:min-h-screen lg:w-[45%] lg:border-b-0 lg:border-r lg:px-14">
        {/* Logo */}
        <a href="/" className="mb-10 inline-block">
          <h1 className="bg-gradient-to-r from-purple-300 via-indigo-300 to-blue-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent transition-all duration-300 hover:opacity-90">
            StorySparkAI
          </h1>
        </a>

        <div>
          <h1 className="text-3xl text-gray-100 font-bold">
            {title}
          </h1>

          <p className="mt-2 text-gray-400">
            {subtitle}
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="mt-10 grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-zinc-800 bg-white/5 p-5 shadow-lg shadow-black/10 transition-all duration-300 hover:border-indigo-500/30">
            <h3 className="text-2xl font-bold text-white">10K+</h3>

            <p className="mt-1 text-sm text-gray-400">Stories Generated</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-white/5 p-5 shadow-lg shadow-black/10 transition-all duration-300 hover:border-purple-500/30">
            <h3 className="text-2xl font-bold text-white">4.9★</h3>

            <p className="mt-1 text-sm text-gray-400">User Satisfaction</p>
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="bg-black flex flex-1 items-center justify-center p-6 md:w-[65%] md:p-8">
        <div className="w-full max-w-md py-8 md:py-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
