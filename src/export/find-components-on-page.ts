interface ComponentNodeInfo {
  id: string;
  type: string;
  name: string;
  description: string | null;
  key: string;
}

interface ComponentsJSON {
  [name: string]: ComponentNodeInfo;
}

const findComponentsOnPage = async (
  page: PageNode,
  componentsJSON: ComponentsJSON
): Promise<void> => {
  const components = page.findAll(
    (node: SceneNode) =>
      (node.type === "COMPONENT_SET" || node.type === "COMPONENT") &&
      !node.name.startsWith("_") &&
      !node.name.includes("=")
  );

  // Loop through the components and add them to the JSON object
  components.map((component: SceneNode & { key?: string }) => {
    componentsJSON[component.name] = {
      id: component.id,
      type: component.type,
      name: component.name,
      description: "description" in component ? component.description : null,
      key: "key" in component ? component.key! : "",
    };
  });
};

export { findComponentsOnPage };
