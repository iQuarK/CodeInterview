'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import React, { useContext } from 'react';
import { RiArrowLeftDoubleFill, RiArrowRightDoubleFill } from 'react-icons/ri';
import '@/lib/env';

import Button from '@/components/buttons/Button';

import { PaginationContext } from './Pagination';


export default function PaginationFooter() {
  const {count, currentPage, pageSize, goToPage} = useContext(PaginationContext);

return (
<div className="mt-10">
  <Button
      variant='outline'
      rightIcon={RiArrowLeftDoubleFill}
      disabled={ currentPage === 1 }
      onClick={() => goToPage(1)}
    >
    First
  </Button>
  <Button
      variant='outline'
      rightIcon={ArrowLeft}
      disabled={ currentPage === 1 }
      onClick={() => goToPage(currentPage - 1)}
    >
    Previous
  </Button>
  { currentPage > Math.floor(9/2) ?
    <Button
        variant="outline" disabled={true}>...</Button>:null
  }
  {
    Array.from(
      { length: 9 },
      (_, index) => currentPage + (index - Math.ceil(9/2)) + 1
    )
    .filter(i => i>0 && i<=count/pageSize)
    .map(page =>
      <Button
        key={`page-${page}`}
        variant={ page === currentPage ? 'primary' : 'outline' }
        onClick={() => goToPage(page)}>{page}</Button>
    )
  }
  { currentPage < count/pageSize - Math.ceil(9/2) ?
    <Button
        variant="outline" disabled={true}>...</Button>:null
  }
  <Button
      variant='outline'
      rightIcon={ArrowRight}
      disabled={ currentPage === count/pageSize }
      onClick={() => goToPage(currentPage + 1)}
    >
    Next
  </Button>
  <Button
      variant='outline'
      rightIcon={RiArrowRightDoubleFill}
      disabled={ currentPage === count/pageSize }
      onClick={() => goToPage(count/pageSize)}
    >
    Last
  </Button>
</div>)
}
