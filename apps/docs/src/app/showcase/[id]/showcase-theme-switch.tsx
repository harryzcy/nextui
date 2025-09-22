"use client";

import {Button, Tooltip} from "@heroui/react";
import React from "react";

import {Iconify} from "@/components/iconify";
import {useIsMounted} from "@/hooks/use-is-mounted";
import {cn} from "@/utils/cn";

import {useShowcase} from "./showcase-wrapper";

export function ShowcaseThemeSwitch() {
  const {setShowcaseTheme, showcaseTheme, supportsThemeSwitching} = useShowcase();
  const isMounted = useIsMounted();
  const isDisabled = !supportsThemeSwitching;

  if (!isMounted) {
    return (
      <Button
        isIconOnly
        aria-label="Toggle showcase theme"
        className="border-none"
        isDisabled={isDisabled}
        variant="tertiary"
      >
        <div className="relative h-5 w-5">
          <Iconify className="text-foreground/70 h-5 w-5" icon="sun" />
        </div>
      </Button>
    );
  }

  const isDark = showcaseTheme === "dark";

  const onPress = () => {
    if (!isDisabled) {
      setShowcaseTheme(isDark ? "light" : "dark");
    }
  };

  // Determine the tooltip content based on whether switching is disabled
  const tooltipContent = isDisabled
    ? "Theme switching not supported for this showcase"
    : "Toggle theme";

  return (
    <Tooltip delay={1500}>
      <Button
        isIconOnly
        aria-label="Toggle showcase theme"
        className={cn("border-none", isDisabled && "cursor-not-allowed opacity-50")}
        isDisabled={isDisabled}
        variant="secondary"
        onPress={onPress}
      >
        <Iconify className="text-foreground/70 m-0" icon={isDark ? "moon" : "sun"} />
      </Button>
      <Tooltip.Content offset={7}>
        <Tooltip.Arrow />
        <p className="text-muted text-xs">{tooltipContent}</p>
      </Tooltip.Content>
    </Tooltip>
  );
}
