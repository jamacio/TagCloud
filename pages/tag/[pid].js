import { useRouter } from 'next/router'
import { connectToDatabase } from "../../lib/mongodb";
import bodyParser from "body-parser";
import { promisify } from "util";
const getBody = promisify(bodyParser.urlencoded({ extended: false }));

const Tag = () => {
    const router = useRouter()
    const { pid } = router.query

    return (
        <div className="w-full max-w-xs">
            <div className="flex items-center justify-between">
                <form method="post" className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
                    <input type="hidden" name="id" value={pid} />
                    <input name="word" className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' />
                    <button type="submit" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>submit</button>
                </form>
            </div>
            <p>
                {pid}
            </p>
        </div>
    );

}


export async function getServerSideProps({ req, res }) {
    if (req.method === "POST") {
        await getBody(req, res);
    }

    const word = req.body?.word;
    const url_id = req.body?.id;

    if (!word && !url_id) {
        return {
            props: {
                tags: ""
            }
        }
    }

    const { db } = await connectToDatabase();

    const response = db.collection("tagWord").insertOne({
        word,
        url_id,
    });

    return {
        props: {
            tags: JSON.parse(JSON.stringify(response)),
        },
    };
}

export default Tag