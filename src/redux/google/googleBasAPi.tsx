'use client';
import { useEffect, useState } from 'react';

export default function fetchSheetData() {
  const [data, setData] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSheetData = async () => {
      try {
        const sheetId = '1g3o46W0enGrX5Qs5oHzB1eKwz-07mco7wp2q5LDWBHY';
        const apiKey = 'AIzaSyDSefwmFQ7r3mfT7OlgKkIHzQap8BNJuQs';
        const sheetName = 'Form Responses 1';

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(sheetName)}?key=${apiKey}`;

        const res = await fetch(url);
        const json = await res.json();
        setData(json.values || []);
      } catch (error) {
        console.error('Error fetching sheet data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSheetData();
  }, []);

  if (loading) return <div className="p-4">📥 লোড হচ্ছে...</div>;
  if (!data.length) return <div className="p-4">❌ কোনো ডেটা পাওয়া যায়নি</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📋 Google Form Data Table</h1>
      <table className="w-full border border-gray-300 text-left text-sm">
        <thead>
          <tr>
            {data[0].map((header, index) => (
              <th key={index} className="border p-2 bg-gray-100 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {row.map((cell, colIndex) => (
                <td key={colIndex} className="border p-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
