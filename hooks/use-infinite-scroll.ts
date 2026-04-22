"use client";

import { useEffect } from "react";

export function useInfiniteScroll(callback: () => void) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callback();
        }
      },
      { threshold: 1 },
    );

    const el = document.getElementById("load-more");

    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [callback]);
}
