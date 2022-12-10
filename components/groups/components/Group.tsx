import React from 'react';

const Group = ({ groupName }: { groupName: string }) => {
  return (
    <>
      <div className="p-3 mx-2 my-4 text-teal-100 rounded-md md:text-lg md:p-5 bg-gradient-to-r from-teal-500 via-teal-400 to-teal-200 text-md text-bold">
        {groupName}
      </div>
    </>
  );
};

export default Group;
