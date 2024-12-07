import React, { useState, useEffect } from 'react';
import myImage from './images/Felisa.jpg';  // adjust path as needed

const FileReader = () => {
  const [lines, setLines] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFile = async () => {
      try {
        const response = await fetch('/input.txt');
        if (!response.ok) {
          throw new Error(`Failed to load file: ${response.status}`);
        }
        const text = await response.text();
        const fileLines = text.split('\n').filter(line => line.trim());
        setLines(fileLines);
      } catch (err) {
        setError(err.message);
        console.error('Error loading file:', err);
      }
    };

    loadFile();
  }, []);

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="text-red-600">
          Error loading file: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Felisarium</h1>
      <br/>
      <div>
      <img src={myImage} alt="" />
    </div>
    <br/><br/>
      <div>
        {lines.map((line, index) => (
          <h3 key={index} className="text-xl font-semibold my-2">
            {line}
          </h3>
        ))}
      </div>
    </div>
  );
};

export default FileReader;