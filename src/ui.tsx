import React, { useState, useEffect } from "react";
import * as ReactDOM from "react-dom/client";
import { CopyToClipboardButton } from 'react-clipboard-button';
import JSONPretty from 'react-json-pretty';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const JSONPrettyMon = require('react-json-pretty/themes/monikai.css');
import "./ui.css";


function App() {
  // Set up the state for the output
  const [output, setOutput] = useState<string | undefined>(undefined);
  const [readyToCopy, setReadyToCopy] = useState<boolean>(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState<boolean>(false);

  // Tell the plugin code to export color styles
  const onExportColor = () => {
    setOutput("");
    setReadyToCopy(false);
    setCopiedToClipboard(false);
    parent.postMessage({ pluginMessage: { type: 'export-color' } }, '*')
  }

  // Tell the plugin code to export type styles
  const onExportType = () => {
    setOutput("");
    setReadyToCopy(false);
    setCopiedToClipboard(false);
    parent.postMessage({ pluginMessage: { type: 'export-type' } }, '*')
  }

  // Tell the plugin code to close the plugin
  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  };

  // Listen for messages from the plugin code
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const messageType = event.data.pluginMessage.type;
      const messageContent = event.data.pluginMessage.content;
      console.log("got this from the plugin code", messageType, messageContent);
      // Handle incoming message with exported JSON
      if (messageType === "exportJSON") {
        setOutput(messageContent);
        setReadyToCopy(true);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <main>
      <section className="buttons">
        {/* Tools for plugin developers */}
        <button onClick={onExportColor}>Export Color Styles</button>
        <button onClick={onExportType}>Export Text Styles</button>
        {!readyToCopy ? (
          <button className="primary" disabled>Copy</button>
        ) : (
          <CopyToClipboardButton
            text={JSON.stringify(output)}
            onSuccess={() => setCopiedToClipboard(true)}
            onError={() => setCopiedToClipboard(false)}
          >
            <button className="primary">
              {!copiedToClipboard ? "Copy" : "Copied!"}
            </button>
          </CopyToClipboardButton>
        )}
        <button onClick={onCancel}>Cancel</button>
      </section>

      <section className="feedback">
        <JSONPretty
          className="json-text"
          id="bi-json-export"
          data={JSON.stringify(output)}
          theme={JSONPrettyMon}
        />
      </section>

      <section className="instructions">
        <details>
          <summary>Instructions</summary>
          <p className="instructions-text">
            This plugin will export the color and text styles from this file. Click the buttons below to export the color or text styles, then copy the JSON output and save to <code>tokens.json</code> in the linter codebase.
          </p>
        </details>
      </section>
    </main>
  );
}

const rootElement = document.getElementById("react-page");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<App />);
} else {
  console.error("Failed to find the root element with id 'react-page'.");
}
