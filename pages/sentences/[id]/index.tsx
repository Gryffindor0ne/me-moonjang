import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ObjectId } from 'mongodb';
import { MdOutlineArrowBackIos } from 'react-icons/md';
import { HiOutlineBell } from 'react-icons/hi';

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
          className="flex flex-col w-full h-full gap-2 px-6 py-10 text-gray-700 border border-gray-300 rounded-md cursor-pointer resize-none hover:ring-2 hover:ring-teal-500 hover:ring-offset-1 hover:outline-none"
        >
          <div className="flex p-2 text-2xl font-bold font-Lora md:text-3xl">
            {sentenceDetail.sentence}
          </div>
          {open && (
            <div className="flex flex-col w-full p-2 mt-5">
              <div className="mb-10 text-base text-gray-400 font-Gowun md:text-xl">
                {sentenceDetail.interpretation}
              </div>
              {sentenceDetail.explanation && (
                <div>
                  <div className="p-2 mt-2 text-2xl text-teal-400">
                    <HiOutlineBell />
                  </div>

                  <div className="flex w-full mt-2 text-xs leading-relaxed text-gray-600 md:text-base">
                    {sentenceDetail.explanation}
                  </div>
                </div>
              )}

              <div className="my-5">
                <div className="flex w-full text-sm leading-relaxed text-gray-400 mt-14 md:text-xl">
                  클릭시 문장만 남습니다.
                </div>
                <div className="flex w-full mt-2 text-sm leading-relaxed text-gray-400 md:text-xl">
                  재클릭시 모든 내용이 표시됩니다.
                </div>
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
