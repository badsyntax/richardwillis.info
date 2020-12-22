import remark from 'remark';
import html from 'remark-html';
import prism from 'remark-prism';
import { VFileCompatible } from 'vfile';

export const markdownToHtml = async (
  markdown: VFileCompatible
): Promise<string> => {
  const result = await remark()
    .use(html)
    .use(prism, {
      plugins: [],
    })
    .process(markdown);
  return result.toString();
};
