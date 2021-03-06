/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";
import { isNodeEnv } from "./utils";

/**
 * An abstract component that Blueprint components can extend
 * in order to add some common functionality like runtime props validation.
 */
export abstract class AbstractComponent<P, S> extends React.Component<P, S> {
    /** Component displayName should be `public static`. This property exists to prevent incorrect usage. */
    protected displayName: never;

    // Not bothering to remove entries when their timeouts finish because clearing invalid ID is a no-op
    private timeoutIds: number[] = [];

    constructor(props?: P, context?: any) {
        super(props, context);
        if (!isNodeEnv("production")) {
            this.validateProps(this.props);
        }
    }

    public componentWillReceiveProps(nextProps: P & { children?: React.ReactNode }) {
        if (!isNodeEnv("production")) {
            this.validateProps(nextProps);
        }
    }

    public componentWillUnmount() {
        this.clearTimeouts();
    }

    /**
     * Set a timeout and remember its ID.
     * All stored timeouts will be cleared when component unmounts.
     * @returns a "cancel" function that will clear timeout when invoked.
     */
    public setTimeout(callback: () => void, timeout?: number) {
        const handle = setTimeout(callback, timeout);
        this.timeoutIds.push(handle);
        return () => clearTimeout(handle);
    }

    /**
     * Clear all known timeouts.
     */
    public clearTimeouts = () => {
        if (this.timeoutIds.length > 0) {
            for (const timeoutId of this.timeoutIds) {
                clearTimeout(timeoutId);
            }
            this.timeoutIds = [];
        }
    };

    /**
     * Ensures that the props specified for a component are valid.
     * Implementations should check that props are valid and usually throw an Error if they are not.
     * Implementations should not duplicate checks that the type system already guarantees.
     *
     * This method should be used instead of React's
     * [propTypes](https://facebook.github.io/react/docs/reusable-components.html#prop-validation) feature.
     * In contrast to propTypes, these runtime checks are _always_ run, not just in development mode.
     */
    protected validateProps(_: P & { children?: React.ReactNode }) {
        // implement in subclass
    }
}
