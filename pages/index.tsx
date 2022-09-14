import type { NextPage } from 'next'
import { connectToDatabase } from "../lib/mongodb";
import { TagCloud } from 'react-tagcloud'
import bodyParser from "body-parser";
import { promisify } from "util";
const getBody = promisify(bodyParser.urlencoded({ extended: false }));


import nextSession from "next-session";
const getSession = nextSession();


function App({ tags, urlTag }: any) {

  return (
    <div className="w-2/4 mx-auto my-20 text-center">
      <TagCloud
        minSize={30}
        maxSize={100}
        tags={tags}
        onClick={(tag: { value: any }) => alert(`'${tag.value}' was selected!`)}
      />

      <p>{urlTag}</p>

      <form method="post">
        <button type="submit" name="refresh" value="1" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' >Trocar link</button>
      </form>
    </div>
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
