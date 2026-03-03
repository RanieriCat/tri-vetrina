import { defineCollection, z } from 'astro:content';

const risorse = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    date: z.string()
  })
});

export const collections = { risorse };
