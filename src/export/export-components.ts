import tokensImport from "../tokens.json";
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

const findComponentsonPage = async (page: PageNode) => {
  const components = page.findAll(
    (node) =>
      (node.type === "COMPONENT_SET" || node.type === "COMPONENT") &&
      !node.name.startsWith("_") &&
      !node.name.includes("=") &&
      node.description !== ""
  );

  // Loop through the components and add them to the JSON object
  components.map((component) => {
    componentsJSON[component.name] = {
      id: component.id,
      type: component.type,
      name: component.name,
      description: "description" in component ? component.description : null,
      key: "key" in component ? component.key : "",
    };
  });
};

const loadAllPages = async (): Promise<PageNode[]> => {
  const pages: PageNode[] = [];

  for (const page of figma.root.children) {
    if (page.type === "PAGE") {
      try {
        await page.loadAsync();
        pages.push(page);
      } catch (error) {
        console.error(`Error loading page "${page.name}":`, error);
      }
    }
  }

  return pages;
};

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
    findComponentsonPage(page);
  });

  // sort components into respective json sections
  tokensJSON["components"] = componentsJSON;

  // Send JSON to the UI
  figma.ui.postMessage({ type: "exportJSON", content: tokensJSON });
};

export { exportComponents };
