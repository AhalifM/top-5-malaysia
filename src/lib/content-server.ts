import fs from 'fs';
import path from 'path';
import type { SiteContent } from './content';

const contentPath = path.join(process.cwd(), 'data', 'content.json');

export function readContent(): SiteContent {
  const raw = fs.readFileSync(contentPath, 'utf-8');
  return JSON.parse(raw) as SiteContent;
}

export function writeContent(data: SiteContent): void {
  fs.writeFileSync(contentPath, JSON.stringify(data, null, 2), 'utf-8');
}
