import { z } from 'zod';

export type Measure = z.infer<ReturnType<typeof zMeasure>>;
export const zMeasure = () =>
  z.object({
    title: z.string(),
    description: z.string(),
    action_type: z.string(),
  });

export type Game = z.infer<ReturnType<typeof zGame>>;
export const zGame = () =>
  z.object({
    cartel: z.number(),
    current_month: z.number(),
    current_year: z.number(),
    economic: z.number(),
    environmental: z.number(),
    scientist: z.number(),
    social: z.number(),
    united_nations: z.number(),
    game_over: z.boolean(),
  });
