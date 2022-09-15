import type { NextPage } from 'next'
import { connectToDatabase } from "../lib/mongodb";
import { TagCloud } from 'react-tagcloud'
import bodyParser, { text } from "body-parser";
import { promisify } from "util";
const getBody = promisify(bodyParser.urlencoded({ extended: false }));

import nextSession from "next-session";
const getSession = nextSession();

function App({ tags, urlTag }: any) {
  return (
    <>
      <div className="w-2/4 mx-auto my-20 text-center">
        <TagCloud
          minSize={30}
          maxSize={100}
          tags={tags}
          onClick={(tag: { value: any }) => alert(`'${tag.value}' was selected!`)}
        />
      </div>
      <div className="w-2/4 mx-auto my-20 text-center">
        <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
          <div>
            <div className="relative">
            <p> Copie o link abaixo e envie para sua galera.</p>
              <input disabled defaultValue={urlTag} className="block p-4 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
              <button onClick={() => navigator.clipboard.writeText(urlTag)} className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700">Copiar</button>
            </div>
          </div>
          <form method="post">
            <div className='my-4'>
              <button type="submit" name="refresh" value="1" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' >Trocar link</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}


export async function getServerSideProps({ req, res }: any) {
  const collection = "tagWord";
  const { db } = await connectToDatabase();
  const session = await getSession(req, res);
  if (req.method === "POST") {
    await getBody(req, res);
    const refresh = req.body?.refresh;

    if (refresh) {
      session.url_id = "";
    }
  }

  const baseUrl = req?.headers?.host + '/tag/';
  const start = Date.now();
  session.url_id = session.url_id ? session.url_id : start;
  let returnTags: any[] = [];

  const tags = await db
    .collection(collection)
    .find({ "url_id": String(session.url_id) })
    .toArray();

  tags.forEach(function (item) {
    returnTags.push({
      value: item.word,
      count: ((item?.count) ?? 1)
    });

  })

  return {
    props: {
      tags: returnTags,
      urlTag: baseUrl + session.url_id
    },
  };
}

export default App
