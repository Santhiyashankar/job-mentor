import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <section className="flex flex-col items-center justify-center text-center px-6 py-24">
      <h2 className="text-4xl font-bold mb-4">
        Track Your Job Applications Smarter
      </h2>

      <p className="text-slate-600 max-w-xl mb-8">
        JobMentor helps students organize applications, track progress,
        and improve success with AI-powered insights.
      </p>

      <div className="flex gap-4">
        <Link
          to="/signup"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Get Started
        </Link>

        <Link
          to="/login"
          className="border border-slate-300 px-6 py-3 rounded-lg hover:bg-slate-100"
        >
          Sign In
        </Link>
      </div>
    </section>
  );
}
