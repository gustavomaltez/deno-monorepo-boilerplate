// Constants -------------------------------------------------------------------

const API_URL = "http://localhost:3000";
const API_READY_TEXT = "API is running on http://localhost:3000";

// Initialization --------------------------------------------------------------

/**
 * Initializes the API in testing mode and awaits it to be ready.
 * @returns A promise that will ne resolved once the API is up and running.
 */
async function initializeAPI(): Promise<void> {
  console.log("🦕 Starting API...");

  const server = Deno.run({
    cmd: ["deno", "run", "--allow-net", "src/index.ts"],
    cwd: ".",
    stdout: "piped",
    stderr: "piped",
  });

  const decoder = new TextDecoder();
  const stdoutBuffer = new Uint8Array(1024);

  console.log("✅ API started, awaiting it to be ready...");

  while (true) {
    const bytesToRead = await server.stdout?.read(stdoutBuffer);
    if (bytesToRead !== null) {
      const text = decoder.decode(stdoutBuffer.subarray(0, bytesToRead));
      console.log(`[API LOG]: ${text.replace(/\n$/, "")}`);
      if (text.includes(API_READY_TEXT)) break;
    }
  }

  console.log("🦕 API is ready!");
}

// Exports ---------------------------------------------------------------------

export { API_URL, initializeAPI };
