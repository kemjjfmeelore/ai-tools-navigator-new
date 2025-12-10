import { getSortedToolsData, getToolData } from '@/lib/tools';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';

// This function tells Next.js which slugs to pre-render at build time
export async function generateStaticParams() {
  const tools = getSortedToolsData();
  
  const validParams = tools
    .map((tool) => {
      if (tool && typeof tool.slug === 'string' && tool.slug) {
        return { slug: tool.slug };
      }
      // Explicitly return null for any invalid/unexpected entries
      return null;
    })
    .filter((param): param is { slug: string } => param !== null); // Strictly filter out all nulls

  return validParams;
}

// This function sets the page title
export async function generateMetadata({ params }: { params: { slug: string } }) {
    const tool = await getToolData(params.slug);
    return {
        title: `${tool.name} - AI Tool`
    }
}

export default async function ToolPage({ params }: { params: { slug: string } }) {
  const tool = await getToolData(params.slug);

  return (
    <div className="min-h-screen bg-background text-textlight font-sans">
      <main className="container mx-auto p-4 py-8">
        <div className="bg-card border border-border rounded-xl p-6 lg:p-8">
          
          <Link href="/" className="text-primary hover:underline mb-6 inline-block">
            &larr; Back to Home
          </Link>

          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-textlight">{tool.name}</h1>
          
          <p className="text-lg text-textdark mb-4">{tool.one_liner}</p>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Link href={tool.website_url} target="_blank" rel="noopener noreferrer" className="inline-block bg-primary bg-opacity-20 hover:bg-opacity-40 text-primary border border-primary text-base font-bold py-2 px-5 rounded-lg transition-colors duration-300">
                Visit Website &rarr;
            </Link>
            <div className="flex flex-wrap gap-2">
                {tool.tags && tool.tags.map(tag => (
                  <span key={tag} className="bg-secondary bg-opacity-30 text-secondary text-xs font-medium px-3 py-1 rounded-full border border-secondary border-opacity-50">
                    {tag}
                  </span>
                ))}
            </div>
          </div>

          <article className="prose dark:prose-invert lg:prose-lg max-w-none">
            <MDXRemote source={tool.content} />
          </article>
        </div>
      </main>
    </div>
  );
}