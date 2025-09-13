import React, { useState, useEffect, useCallback } from 'react';
import myImage from './images/Felisa.jpg';  // adjust path as needed

const FileReader = () => {
  const [felisadasLines, setFelisadasLines] = useState([]);
  const [otrosLines, setOtrosLines] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTime, setRefreshTime] = useState(new Date().toLocaleTimeString());

  const loadFile = useCallback(async (fileName, setLines) => {
    try {
      setIsLoading(true);
//      const CORS_PROXY = "https://api.allorigins.win/raw?url=";
      const CORS_PROXY = "https://corsproxy.io/?";
      const targetUrl = `http://tervingo.com/Felisarium/${fileName}`;
      
      // Add cache-busting query parameter
      const cacheBuster = `${targetUrl}${targetUrl.includes('?') ? '&' : '?'}_t=${Date.now()}`;
      
      const response = await fetch(CORS_PROXY + encodeURIComponent(cacheBuster));
      
      if (!response.ok) {
        throw new Error(`Failed to load file: ${response.status}`);
      }

      const text = await response.text();
      const fileLines = text.split('\n').filter(line => line.trim());
      setLines(fileLines);
      setRefreshTime(new Date().toLocaleTimeString());
      console.log(`File ${fileName} refreshed at:`, new Date().toLocaleTimeString());

      setError(null);
    } catch (err) {
      setError(err.message);
      console.error(`Error loading file ${fileName}:`, err);
    } finally {
      setIsLoading(false);
    }
  }, []); // No dependencies needed for loadFile

  // Initial load
  useEffect(() => {
    loadFile('felisadas.txt', setFelisadasLines);
    loadFile('otros.txt', setOtrosLines);
  }, [loadFile]); 

  // Set up periodic refresh
  useEffect(() => {
    const interval = setInterval(() => {
      loadFile('felisadas.txt', setFelisadasLines);
      loadFile('otros.txt', setOtrosLines);
    }, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [loadFile]); 

  if (isLoading && felisadasLines.length === 0 && otrosLines.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="text-gray-600">
          Loading content at {refreshTime}
        </div>
      </div>
    );
  }

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
      <h1 className="text-4xl font-bold mb-4 text-gray-500">Felisarium</h1>
      <br/>
      <div>
        <img src={myImage} alt="" style={{ width: '240px', height: '340px'}} />
      </div>
      <br/><br/>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-300 border border-grey-500">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-400 w-1/2 border-r-2 border-gray-400">Felisadas</th>
              <th className="py-2 px-4 border-b border-gray-400 w-1/2">Otros</th>
            </tr>
          </thead>
          <tbody>
            {felisadasLines.map((line, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b border-gray-400 w-1/2 border-r-2 border-gray-400">{line}</td>
                <td className="py-2 px-4 border-b border-gray-400 w-1/2">{otrosLines[index] || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FileReader;