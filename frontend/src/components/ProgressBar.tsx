import * as React from 'react';

type ProgressBarProps = {
    percent: number
};

export default function ProgressBar({ percent }: ProgressBarProps) {
  return (
    <div className="progress-bar bg-neutral-200">
      <div className="progress-bar-internal bg-red-600 h-3" style={{width: `${Math.min(percent, 100)}%`}}></div>
    </div>
  );
}
