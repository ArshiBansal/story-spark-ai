import React from "react";

type Props = {
  children: React.ReactNode;
  title: string;
  subtitle: string;
};

const AuthLayout = ({ children, title, subtitle }: Props) => {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#050816] lg:flex-row">
      {/* Background Glow Effects */}
      <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-purple-500/10 blur-3xl"></div>

      <div className="absolute bottom-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-blue-500/10 blur-3xl"></div>

      {/* Left Branding Section */}
      <div className="relative flex w-full flex-col justify-center border-b border-zinc-800 bg-[#0B1120]/90 px-8 py-14 backdrop-blur-xl lg:min-h-screen lg:w-[45%] lg:border-b-0 lg:border-r lg:px-14">
        {/* Logo */}
        <a href="/" className="mb-10 inline-block">
          <h1 className="bg-gradient-to-r from-purple-300 via-indigo-300 to-blue-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent transition-all duration-300 hover:opacity-90">
            StorySparkAI
          </h1>
        </a>

        {/* Badge */}
        <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2">
          <div className="h-2 w-2 rounded-full bg-indigo-400"></div>

          <span className="text-sm font-medium text-indigo-300">
            AI Powered Creative Platform
          </span>
        </div>

        {/* Main Content */}
        <div className="max-w-xl space-y-5">
          <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
            {title}
          </h1>

          <p className="max-w-lg text-base leading-relaxed text-gray-400 md:text-lg">
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
      <div className="relative flex flex-1 items-center justify-center px-5 py-10 md:px-8 lg:px-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
