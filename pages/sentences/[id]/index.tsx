import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ObjectId } from 'mongodb';
import { MdOutlineArrowBackIos } from 'react-icons/md';

import dbConnect from '@lib/db';
import { UserInfo } from '@pages/profile';
import Seo from '@components/layout/Seo';

const Sentence = ({ sentenceData }: { sentenceData: any }) => {
  const [open, setOpen] = useState(true);
  const router = useRouter();

  const sentenceDetail = sentenceData[0].sentences[0];

  const handleSentence = () => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      <Seo title={`${sentenceData[0].name}-상세`} />
      <section className="flex flex-col w-full p-5 mx-auto">
        <div className="flex pr-8">
          <span
            onClick={() => router.back()}
            className="flex items-center justify-center pl-4 text-2xl cursor-pointer"
          >
            <MdOutlineArrowBackIos />
          </span>
          <h1 className="flex py-2 mx-auto my-8 text-xl font-bold text-gray-800 md:2xl">
            {sentenceData[0].name}
          </h1>
        </div>
        <div
          onClick={handleSentence}
          className="flex flex-col items-center w-full gap-5 py-10 text-gray-700 border border-gray-300 rounded-md cursor-pointer resize-none hover:ring-2 hover:ring-teal-500 hover:ring-offset-1 hover:outline-none"
        >
          <div className="flex px-4 py-10 text-base font-bold md:text-xl">
            {sentenceDetail.sentence}
          </div>
          {open && (
            <div className="flex flex-col items-center justify-center w-full gap-5 p-4 mt-5">
              <div className="text-sm md:text-lg">
                {sentenceDetail.interpretation}
              </div>
              <div className="flex items-center justify-center w-full p-4 text-xs leading-relaxed text-gray-600 bg-teal-100 rounded-md mt-7 md:text-base md:leading-loose">
                {sentenceDetail.explanation}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id, name } = context.query;
  const session = await getSession(context);

  const user = session?.user as UserInfo;

  const client = await dbConnect();
  const db = client.db();
  const groupsCollection = db.collection('groups');
  const sentenceData = await groupsCollection
    .find(
      { name, email: user.email },
      {
        projection: {
          email: 1,
          name: 1,
          createdAt: 1,
          updatedAt: 1,
          sentences: { $elemMatch: { id: new ObjectId(`${id}`) } },
        },
      }
    )
    .toArray();

  client.close();

  return {
    props: {
      sentenceData: JSON.parse(JSON.stringify(sentenceData)),
    },
  };
};

export default Sentence;