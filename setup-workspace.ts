// Globals ---------------------------------------------------------------------

let importMap: Record<string, string> = {};

// Constants -------------------------------------------------------------------

const IMPORT_MAP_FILE = "workspace-import-map.json";

// Methods ---------------------------------------------------------------------

function updateImportMap() {
  importMap = {};

  for (const directory of Deno.readDirSync("packages")) {
    if (!directory.isDirectory) continue;

    const importMapPath = `packages/${directory.name}/import_map.json`;
    const importMapJson = JSON.parse(Deno.readTextFileSync(importMapPath));

    console.log(`📖 Reading ${importMapPath}...`);

    for (const [key, value] of Object.entries(importMapJson.imports)) {
      if (importMap[key]) throw new Error(`Unable to merge import map from '${directory}'. Duplicate import map key: '${key}'`);
      const isRelativePath = value.match(/^(\.\.\/|\.\/)/g);

      if (isRelativePath)
        importMap[key] = `./packages/${directory.name}/${value.replace(/^(\.\.\/|\.\/)/g, '')}`;
      else
        importMap[key] = value;
    }
  }

  writeImportMap();
}

function writeImportMap() {
  console.log(`📝 Writing ${IMPORT_MAP_FILE} on workspace root...`);
  try {
    Deno.writeTextFileSync(IMPORT_MAP_FILE, JSON.stringify({ imports: importMap }, null, 2));
    console.log("✅ All done! Workspace is ready to use!");
  } catch (error) {
    console.error(`❌ Error while writing ${IMPORT_MAP_FILE}`);
    console.error(error);
    Deno.exit(1);
  }
}

function initialize() {
  const shouldWatch = Deno.args.includes("--watch");
  console.log("🦕 Starting deno monorepo setup...");
  updateImportMap();

  if (!shouldWatch) return;

  console.log("👀 Watching for changes in import_map.json files...");
  for await (const change of Deno.watchFs("packages")) {
    if (change.kind === "modify" && change.paths[0].endsWith("import_map.json"))
      updateImportMap();
  }
}

// Initialization --------------------------------------------------------------

initialize();