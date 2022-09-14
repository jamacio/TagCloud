import type { NextPage } from 'next'
import { connectToDatabase } from "../lib/mongodb";
import { TagCloud } from 'react-tagcloud'
import type { AppProps } from 'next/app'
import bodyParser from "body-parser";
import { promisify } from "util";
const getBody = promisify(bodyParser.urlencoded({ extended: false }));


import nextSession from "next-session";
const getSession = nextSession();


function App({ tags, urlTag }: any) {

  return (
    <div className="w-2/4 mx-auto my-20 text-center">
      <TagCloud
        minSize={20}
        maxSize={50}
        tags={tags}
        onClick={(tag: { value: any }) => alert(`'${tag.value}' was selected!`)}
      />

      <p>{urlTag}</p>

      <form method="post">
        <button type="submit" name="refresh" value="1" >Trocar link</button>
      </form>
    </div>
  );
}

export async function getServerSideProps({ req, res }: any) {
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
    .collection("tagWord")
    .find({ "url_id": String(session.url_id)  })
    .toArray();

let count = 10;
  tags.forEach(function (item) {

    if (isValue(returnTags, item.word)) {
      count = count + 10;
    }

    returnTags.push({
      value: item.word,
      count: count
    });


  })

  return {
    props: {
      tags: returnTags,
      urlTag: baseUrl + session.url_id
    },
  };
}

function isValue(data: any[], find: any) {
  const isValue = data.find(function (item: { value: any; }) {
    return item.value == find;
  });

  return isValue;
}


export default App
