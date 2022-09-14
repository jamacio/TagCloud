import { useRouter } from 'next/router'
import { connectToDatabase } from "../../lib/mongodb";
import bodyParser from "body-parser";
import { promisify } from "util";
const getBody = promisify(bodyParser.urlencoded({ extended: false }));

const Tag = () => {
    const router = useRouter()
    const { pid } = router.query

    return (
        <>
            <form method="post">
                <input type="hidden" name="id" value={pid} />
                <input name="word" />
                <button type="submit">submit</button>
            </form>
            <p>
                {pid}
            </p>
        </>
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

    console.log('jsr');
    return {
        props: {
            tags: JSON.parse(JSON.stringify(response)),
        },
    };
}

export default Tag