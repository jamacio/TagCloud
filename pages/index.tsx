import type { NextPage } from 'next'
import { connectToDatabase } from "../lib/mongodb";
import { TagCloud } from 'react-tagcloud'

const data = [
  { value: 'jamacio teste', count: 200 },
  { value: 'Mauricio teste', count: 500 },
  { value: 'CSS3', count: 220 },
  { value: 'JavaScript', count: 38 },
  { value: 'React', count: 302 },
  { value: 'Nodejs', count: 28 },
  { value: 'Express.js', count: 25 },
  { value: 'HTML5', count: 313 },
  { value: 'MongoDB', count: 18 },

  { value: 'CSS31', count: 220 },
  { value: 'JavaScript1', count: 38 },
  { value: 'React1', count: 302 },
  { value: 'Nodejs1', count: 28 },
  { value: 'Express.js1', count: 25 },
  { value: 'HTML51', count: 313 },
  { value: 'MongoDB1', count: 18 },

  { value: 'CSS32', count: 220 },
  { value: 'JavaScript2', count: 38 },
  { value: 'React2', count: 302 },
  { value: 'Nodejs2', count: 28 },
  { value: 'Express.js2', count: 25 },
  { value: 'HTML52', count: 313 },
  { value: 'MongoDB2', count: 18 },

  { value: 'CSS33', count: 220 },
  { value: 'JavaScript3', count: 38 },
  { value: 'React3', count: 302 },
  { value: 'Nodejs3', count: 28 },
  { value: 'Express.js3', count: 25 },
  { value: 'HTML53', count: 313 },
  { value: 'MongoDB3', count: 18 },
]


const App: NextPage = ({ tags }) => {
  return (
    <div>
      <TagCloud
        minSize={20}
        maxSize={50}
        tags={data}
        onClick={(tag: { value: any }) => alert(`'${tag.value}' was selected!`)}
      />
      <ul>
        {tags.map((tag) => (
          <li className="text-3xl font-bold underline" key={tag._id} >
            <h2>{tag.word}</h2>
            <h3>{tag.url_id}</h3>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function getServerSideProps() {
  const { db } = await connectToDatabase();

  const tags = await db
    .collection("tagWord")
    .find({ "url_id": "222" })
    .toArray();

  return {
    props: {
      tags: JSON.parse(JSON.stringify(tags)),
    },
  };
}

export default App
