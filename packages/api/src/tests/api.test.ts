import { assertEquals } from 'testing/asserts';

import { API_URL, initializeAPI } from './helpers.ts';

// Initialization --------------------------------------------------------------

await initializeAPI();

// Helpers ---------------------------------------------------------------------

async function callApi<ResponseData>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  body?: unknown,
): Promise<{ response: Response, data: ResponseData; }> {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  return { response, data };
}

// Tests -----------------------------------------------------------------------

Deno.test("Example", async (t) => {
  await t.step("Should return a hello world message.", async () => {
    const { response, data } = await callApi<{ message?: string; }>("GET", "/hello-world");
    assertEquals(response.status, 200);
    assertEquals(data.message, "Hello world!");
  });
});