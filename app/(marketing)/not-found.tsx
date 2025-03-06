import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-black">404</h1>
      <Image
        src="/_static/illustrations/rocket-crashed.svg"
        alt="404"
        width={400}
        height={400}
        className="pointer-events-none mb-5 mt-6"
      />
      <p className="text-balance px-4 text-center text-2xl font-medium text-black">
        Page not found. Back to{" "}
        <Link
          href="/"
          className="text-black underline underline-offset-4"
        >
          Homepage
        </Link>
        .
      </p>
    </div>
  );
}
