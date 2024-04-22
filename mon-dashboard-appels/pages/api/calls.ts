
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

type Call = {
    id: string;
    from: string;
    to: string;
    date: string;
    duration: number;
    subject: string;
    summary: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { to } = req.query;

    if (!to || typeof to !== 'string') {
        return res.status(400).json({ message: 'Paramètre \`to\` manquant ou invalide' });
    }

    const filePath = path.join(process.cwd(), 'data', 'data.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const calls: Call[] = JSON.parse(jsonData);

    const filteredCalls = calls.filter(call => call.to === to);

    res.status(200).json(filteredCalls);
}
