import * as React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  // Put Header or Footer Here
  return (
    <div className='container mx-auto flex justify-center px-4'>
      <div className='max-w-screen-lg'>{children}</div>
    </div>
  );
}
