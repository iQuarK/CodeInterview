'use client';

import React, { useCallback, useEffect, useState }  from 'react';
import '@/lib/env';

import { addToLocalStorage, getFromLocalStorage } from '@/lib/helper';

import InfiniteScroll from '@/components/infinite-scroll/InfiniteScroll';

import Logo from '~/svg/Logo.svg';

export type Asset = {
  comment: string;
  owner: string;
  host: string;
  id?: number;
};

export type Data = {
  page: number;
  assets: Asset[];
};

const defaultAsset = {
  comment: "",
  owner: "",
  host: ""
};

const defaultData: Data = {
  page: 0,
  assets: []
}

export default function HomePage() {
  const [ loading, setLoading ] = useState(true);
  const [ data, setData ] = useState<Data[]>([ defaultData ]);
  const [ count, setCount ] = useState(0);
  const [ host, setHost ] = useState<string>("");
  const [ pageSize ] = useState(25);
  const [ currentPage, setCurrentPage ] = useState(1); // natural number

  const getCount = useCallback((host:string): Promise<number> => {
    return new Promise((resolve,reject) => {
      fetch(`/api/assets/count?host=${host}`)
        .then(response => response.json())
        .then(data => {
          setCount(data.count);
          if (data.count === 0) {
            setData([ defaultData ]);
          }
          resolve(data.count);
        }).catch((reason) => reject(reason))
    });
  }, []);
  
  const getAssets = useCallback((pageNumber: number, pageSize:number, host:string): Promise<Data[]> => {
    return new Promise((resolve,reject) => {
      const updateData = (dataJson: Data) => {
        if (dataJson.assets) {
        const newData: Data[] = [ ...data ];
          newData[dataJson.page] = dataJson;
          setData(newData);
          resolve(newData);
        } else {
          resolve(data);
        }
      };
      const cached = getFromLocalStorage(`${host}-${pageSize}-${pageNumber}`);

      if (cached !== null) {
        updateData(JSON.parse(cached));
      } else {
        fetch(`/api/assets?pageNumber=${pageNumber}&pageSize=${pageSize}&host=${host}`)
          .then(response => response.json())
          .then((dataJson: Data) => {
            addToLocalStorage(`${host}-${pageSize}-${pageNumber}`, JSON.stringify(dataJson));
            updateData(dataJson);
          }).catch((reason) => reject(reason));
      }
    });
  }, [data]);

  const reserveSpace = useCallback((pageNumber = 1, pageSize = 10) => {   // creates the space for the coming data for loading stage
    const newData: Data[] = [ ...data ];
    newData[pageNumber] = { page: pageNumber, assets: new Array<Asset>(pageSize).fill(defaultAsset) };
    setData(newData);
  }, [data]);

  const getPage = useCallback((pageNumber = 1, host = ''): Promise<[number, Data[]]> => {
    setLoading(true);
    setCurrentPage(pageNumber);

    reserveSpace(pageNumber, pageSize);
    return Promise.all([getCount(host), getAssets(pageNumber, pageSize, host)])
      .finally(() => {
          setLoading(false);
      });
  },[getAssets, getCount, pageSize, reserveSpace]);

  const getNextPage = () => {
    if (currentPage >= totalPages()) {
      return;
    }

    setLoading(true);
    reserveSpace(currentPage + 1, pageSize);

    return getAssets(currentPage + 1, pageSize, host)
    .finally(() => {
      setCurrentPage(currentPage + 1);
      setLoading(false);
    });
  };

  const doSearch = (value:string) => {
    if (value !== host) {
      setData([ defaultData ]);
      setHost(value);
    }
  };

  const totalPages = () => count > 0 ? Math.ceil(count/pageSize) : 0;

  useEffect(() => {
    getPage(1, host);
  }, [host]);
  
  useEffect(() => {
    getPage();
  }, []);

  return (
    <main>
      <section className='bg-white'>
        <div className='layout relative flex min-h-screen flex-col items-center justify-start p-12 text-center'>
          <Logo className='w-16' />
          <h1 className='mt-4'>Code challenge</h1>
          <InfiniteScroll
            data={data}
            count={count}
            currentPage={currentPage}
            getNextPage={getNextPage}
            isLoading={loading}
            doSearch={doSearch}
            pageSize={pageSize}
          />
          <div className='bg-yellow-200 min-w-[520px] font-bold p-5'>
            Total items: {count}<br/>
            Last page retrieved: {currentPage} of {totalPages()}
          </div>
        </div>
      </section>
    </main>
  );
}
