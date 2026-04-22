"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface UseCustomSearchParamsReturn {
  /**
   * Returns a new query string with the updated search parameter.
   * Does NOT update the browser URL.
   */
  updateSearchParams: (name: string, value: string) => string;

  /**
   * Updates the URL in the browser by adding/updating a search parameter.
   */
  updateSearchParamsAndNavigate: (name: string, value: string) => void;

  /**
   * Navigates to a URL with an updated search parameter.
   */
  navigateOnclick: (name: string, value: string, pathname?: string) => void;

  /**
   * Generates a navigation link with current search params and optional path.
   */
  getNavigationLinkWithoutUpdate: (pathnameEndPoint?: string) => string;

  /**
   * Generates a navigation link using a new pathname and current search params.
   */
  getNavigationLinkWithPathnameWithoutUpdate: (pathname: string) => string;

  /**
   * Navigates to a new path (relative), preserving current search parameters.
   */
  navigateOnclickWithoutUpdate: (pathnameEndPoint?: string) => void;

  /**
   * Navigates to a new pathname (absolute), preserving current search parameters.
   */
  navigateOnclickWithPathnameWithoutUpdate: (pathname: string) => void;
}

/**
 * Custom hook for managing and manipulating search parameters (query strings)
 * in the URL in a Next.js app using the app router.
 */
export const useCustomSearchParams = (): UseCustomSearchParamsReturn => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPathname = usePathname();

  /**
   * Returns a new query string with the updated search parameter.
   * Does NOT update the browser URL.
   *
   * @param name - The query parameter name.
   * @param value - The value to assign to the query parameter.
   * @returns Updated query string.
   */
  const updateSearchParams = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  /**
   * Updates the URL in the browser by adding/updating a search parameter,
   * and navigates to the new URL.
   *
   * @param name - The query parameter name.
   * @param value - The value to assign to the query parameter.
   */
  const updateSearchParamsAndNavigate = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      router.push(currentPathname + "?" + params.toString());
    },
    [searchParams, currentPathname, router],
  );

  /**
   * Navigates to a URL with an updated query parameter.
   * Optionally accepts a new pathname; defaults to the current one.
   *
   * @param name - The query parameter name.
   * @param value - The value to assign to the query parameter.
   * @param pathname - Optional new pathname to navigate to.
   */
  const navigateOnclick = useCallback(
    (name: string, value: string, pathname?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      router.push((!pathname ? "" : pathname) + "?" + params.toString());
    },
    [searchParams, router],
  );

  /**
   * Generates a navigation link that includes the current search parameters,
   * and appends the given endpoint to the current pathname.
   *
   * @param pathnameEndPoint - The path segment to append (e.g., '/slug').
   * @returns Full URL with query parameters.
   */
  const getNavigationLinkWithoutUpdate = useCallback(
    (pathnameEndPoint?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      return (
        currentPathname +
        (!pathnameEndPoint ? "" : pathnameEndPoint) +
        "?" +
        params.toString()
      );
    },
    [searchParams, currentPathname],
  );

  /**
   * Similar to getNavigationLinkWithoutUpdate, but uses a custom full pathname.
   *
   * @param pathname - Full pathname to use (e.g., '/products').
   * @returns Full URL with query parameters.
   */
  const getNavigationLinkWithPathnameWithoutUpdate = useCallback(
    (pathname: string) => {
      const params = new URLSearchParams(searchParams.toString());
      return pathname + "?" + params.toString();
    },
    [searchParams],
  );

  /**
   * Navigates to a new path (appended to the current one),
   * preserving current search parameters.
   *
   * @param pathnameEndPoint - The path segment to append.
   */
  const navigateOnclickWithoutUpdate = useCallback(
    (pathnameEndPoint?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      router.push(
        currentPathname +
          (!pathnameEndPoint ? "" : pathnameEndPoint) +
          "?" +
          params.toString(),
      );
    },
    [searchParams, router, currentPathname],
  );

  /**
   * Navigates to a completely new pathname while preserving current search parameters.
   *
   * @param pathname - The new full pathname to navigate to.
   */
  const navigateOnclickWithPathnameWithoutUpdate = useCallback(
    (pathname: string) => {
      const params = new URLSearchParams(searchParams.toString());
      router.push(pathname + "?" + params.toString());
    },
    [searchParams, router],
  );

  return {
    updateSearchParams,
    updateSearchParamsAndNavigate,
    navigateOnclick,
    navigateOnclickWithoutUpdate,
    navigateOnclickWithPathnameWithoutUpdate,
    getNavigationLinkWithoutUpdate,
    getNavigationLinkWithPathnameWithoutUpdate,
  };
};
