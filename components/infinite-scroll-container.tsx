import React from "react";
import { useInView } from "react-intersection-observer";
interface InfiniteScrollContainerProps extends React.PropsWithChildren {
  onBottomReached: () => void;
  className?: string;
  rootMargin?: string;
}

export default function InfiniteScrollContainer({
  onBottomReached,
  children,
  rootMargin,
  className,
}: InfiniteScrollContainerProps) {
  const { ref } = useInView({
    rootMargin: rootMargin || "200px",
    onChange(inView, _) {
      if (inView) {
        onBottomReached();
      }
    },
  });
  return (
    <div className={className}>
      {children}
      <div ref={ref}></div>
    </div>
  );
}
