"use client";

import type {TabsVariants} from "./tabs.styles";
import type {
  TabListProps as TabListPrimitiveProps,
  TabPanelProps as TabPanelPrimitiveProps,
  TabProps as TabPrimitiveProps,
  TabsProps as TabsPrimitiveProps,
} from "react-aria-components";

import React, {createContext, useContext} from "react";
import {
  SelectionIndicator as SelectionIndicatorPrimitive,
  TabList as TabListPrimitive,
  TabPanel as TabPanelPrimitive,
  Tab as TabPrimitive,
  Tabs as TabsPrimitive,
} from "react-aria-components";

import {composeTwRenderProps} from "../../utils/compose";

import {tabsVariants} from "./tabs.styles";

const TabsContext = createContext<{
  slots?: ReturnType<typeof tabsVariants>;
  orientation?: "horizontal" | "vertical";
}>({});

/* -------------------------------------------------------------------------------------------------
 * Tabs
 * -----------------------------------------------------------------------------------------------*/

interface TabsProps extends TabsPrimitiveProps, TabsVariants {
  children: React.ReactNode;
  className?: string;
}

const TabsRoot = React.forwardRef<React.ElementRef<typeof TabsPrimitive>, TabsProps>(
  ({children, className, orientation = "horizontal", ...props}, ref) => {
    const slots = React.useMemo(() => tabsVariants(), []);

    return (
      <TabsContext.Provider value={{slots, orientation}}>
        <TabsPrimitive
          {...props}
          ref={ref}
          data-tabs
          className={composeTwRenderProps(className, slots.base())}
          orientation={orientation}
        >
          {children}
        </TabsPrimitive>
      </TabsContext.Provider>
    );
  },
);

TabsRoot.displayName = "HeroUI.Tabs";
/* -----------------------------------------------------------------------------------------------*/

interface TabListWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const TabListWrapper = React.forwardRef<React.ElementRef<"div">, TabListWrapperProps>(
  ({children, className, ...props}, ref) => {
    const {slots} = useContext(TabsContext);

    return (
      <div
        data-tabs-list-wrapper
        className={slots?.tabListWrapper({className})}
        {...props}
        ref={ref}
      >
        {children}
      </div>
    );
  },
);

TabListWrapper.displayName = "HeroUI.TabListWrapper";

/* -----------------------------------------------------------------------------------------------*/

interface TabListProps extends TabListPrimitiveProps<object> {
  children: React.ReactNode;
  className?: string;
}

const TabList = React.forwardRef<React.ElementRef<typeof TabListPrimitive>, TabListProps>(
  ({children, className, ...props}, ref) => {
    const {slots} = useContext(TabsContext);

    return (
      <TabListPrimitive
        {...props}
        ref={ref}
        data-tabs-list
        className={composeTwRenderProps(className, slots?.tabList())}
      >
        {children}
      </TabListPrimitive>
    );
  },
);

TabList.displayName = "HeroUI.TabList";

/* -----------------------------------------------------------------------------------------------*/

interface TabProps extends TabPrimitiveProps {
  className?: string;
}

const Tab = React.forwardRef<React.ElementRef<typeof TabPrimitive>, TabProps>(
  ({children, className, ...props}, ref) => {
    const {slots} = useContext(TabsContext);

    return (
      <TabPrimitive
        {...props}
        ref={ref}
        data-tabs-tab
        className={composeTwRenderProps(className, slots?.tab())}
      >
        {children}
      </TabPrimitive>
    );
  },
);

Tab.displayName = "HeroUI.Tab";

/* -----------------------------------------------------------------------------------------------*/

interface TabIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
}

const TabIndicator = React.forwardRef<
  React.ElementRef<typeof SelectionIndicatorPrimitive>,
  TabIndicatorProps
>(({className, ...props}, ref) => {
  const {slots} = useContext(TabsContext);

  return (
    <SelectionIndicatorPrimitive
      ref={ref}
      data-tabs-indicator
      className={slots?.tabIndicator({className})}
      {...props}
    />
  );
});

TabIndicator.displayName = "HeroUI.TabIndicator";

/* -----------------------------------------------------------------------------------------------*/

interface TabPanelProps extends Omit<TabPanelPrimitiveProps, "children"> {
  children: React.ReactNode;
  className?: string;
}

const TabPanel = React.forwardRef<React.ElementRef<typeof TabPanelPrimitive>, TabPanelProps>(
  ({children, className, ...props}, ref) => {
    const {slots} = useContext(TabsContext);

    return (
      <TabPanelPrimitive
        {...props}
        ref={ref}
        data-tabs-panel
        className={composeTwRenderProps(className, slots?.tabPanel())}
      >
        {children}
      </TabPanelPrimitive>
    );
  },
);

TabPanel.displayName = "HeroUI.TabPanel";

/* -----------------------------------------------------------------------------------------------*/

const CompoundTabs = Object.assign(TabsRoot, {
  ListWrapper: TabListWrapper,
  List: TabList,
  Tab: Tab,
  Indicator: TabIndicator,
  Panel: TabPanel,
});

export default CompoundTabs;
export type {TabsProps, TabListProps, TabProps, TabPanelProps};
