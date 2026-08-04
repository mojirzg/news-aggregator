import { Router } from 'express';
import type { Request, Response } from 'express';


export const healthRouter = Router().get('/', (_request: Request, response: Response) => {
  response.json({ status: 'ok', timestamp: new Date().toISOString() });
})
