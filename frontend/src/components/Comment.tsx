import React from 'react';

import { Asset } from '@/app/page';

type CommentProps = {
    asset: Asset;
};

export default function Comment({asset}: CommentProps) {
  if (!asset?.id) {
    throw new Promise((resolve) => setTimeout(resolve, 0)); // Simulate loading delay
  }

  return (<div className="comment h-[75px] max-w-full justify-center mb-3 shadow-md bg-white rounded-b-lg">
    <div className="p-4 flex flex-col justify-center leading-normal">
      <div className="mb-1">
        <p className="text-gray-700 text-base italic">"{asset.comment}"</p>
      </div>
      <div className="flex justify-between text-sm text-gray-900">
          <p className="leading-none">ID: {asset.id}</p>
          <p className="leading-none">{asset.owner}, at {asset.host}</p>
      </div>
    </div>
  </div>);
};