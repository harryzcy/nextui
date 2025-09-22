"use client";

import type {CardVariants} from "./card.styles";
import type {ButtonProps as ButtonPrimitiveProps} from "react-aria-components";

import {Slot} from "@radix-ui/react-slot";
import React, {createContext, useContext} from "react";
import {Button as ButtonPrimitive} from "react-aria-components";

import {composeTwRenderProps} from "../../utils";
import {CloseIcon} from "../icons";

import {cardVariants} from "./card.styles";

/* -------------------------------------------------------------------------------------------------
 * Card Context
 * -----------------------------------------------------------------------------------------------*/

interface CardContext {
  slots?: ReturnType<typeof cardVariants>;
}

const CardContext = createContext<CardContext>({});

/* -------------------------------------------------------------------------------------------------
 * Card
 * -----------------------------------------------------------------------------------------------*/

interface CardRootProps extends React.HTMLAttributes<HTMLDivElement>, CardVariants {
  asChild?: boolean;
}

const CardRoot = React.forwardRef<HTMLDivElement, CardRootProps>(
  ({asChild = false, children, className, surface, variant, ...props}, ref) => {
    const slots = React.useMemo(() => cardVariants({surface, variant}), [surface, variant]);
    const Comp = asChild ? Slot : "div";

    return (
      <CardContext.Provider value={{slots}}>
        <Comp ref={ref} data-card className={slots.base({className})} {...props}>
          {children}
        </Comp>
      </CardContext.Provider>
    );
  },
);

CardRoot.displayName = "HeroUI.Card";

/* -------------------------------------------------------------------------------------------------
 * Card Header
 * -----------------------------------------------------------------------------------------------*/

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({asChild = false, className, ...props}, ref) => {
    const {slots} = useContext(CardContext);
    const Comp = asChild ? Slot : "div";

    return <Comp ref={ref} data-card-header className={slots?.header({className})} {...props} />;
  },
);

CardHeader.displayName = "HeroUI.Card.Header";

/* -------------------------------------------------------------------------------------------------
 * Card Title
 * -----------------------------------------------------------------------------------------------*/

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  asChild?: boolean;
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({asChild = false, className, ...props}, ref) => {
    const {slots} = useContext(CardContext);
    const Comp = asChild ? Slot : "h3";

    return <Comp ref={ref} data-card-title className={slots?.title({className})} {...props} />;
  },
);

CardTitle.displayName = "HeroUI.Card.Title";

/* -------------------------------------------------------------------------------------------------
 * Card Description
 * -----------------------------------------------------------------------------------------------*/

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  asChild?: boolean;
}

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({asChild = false, className, ...props}, ref) => {
    const {slots} = useContext(CardContext);
    const Comp = asChild ? Slot : "p";

    return (
      <Comp
        ref={ref}
        data-card-description
        className={slots?.description({className})}
        {...props}
      />
    );
  },
);

CardDescription.displayName = "HeroUI.Card.Description";

/* -------------------------------------------------------------------------------------------------
 * Card Content
 * -----------------------------------------------------------------------------------------------*/

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({asChild = false, className, ...props}, ref) => {
    const {slots} = useContext(CardContext);
    const Comp = asChild ? Slot : "div";

    return <Comp ref={ref} data-card-content className={slots?.content({className})} {...props} />;
  },
);

CardContent.displayName = "HeroUI.Card.Content";

/* -------------------------------------------------------------------------------------------------
 * Card Footer
 * -----------------------------------------------------------------------------------------------*/

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({asChild = false, className, ...props}, ref) => {
    const {slots} = useContext(CardContext);
    const Comp = asChild ? Slot : "div";

    return <Comp ref={ref} data-card-footer className={slots?.footer({className})} {...props} />;
  },
);

CardFooter.displayName = "HeroUI.Card.Footer";

/* -------------------------------------------------------------------------------------------------
 * Card Image
 * -----------------------------------------------------------------------------------------------*/

interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  asChild?: boolean;
}

const CardImage = React.forwardRef<HTMLImageElement, CardImageProps>(
  ({asChild = false, className, ...props}, ref) => {
    const {slots} = useContext(CardContext);
    const Comp = asChild ? Slot : "img";

    return <Comp ref={ref} data-card-image className={slots?.image({className})} {...props} />;
  },
);

CardImage.displayName = "HeroUI.Card.Image";

/* -------------------------------------------------------------------------------------------------
 * Card Close
 * -----------------------------------------------------------------------------------------------*/

interface CardCloseButtonProps extends ButtonPrimitiveProps {
  asChild?: boolean;
}

const CardCloseButton = React.forwardRef<HTMLButtonElement, CardCloseButtonProps>(
  ({children, className, ...props}, ref) => {
    const {slots} = useContext(CardContext);

    return (
      <ButtonPrimitive
        ref={ref}
        data-card-close-button
        className={composeTwRenderProps(className, slots?.closeButton())}
        {...props}
      >
        {(renderProps) =>
          typeof children === "function"
            ? children(renderProps)
            : (children ?? <CloseIcon data-card-close-icon />)
        }
      </ButtonPrimitive>
    );
  },
);

CardCloseButton.displayName = "HeroUI.Card.CloseButton";

/* -------------------------------------------------------------------------------------------------
 * Card Details
 * -----------------------------------------------------------------------------------------------*/

interface CardDetailsProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const CardDetails = React.forwardRef<HTMLDivElement, CardDetailsProps>(
  ({asChild = false, className, ...props}, ref) => {
    const {slots} = useContext(CardContext);
    const Comp = asChild ? Slot : "div";

    return <Comp ref={ref} data-card-details className={slots?.details({className})} {...props} />;
  },
);

CardDetails.displayName = "HeroUI.Card.Details";

/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/

const CompoundCard = Object.assign(CardRoot, {
  Content: CardContent,
  Description: CardDescription,
  Details: CardDetails,
  Footer: CardFooter,
  Header: CardHeader,
  Image: CardImage,
  Title: CardTitle,
  CloseButton: CardCloseButton,
});

export type {
  CardRootProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardDetailsProps,
  CardFooterProps,
  CardImageProps,
  CardCloseButtonProps,
};

export default CompoundCard;
