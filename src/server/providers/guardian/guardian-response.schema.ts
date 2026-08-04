import { z } from 'zod';

export const guardianResponseSchema = z.object({
  response: z.object({
    status: z.string(),
    results: z.array(
      z.object({
        id: z.string(),
        type: z.string(),
        sectionId: z.string().optional(),
        sectionName: z.string().optional(),
        webPublicationDate: z.string(),
        webTitle: z.string(),
        webUrl: z.string().url(),
        fields: z
          .object({
            trailText: z.string().optional(),
            thumbnail: z.string().url().optional(),
            byline: z.string().optional(),
          })
          .optional(),
      }),
    ),
  }),
});

export type GuardianResponse = z.infer<typeof guardianResponseSchema>;
