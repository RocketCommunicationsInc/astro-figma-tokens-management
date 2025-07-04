import tokensImport from "../tokens.json";
import { findComponentsOnPage } from "./find-components-on-page";
import { loadAllPages } from "./load-all-pages";
import { TokensJSON } from "./types";

// Create an object to hold the components data
const componentsJSON: {
  [key: string]: {
    id: string;
    name: string;
    description: string | null;
    key: string;
    type: string;
  };
} = {};

const exportComponents = async () => {
  // Set up the JSON object structure
  const tokensJSON: TokensJSON = {
    ...tokensImport,
    "components": tokensImport["components"],
  };

  // Load all pages
  const pages = await loadAllPages();

  // Process each page
  pages.forEach((page) => {
    findComponentsOnPage(page, componentsJSON);
  });

  // sort components into respective json sections
  tokensJSON["components"] = componentsJSON;

  // Send JSON to the UI
  figma.ui.postMessage({ type: "exportJSON", content: tokensJSON });
};

export { exportComponents };
