import fs from 'fs';
import path from 'path';
import { normalizeImageAdjustments, normalizeTheme, type SiteContent } from './content';

const contentPath = path.join(process.cwd(), 'data', 'content.json');

export function readContent(): SiteContent {
  const raw = fs.readFileSync(contentPath, 'utf-8');
  const content = JSON.parse(raw) as SiteContent;
  return {
    ...content,
    theme: normalizeTheme(content.theme),
    hero: {
      ...content.hero,
      imageAdjustments: normalizeImageAdjustments(content.hero.imageAdjustments),
    },
  };
}

export function writeContent(data: SiteContent): void {
  fs.writeFileSync(contentPath, JSON.stringify({
    ...data,
    theme: normalizeTheme(data.theme),
    hero: {
      ...data.hero,
      imageAdjustments: normalizeImageAdjustments(data.hero.imageAdjustments),
    },
  }, null, 2), 'utf-8');
}
