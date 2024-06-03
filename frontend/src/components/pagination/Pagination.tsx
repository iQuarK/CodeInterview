'use client';

import React, { createContext, useState }  from 'react';
import '@/lib/env';

import Comment from '@/components/Comment';

import { Asset } from '@/app/page';

import PaginationFooter from './PaginationFooter';

type PaginationProps = {
    data: Asset[];
    count: number;
    getData: (page: number, pageSize: number, host: string) => void;
    isLoading: boolean;
}

type PaginationContextProps = {
    count:number,
    currentPage:number,
    data:Asset[],
    pageSize:number,
    goToPage: (value: number) => void,
    isLoading: boolean,
};

export const PaginationContext = createContext<PaginationContextProps>({
    count: 0,
    currentPage: 1,
    data: [],
    pageSize: 10,
    goToPage: () => null,
    isLoading: true,
});

export default function Pagination({data, count, getData, isLoading}: PaginationProps) {
    const [ currentPage, setCurrentPage ] = useState(1); // natural number
    const [ pageSize, setPageSize ] = useState(10);
    const [ host, setHost ] = useState<string>("");

    const goToPage = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        getData(pageNumber, pageSize, host);
    }

  return (
    <PaginationContext.Provider value={{ count, currentPage, data, pageSize, goToPage, isLoading }}>
          <div className='mt-2 text-sm text-gray-800'>
             <div>
                Filters: 
                Host: <input type="text" value={host} onChange={(event) => setHost(event.target.value)} />
            </div>
            {
              data
                .map((item: Asset) => 
                  <Comment key={item.id} asset={item} />)
            }
            <PaginationFooter />
          </div>
    </PaginationContext.Provider>
  );
}
