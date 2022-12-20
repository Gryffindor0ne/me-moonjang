import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { MdOutlineArrowBackIos } from 'react-icons/md';
import { HiOutlineExclamationCircle, HiOutlinePlus } from 'react-icons/hi';

import dbConnect from '@lib/db';
import Sentence, { SentenceDetailInfo } from '@components/sentence/Sentence';
import { UserInfo } from '@pages/profile';
import Seo from '@components/layout/Seo';

export type GroupInfo = {
  _id: string;
  name: string;
  email: string;
  createdAt: number;
  updatedAt: number;
  sentences: SentenceDetailInfo[];
};

const SentenceByGroup = ({ groupData }: { groupData: GroupInfo[] }) => {
  const router = useRouter();
  const addSentence = () => {
    router.push(`/newsentence/?name=${groupData[0].name}`);
  };

  return (
    <>
      <Seo title={`${groupData[0].name}`} />
      <section className="flex flex-col w-full gap-3 p-4 mx-auto">
        <div className="flex">
          <span
            onClick={() => router.push('/')}
            className="flex items-center justify-center pl-4 text-2xl cursor-pointer"
          >
            <MdOutlineArrowBackIos />
          </span>
          <h1 className="flex py-2 mx-auto my-8 text-xl font-bold text-gray-800 md:2xl">
            {groupData[0].name}
          </h1>
          <span
            onClick={addSentence}
            className="flex items-center justify-center pr-4 text-2xl cursor-pointer"
          >
            <HiOutlinePlus />
          </span>
        </div>
        {groupData[0].sentences && (
          <div className="p-3 text-lg font-bold text-teal-500">
            총 {groupData[0].sentences.length} 문장
          </div>
        )}

        {groupData[0].sentences ? (
          groupData[0].sentences?.map((sentenceInfo, idx) => (
            <Sentence
              key={idx}
              data={sentenceInfo}
              groupName={groupData[0].name}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-2 mt-10 text-xl text-center">
            <div className="p-2 text-3xl text-center text-teal-500 md:text-4xl">
              <HiOutlineExclamationCircle />
            </div>
            <div className="flex p-2 mx-auto text-base font-bold text-teal-500 md:text-xl">
              등록된 문장이 없습니다.
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const groupName = context.params?.groupName;
  const session = await getSession(context);

  const user = session?.user as UserInfo;

  const client = await dbConnect();
  const db = client.db();
  const groupsCollection = db.collection('groups');
  const groupData = await groupsCollection
    .find({ name: groupName, email: user?.email })
    .toArray();

  client.close();

  return {
    props: {
      groupData: JSON.parse(JSON.stringify(groupData)),
    },
  };
};

export default SentenceByGroup;
