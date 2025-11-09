"use client";

import * as React from "react";
import { motion, isMotionComponent, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

type AnyProps = Record<string, unknown>;

type DOMMotionProps<T extends HTMLElement = HTMLElement> = Omit<
  HTMLMotionProps<keyof HTMLElementTagNameMap>,
  "ref"
> & { ref?: React.Ref<T> };

type WithAsChild<Base extends object> =
  | (Base & { asChild: true; children: React.ReactElement })
  | (Base & { asChild?: false | undefined });

type SlotProps<T extends HTMLElement = HTMLElement> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: any;
} & DOMMotionProps<T>;

function mergeRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
  return (node) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === "function") {
        ref(node);
      } else {
        (ref as React.RefObject<T | null>).current = node;
      }
    });
  };
}

function mergeProps<T extends HTMLElement>(
  childProps: AnyProps,
  slotProps: DOMMotionProps<T>
): AnyProps {
  const merged: AnyProps = { ...childProps, ...slotProps };

  if (childProps.className || slotProps.className) {
    merged.className = cn(
      childProps.className as string,
      slotProps.className as string
    );
  }

  if (childProps.style || slotProps.style) {
    merged.style = {
      ...(childProps.style as React.CSSProperties),
      ...(slotProps.style as React.CSSProperties),
    };
  }

  return merged;
}

// Global cache for motion components - created outside of render
const motionComponentCache = new Map<React.ElementType, React.ElementType>();

function getOrCreateMotionComponent(
  component: React.ElementType
): React.ElementType {
  if (!motionComponentCache.has(component)) {
    motionComponentCache.set(component, motion.create(component));
  }
  return motionComponentCache.get(component)!;
}

function Slot<T extends HTMLElement = HTMLElement>({
  children,
  ref,
  ...props
}: SlotProps<T>) {
  const isValid = React.isValidElement(children);
  const childrenType = isValid ? children.type : null;

  const isAlreadyMotion =
    isValid &&
    typeof childrenType === "object" &&
    childrenType !== null &&
    isMotionComponent(childrenType);

  // Store component in state - initialized lazily, created in useEffect
  const [Base, setBase] = React.useState<React.ElementType | null>(() => {
    // Only initialize if already a motion component
    if (isAlreadyMotion && childrenType) {
      return childrenType as React.ElementType;
    }
    return null;
  });

  // Create motion component in useEffect (after render, not during)
  React.useEffect(() => {
    if (!isValid || !childrenType) return;

    if (isAlreadyMotion) {
      setBase(childrenType as React.ElementType);
    } else {
      // This runs after render, so motion.create() is safe here
      setBase(getOrCreateMotionComponent(childrenType as React.ElementType));
    }
  }, [isValid, isAlreadyMotion, childrenType]);

  if (!isValid) return null;

  const { ref: childRef, ...childProps } = children.props as AnyProps;

  const mergedProps = mergeProps(childProps, props);

  // Fallback to original component if Base is not ready yet
  if (Base === null) {
    const OriginalComponent = childrenType as React.ElementType;
    return (
      <OriginalComponent
        {...mergedProps}
        ref={mergeRefs(childRef as React.Ref<T>, ref)}
      />
    );
  }

  return (
    <Base {...mergedProps} ref={mergeRefs(childRef as React.Ref<T>, ref)} />
  );
}

export {
  Slot,
  type SlotProps,
  type WithAsChild,
  type DOMMotionProps,
  type AnyProps,
};
