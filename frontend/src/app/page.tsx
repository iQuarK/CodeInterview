'use client';

import React, { useEffect, useState }  from 'react';
import '@/lib/env';

import logger from '@/lib/logger';

import Pagination from '@/components/pagination/Pagination';

import Logo from '~/svg/Logo.svg';

export type Asset = {
  comment: string;
  owner: string;
  id: number;
};

export default function HomePage() {
  const [ loading, setLoading ] = useState(true);
  const [ data, setData ] = useState<Asset[]>([]);
  const [ count, setCount ] = useState(0);

  const getCount = () => {
    fetch('/api/assets/count')
      .then(response => response.json())
      .then(data => setCount(data.count));
  };
  
  const getAssets = (pageNumber: number, pageSize:number, host:string) => {
    fetch(`/api/assets?pageNumber=${pageNumber}&pageSize=${pageSize}&host={host}`)
      .then(response => response.json())
      .then(dataJson => {logger(dataJson, 'setting data'); setData(dataJson);});
  };

  const getPage = (pageNumber = 1, pageSize = 10, host="") => {
    Promise.all([getCount(), getAssets(pageNumber, pageSize, host)])
      .then(() => {
        setLoading(false)
      });
  };

  useEffect(() => {
    getPage();
  }, []);

  return (
    <main>
      <section className='bg-white'>
        <div className='layout relative flex min-h-screen flex-col items-center justify-center py-12 text-center'>
          <Logo className='w-16' />
          <h1 className='mt-4'>Code challenge</h1>
          <Pagination data={data} count={count} isLoading={loading} getData={getPage} />
        </div>
      </section>
    </main>
  );
}
