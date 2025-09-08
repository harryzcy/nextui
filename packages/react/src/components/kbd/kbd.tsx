"use client";

import type {KbdKey} from "./kbd.constants";

import React, {createContext, useContext} from "react";

import {kbdKeysLabelMap, kbdKeysMap} from "./kbd.constants";
import {kbdVariants} from "./kbd.styles";

const KbdContext = createContext<{
  slots?: ReturnType<typeof kbdVariants>;
}>({});

/* -------------------------------------------------------------------------------------------------
 * Kbd
 * -----------------------------------------------------------------------------------------------*/

interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
}

const KbdRoot = React.forwardRef<HTMLElement, KbdProps>(({children, className, ...props}, ref) => {
  const slots = React.useMemo(() => kbdVariants(), []);

  return (
    <KbdContext.Provider value={{slots}}>
      <kbd ref={ref} {...props} className={slots.base({className})}>
        {children}
      </kbd>
    </KbdContext.Provider>
  );
});

KbdRoot.displayName = "HeroUI.Kbd";

/* -----------------------------------------------------------------------------------------------*/

interface KbdAbbrProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  /**
   * The keyboard key to display
   */
  keyValue: KbdKey;
}

const KbdAbbr = React.forwardRef<HTMLElement, KbdAbbrProps>(
  ({className, keyValue, ...props}, ref) => {
    const {slots} = useContext(KbdContext);

    return (
      <abbr
        ref={ref}
        className={slots?.abbr({className})}
        title={kbdKeysLabelMap[keyValue]}
        {...props}
      >
        {kbdKeysMap[keyValue]}
      </abbr>
    );
  },
);

KbdAbbr.displayName = "HeroUI.Kbd.Abbr";

/* -----------------------------------------------------------------------------------------------*/

interface KbdContentProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  className?: string;
}

const KbdContent = React.forwardRef<HTMLSpanElement, KbdContentProps>(
  ({children, className, ...props}, ref) => {
    const {slots} = useContext(KbdContext);

    return (
      <span ref={ref} className={slots?.content({className})} {...props}>
        {children}
      </span>
    );
  },
);

KbdContent.displayName = "HeroUI.Kbd.Content";

/* -----------------------------------------------------------------------------------------------*/

const CompoundKbd = Object.assign(KbdRoot, {
  Abbr: KbdAbbr,
  Content: KbdContent,
});

export type {KbdProps, KbdAbbrProps, KbdContentProps};
export default CompoundKbd;
