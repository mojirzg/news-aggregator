import { Router } from 'express';
import { getHealth } from './health.controller';

export const healthRouter = Router().get('/', getHealth);
