import { getSortedToolsData } from '@/lib/tools';
import Link from 'next/link';

export default function Home() {
  const allToolsData = getSortedToolsData();

  return (
    <div className="min-h-screen bg-background text-textlight font-sans">
      <main className="container mx-auto p-4 py-8">
        <h1 className="text-5xl font-bold mb-10 text-center text-primary tracking-wide">AI Audio & Video Tools Navigator</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allToolsData.map((tool) => (
            <div key={tool.slug} className="bg-card border border-border rounded-xl p-6 hover:shadow-primary-glow hover:border-primary transition-all duration-300 group relative">
              {/* Internal link to detail page - covers the main card area */}
              <Link href={`/tool/${tool.slug}`} className="absolute inset-0 z-10" aria-label={`View ${tool.name} Details`}></Link>
              
              <h2 className="text-3xl font-semibold mb-2 text-textlight group-hover:text-primary transition-colors duration-300">{tool.name}</h2>
              <p className="text-sm text-textdark mb-2">
                Category: <span className="font-medium text-secondary">{tool.category}</span>
              </p>
              <p className="text-textlight mb-4 text-lg">{tool.one_liner}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {tool.tags && tool.tags.map(tag => (
                  <span key={tag} className="bg-blue-800 bg-opacity-30 text-primary text-xs font-medium px-3 py-1 rounded-full border border-blue-700 border-opacity-50">
                    {tag}
                  </span>
                ))}
              </div>
              {/* External link to official website - remains clickable on top */}
              <Link href={tool.website_url} target="_blank" rel="noopener noreferrer" className="relative z-20 inline-block bg-primary bg-opacity-20 text-primary border border-primary text-base font-bold py-2 px-5 rounded-lg hover:bg-opacity-40 transition-colors duration-300">
                Visit Website
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}