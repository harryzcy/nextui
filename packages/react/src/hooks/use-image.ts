"use client";

import type {ImgHTMLAttributes, SyntheticEvent} from "react";

import {useCallback, useEffect, useRef, useState} from "react";

import {useIsHydrated} from "./use-is-hydrated";
import {useSafeLayoutEffect} from "./use-safe-layout-effect";

type NativeImageProps = ImgHTMLAttributes<HTMLImageElement>;

export interface UseImageProps {
  /**
   * The image `src` attribute
   */
  src?: string;
  /**
   * The image `srcset` attribute
   */
  srcSet?: string;
  /**
   * The image `sizes` attribute
   */
  sizes?: string;
  /**
   * A callback for when the image `src` has been loaded
   */
  onLoad?: NativeImageProps["onLoad"];
  /**
   * A callback for when the image loading status changes
   */
  onLoadingStatusChange?: (status: ImgLoadingStatus) => void;
  /**
   * A callback for when there was an error loading the image `src`
   */
  onError?: NativeImageProps["onError"];
  /**
   * If `true`, opt out of the `fallbackSrc` logic and use as `img`
   */
  ignoreFallback?: boolean;
  /**
   * The key used to set the crossOrigin on the HTMLImageElement into which the image will be loaded.
   * This tells the browser to request cross-origin access when trying to download the image data.
   */
  crossOrigin?: NativeImageProps["crossOrigin"];
  /**
   * Defines the `loading` attribute for the image
   */
  loading?: NativeImageProps["loading"];
  /**
   * If `true`, image load will be bypassed and the load will be handled by `as` component.
   */
  shouldBypassImageLoad?: boolean;
}

export type ImgLoadingStatus = "loading" | "failed" | "pending" | "loaded";

export type FallbackStrategy = "onError" | "beforeLoadOrError";

type ImageEvent = SyntheticEvent<HTMLImageElement, Event>;
/**
 * React hook that loads an image in the browser,
 * and lets us know the `status` so we can show image
 * fallback if it is still `pending`
 *
 * @returns the status of the image loading progress
 *
 * @example
 *
 * ```jsx
 * function App(){
 *   const status = useImage({ src: "image.png" })
 *   return status === "loaded" ? <img src="image.png" /> : <Placeholder />
 * }
 * ```
 */

export function useImage(props: UseImageProps = {}) {
  const {
    crossOrigin,
    ignoreFallback,
    loading,
    onError,
    onLoad,
    onLoadingStatusChange,
    shouldBypassImageLoad = false,
    sizes,
    src,
    srcSet,
  } = props;

  const isHydrated = useIsHydrated();

  const imageRef = useRef<HTMLImageElement | null>(isHydrated ? new Image() : null);

  const [status, setStatus] = useState<ImgLoadingStatus>("pending");

  useEffect(() => {
    if (!imageRef.current) return;
    imageRef.current.onload = (event) => {
      flush();
      setStatus("loaded");
      onLoadingStatusChange?.("loaded");
      onLoad?.(event as unknown as ImageEvent);
    };
    imageRef.current.onerror = (error) => {
      flush();
      setStatus("failed");
      onLoadingStatusChange?.("failed");
      onError?.(error as any);
    };
  }, [imageRef.current]);

  const flush = () => {
    if (imageRef.current) {
      imageRef.current.onload = null;
      imageRef.current.onerror = null;
      imageRef.current = null;
    }
  };

  const load = useCallback((): ImgLoadingStatus => {
    if (!src) return "pending";
    if (ignoreFallback || shouldBypassImageLoad) return "loaded";

    const img = new Image();

    img.src = src;
    if (crossOrigin) img.crossOrigin = crossOrigin;
    if (srcSet) img.srcset = srcSet;
    if (sizes) img.sizes = sizes;
    if (loading) img.loading = loading;

    imageRef.current = img;
    if (img.complete && img.naturalWidth) {
      return "loaded";
    }

    return "loading";
  }, [src, crossOrigin, srcSet, sizes, onLoad, onError, loading, shouldBypassImageLoad]);

  useSafeLayoutEffect(() => {
    if (isHydrated) {
      const status = load();

      setStatus(status);
      onLoadingStatusChange?.(status);
    }
  }, [isHydrated, load]);

  /**
   * If user opts out of the fallback/placeholder
   * logic, let's just return 'loaded'
   */
  return ignoreFallback ? "loaded" : status;
}

export const shouldShowFallbackImage = (
  status: ImgLoadingStatus,
  fallbackStrategy: FallbackStrategy,
) =>
  (status !== "loaded" && fallbackStrategy === "beforeLoadOrError") ||
  (status === "failed" && fallbackStrategy === "onError");

export type UseImageReturn = ReturnType<typeof useImage>;
