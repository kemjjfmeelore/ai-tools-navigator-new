import { getSortedToolsData } from '@/lib/tools';
import Link from 'next/link';
// import Image from 'next/image'; // Image import removed as logos are hidden

export default function Home() {
  const allToolsData = getSortedToolsData();

  return (
    <div className="min-h-screen bg-base-100 text-base-content font-sans">
      <main className="container mx-auto p-4 py-8">
        <h1 className="text-5xl font-bold mb-10 text-center text-primary text-glow tracking-widest">AI Audio & Video Tools Navigator</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allToolsData.map((tool) => (
            <div key={tool.slug} className="card bg-base-200 border border-base-300 rounded-lg p-6 hover:shadow-lg hover:shadow-primary transition-all duration-300 group relative">
              {/* Internal link to detail page - covers the main card area */}
              <Link href={`/tool/${tool.slug}`} className="absolute inset-0 z-10" aria-label={`View ${tool.name} Details`}></Link>
              
              {/* Removed Logo display */}
              <h2 className="text-3xl font-semibold mb-2 text-primary group-hover:text-secondary transition-colors duration-300">{tool.name}</h2>
              
              <p className="text-sm text-neutral-content mb-2">
                Category: <span className="font-medium text-info">{tool.category}</span>
              </p>
              <p className="text-base-content mb-4 text-lg">{tool.one_liner}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {tool.tags && tool.tags.map(tag => (
                  <div key={tag} className="badge badge-outline badge-accent">
                    {tag}
                  </div>
                ))}
              </div>
              {/* External link to official website - remains clickable on top */}
              <Link href={tool.website_url} target="_blank" rel="noopener noreferrer" className="relative z-20 btn btn-outline btn-secondary btn-sm">
                Visit Website
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}