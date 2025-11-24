import { aboutContent } from "../constants/about";

export default function About() {
  return (
    <div className="w-full flex justify-center px-6 py-16">
      <div className="max-w-3xl text-center">
        <h1 className="text-3xl font-bold mb-8">About Tinné</h1>

        <p className="text-gray-700 leading-8 whitespace-pre-line text-lg">
          {aboutContent}
        </p>
      </div>
    </div>
  );
}
