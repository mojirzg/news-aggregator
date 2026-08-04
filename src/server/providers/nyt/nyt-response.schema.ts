import { z } from 'zod';

export const nytResponseSchema = z.object({
  status: z.string(),
  response: z.object({
    docs: z.array(
      z.object({
        _id: z.string(),
        web_url: z.string().url(),
        pub_date: z.string(),
        section_name: z.string().nullable().optional(),
        subsection_name: z.string().nullable().optional(),
        headline: z.object({ main: z.string() }),
        abstract: z.string().nullable().optional(),
        lead_paragraph: z.string().nullable().optional(),
        byline: z.object({ original: z.string().nullable().optional() }).optional(),
        multimedia: z
          .array(
            z.object({
              url: z.string(),
              type: z.string().optional(),
              subtype: z.string().optional(),
            }),
          )
          .optional(),
        keywords: z.array(z.object({ value: z.string() })).optional(),
      }),
    ),
  }),
});

export type NytResponse = z.infer<typeof nytResponseSchema>;
