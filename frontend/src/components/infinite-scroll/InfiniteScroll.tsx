'use client';

import React, { useEffect, useState }  from 'react';
import '@/lib/env';

import Comment from '@/components/Comment';

import { Data } from '@/app/page';

import Button from '../buttons/Button';
import ProgressBar from '../ProgressBar';
import Skeleton from '../Skeleton';

type InfiniteScrollProps = {
    count: number;
    currentPage: number;
    data: Data[];
    doSearch: (term: string) => void
    getNextPage: () => Promise<Data[]> | undefined;
    isLoading: boolean;
    pageSize: number;
}

export default function InfiniteScroll({count, data, doSearch, getNextPage, isLoading, pageSize}: InfiniteScrollProps) {

    const [ search, setSearch ] = useState("");
    const [ scrollEnabled, setScrollEnabled ] = useState(false);

    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, offsetHeight } = event.currentTarget;
      const scrollRatio = (scrollTop / (scrollHeight- offsetHeight)) * 100;

      if (scrollRatio > 75 && !isLoading && scrollEnabled) {
        getNextPage();
      }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
      // This is perfectly safe in react, it correctly detect the keys
      if(event.key == 'Enter'){
          doSearch(search)
      }
    };

    useEffect(() => {
      // if the number of pages matches the count, then we do not scroll anymore
      if (!data[data.length - 1].assets) {
        setScrollEnabled(false);
      } else {
        setScrollEnabled(true);
      }
    }, [count, data, pageSize]);

  return (
      <div className='mt-2 text-sm text-gray-800'>
          <div className="mb-10">
            Filters: 
            Host: <input type="text" value={search} onChange={e => setSearch(e.target.value)}  onKeyDown={handleKeyPress} />
            <Button className="ml-5" onClick={() => doSearch(search)}>Search</Button>
        </div>
        <div id="container" className="h-[50%] max-h-[400px] lg:max-h-[600px] min-w-[520px] bg-slate-200 overflow-auto px-5 py-5" onScroll={handleScroll}>
          { count > 0 ?
            data.slice(1)
              .map((data: Data) => {
                if (data) {
                  return <div id={`page-${data.page}`} key={`page-${data.page}`}>
                    {
                      data.assets?.map((asset, index) =>
                        <React.Fragment key={`${data.page}-${index}`}>
                          <React.Suspense fallback={
                            <Skeleton className="h-[75px] max-w-full justify-center mb-3 shadow-md bg-white rounded-b-lg"/>
                          }>
                            <Comment asset={asset} />
                          </React.Suspense>
                        </React.Fragment>
                      )
                    }
                  </div>
                } else {
                  <>Dato</>
                }
              }
              ) :
              <>No data returned</>
          }
        </div>
        <ProgressBar percent={ (count > 0 ? (data.length / (count/pageSize)):1) * 100 } />
      </div>
  );
}
