import { VercelRequest, VercelResponse } from '@vercel/node'; // Import Vercel types for serverless functions

import app from './app';

export default (req: VercelRequest, res: VercelResponse) => {
  return app(req, res); // Forward the request to your Express app
};

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
