// Blog posts live in one JSON file so Decap CMS can manage them as a single
// file collection (the LWS pattern). Title and date of the first post: CONFIRM.
import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: file('src/content/blog.json'),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    body: z.string(),
    image: z.string().optional(),
    // false hides the date on the index card and in the post eyebrow
    // (JSON-LD keeps datePublished). Stella, 11-23: hide "January 1" for now.
    showDate: z.boolean().default(true),
  }),
});

export const collections = { blog };
