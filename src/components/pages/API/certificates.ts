// pages/api/certificates.ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const SHEET_ID = '1g3o46W0enGrX5Qs5oHzB1eKwz-07mco7wp2q5LDWBHY';
const SHEET_NAME = encodeURIComponent("Copy of Certified Student's InformationNew");

const API_KEY = 'AIzaSyDvI-YBUNvGridcd4T1OxCm7G0rp9e_KSU';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(SHEET_NAME)}?key=${API_KEY}`;
      console.log('Fetching from:', url);
  
      const response = await axios.get(url);
      const rows = response.data.values;
  
      const [headers, ...data] = rows;
      const formatted = data.map((row: string[]) => ({
        studentId: row[0],
        studentName: row[1],
        courseName: row[3],
        issueDate: row[4],
        instructor: row[5],
      }));
  
      res.status(200).json(formatted);
    } catch (error: any) {
      console.error('Error fetching from Google Sheets:', error?.response?.data || error.message);
      res.status(500).json({ error: 'Failed to fetch certificates' });
    }
  }