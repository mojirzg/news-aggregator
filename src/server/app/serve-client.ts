import fs from 'node:fs';
import type { ServerResponse } from 'node:http';
import path from 'node:path';
import type { Express, NextFunction, Request, Response } from 'express';
import express from 'express';

const clientDirectory = path.resolve(process.cwd(), 'dist/client');

export const serveClient = (app: Express) => {
  if (!fs.existsSync(path.join(clientDirectory, 'index.html'))) return;

  app.use(
    express.static(clientDirectory, {
      index: false,
      maxAge: '1h',
      setHeaders: (response: ServerResponse, filePath: string) => {
        if (filePath.includes(`${path.sep}assets${path.sep}`)) {
          response.setHeader(
            'Cache-Control',
            'public, max-age=31536000, immutable',
          );
        }
      },
    }),
  );

  app.use((request: Request, response: Response, next: NextFunction) => {
    if (
      request.method === 'GET' &&
      !request.path.startsWith('/api/') &&
      request.accepts('html')
    ) {
      response.setHeader('Cache-Control', 'no-cache');
      response.sendFile(path.join(clientDirectory, 'index.html'));
      return;
    }
    next();
  });
};
