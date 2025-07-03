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

export { loadAllPages };
