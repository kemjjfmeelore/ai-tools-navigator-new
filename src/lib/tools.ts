import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const toolsDirectory = path.join(process.cwd(), 'src/tools');

export interface ToolData {
  slug: string;
  name: string;
  category: string;
  one_liner: string;
  logo_url: string;
  website_url: string;
  pricing_model: string;
  tags: string[];
  [key: string]: any;
}

export function getSortedToolsData(): ToolData[] {
  const fileNames = fs.readdirSync(toolsDirectory);
  const allToolsData = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(toolsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);
      
      return {
        ...matterResult.data,
        slug,
      } as ToolData;
    });

  return allToolsData;
}

export async function getToolData(
  slug: string
): Promise<ToolData & { content: string }> {
  if (typeof slug !== 'string' || !slug) {
    throw new Error(`CRITICAL: getToolData was called with an invalid slug: ${slug}`);
  }
  const fullPath = path.join(toolsDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const matterResult = matter(fileContents);

  return {
    ...matterResult.data,
    slug,
    content: matterResult.content,
  } as ToolData & { content: string };
}