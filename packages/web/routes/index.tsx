import { Head } from '$fresh/runtime.ts';
import { Handlers, PageProps } from '$fresh/server.ts';

import Counter from '../islands/Counter.tsx';

interface Message {
  text: string;
}

export const handler: Handlers<Message | null> = {
  async GET(_, ctx) {
    try {
      const response = await fetch("http://localhost:3000/hello-world", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      if (response.status === 404) return ctx.render(null);
      const { message } = await response.json();
      return ctx.render({ text: message });
    } catch (error) {
      return ctx.render(null);
    }
  },
};

export default function Page({ data }: PageProps<Message | null>) {
  if (!data) return <h1>Ops! Nothing to show :/</h1>;

  return (
    <>
      <Head>
        <title>Fresh App</title>
      </Head>
      <div className="h-screen flex items-center">
      <div className="flex flex-col items-center justify-center mx-auto max-w-sm bg-gray-900 text-white rounded-lg h-56 p-4">
        <h1 className="text-4xl font-bold text-gray-200">{data.text}</h1>
        <p className="text-gray-300">Nice!</p>
        <div className="p-4">
          <Counter start={5} />
        </div>
      </div>
      </div>
    </>
  );
}