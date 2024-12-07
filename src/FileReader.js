import React, { useState, useEffect, useCallback } from 'react';
import myImage from './images/Felisa.jpg';  // adjust path as needed

const FileReader = () => {
  const [lines, setLines] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTime, setRefreshTime] = useState(new Date().toLocaleTimeString());

  const loadFile = useCallback(async () => {
    try {
      setIsLoading(true);
      const CORS_PROXY = "https://api.allorigins.win/raw?url=";
      const targetUrl = "http://tervingo.com/Felisarium/input.txt";
      
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
      console.log('File refreshed at:', new Date().toLocaleTimeString());

      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error loading file:', err);
    } finally {
      setIsLoading(false);
    }
  }, []); // No dependencies needed for loadFile

  // Initial load
  useEffect(() => {
    loadFile();
  }, [loadFile]); 

  // Set up periodic refresh
  useEffect(() => {
    const interval = setInterval(loadFile, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [loadFile]); 

  if (isLoading && lines.length === 0) {
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
        <img src={myImage} alt="" />
      </div>
      <br/><br/>
{/*       <div className="text-sm text-gray-500 mb-4">
        Last checked: {refreshTime}
      </div>
 */}      
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