import { z } from 'zod';

export type Measure = z.infer<ReturnType<typeof zMeasure>>;
export const zMeasure = () =>
  z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    action_type: z.string(),
  });
