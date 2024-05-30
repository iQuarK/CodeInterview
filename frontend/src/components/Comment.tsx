import React from 'react';

type CommentProps = {
    comment: string;
    owner: string;
};

export default function Comment({comment, owner}: CommentProps) {
    return (<div className="max-w-sm w-full lg:max-w-full lg:flex justify-center">
    <div className="border-b border-gray-400 lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-center leading-normal">
      <div className="mb-1">
        <p className="text-gray-700 text-base italic">"{comment}"</p>
      </div>
      <div className="flex justify-end text-sm">
          <p className="text-gray-900 leading-none">{owner}</p>
      </div>
    </div>
  </div>);
};