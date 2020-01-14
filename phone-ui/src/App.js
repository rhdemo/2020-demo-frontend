import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [requestInProgress, setRequestInProgress] = useState(false);
  const [responseUrl, setResponseUrl] = useState(null);
  const [responseStatus, setResponseStatus] = useState(null);
  const [responseStatusText, setResponseStatusText] = useState(null);
  const [responseBody, setResponseBody] = useState(null);

  const apiUrl = "/api/status";

  useEffect(() => {
    fetchData();
  }, []);    // eslint-disable-line

  async function fetchData() {
    setRequestInProgress(true);
    try {
      let response = await fetch(apiUrl);
      setRequestInProgress(false);
      setResponseUrl(response.url);
      setResponseStatus(response.status);
      setResponseStatusText(response.statusText);

      let responseJson = await response.json();
      setResponseBody(responseJson);
    } catch (error) {
      console.error(error);
    }
  }

  let responseSection = <div className="response-text">No Request</div>;

  if (requestInProgress) {
    responseSection = <div className="response-text">Request in Progress</div>;
  } else if (responseStatus) {
    responseSection = (
      <div className="response-text">
        <div className="code-section"><span className="code-label">URL:</span> <code
          className="code-value">{responseUrl}</code></div>
        <div className="code-section"><span className="code-label">STATUS:</span> <code
          className="code-value">{responseStatus} {responseStatusText}</code></div>
        {responseBody ? <div className="code-section">
          <div className="code-label">Body:</div>
          <pre className="code-value">{JSON.stringify(responseBody, undefined, 2)}</pre>
        </div> : ""}
      </div>);
  }

  return (
    <div className="App">
      <h3>API URL: {apiUrl}</h3>
      {responseSection}


      <button
        type="button"
        onClick={fetchData}
      ><i className="fa fa-undo"/> Fetch Data
      </button>
    </div>
  );
}

export default App;
