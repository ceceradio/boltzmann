{% if not selftest %}/* eslint-disable */{% endif %}
declare module './boltzmann.js'
/// <reference types='node' />
import { IncomingMessage, OutgoingMessage } from 'http'
import { URL } from 'url'
import { Accepts } from 'accepts'
import { Cookie } from 'cookie'
import { EventEmitter } from 'events'
import { ResponseObject } from '@hapi/shot'

{% if postgres -%}
import { Client as PostgresClient } from 'pg'
{% endif -%}
{% if redis -%}
import { IHandyRedis } from 'handy-redis'
{% endif -%}

declare const HEADER: unique symbol
declare const STATUS: unique symbol
declare const TEMPLATE: unique symbol

export * from './boltzmann.js'
export declare type BodyNext = (readable: IncomingMessage) => Promise<{ [key: string]: any }>
export declare type BodyHandler = (
  readable: IncomingMessage
) => { [key: string]: any } | Promise<{ [key: string]: any }>
export declare type BodyParser = (next: BodyNext) => BodyHandler
export declare type HttpMetadata = { [HEADER]: { [key: string]: string } } & { [STATUS]: number }
export declare type Response = void | string | AsyncIterable<Buffer | string> | Buffer | { [key: string]: any }
export declare type InternalResponse = (AsyncIterable<Buffer | string> | Buffer | { [key: string]: any }) & HttpMetadata
export declare type Handler = (context: Context, ...args: any[]) => Response | Promise<Response>
export declare type Next = (context: Context, ...args: any[]) => Promise<InternalResponse>
export declare type Adaptor = (next: Next) => Handler | Promise<Handler>
export declare interface Middleware {
  (...options: [any]): Adaptor
}

export declare class Context {
  public constructor(request: IncomingMessage, response: OutgoingMessage)
  public request: IncomingMessage
  public start: number
  public params: { [key: string]: string }
  public remote: string
  public host: string
  public id: string
  private _parsedUrl?: URL
  private _body?: { [key: string]: any }
  private _accepts?: Accepts
  private _response: OutgoingMessage
  private _routed: any
  private _cookie: Cookie
  public get cookie(): Cookie
  public get session(): Promise<Session>
  public get method(): string
  public get headers(): { [key: string]: string }
  public get url(): URL
  public set url(v: URL)
  public get query(): { [key: string]: string }
  public get body(): Promise<{ [key: string]: any }>
  public get accepts(): Accepts
  {% if postgres -%}
  get postgresClient(): Promise<PostgresClient>
  {% endif -%}
  {% if redis -%}
  get redisClient(): IHandyRedis
  {% endif -%}
  {% if honeycomb -%}
  get traceURL(): string
  {% endif -%}

  [x: string]: any
}

declare interface AugmentedResponseObject extends ResponseObject {
  json: any
}

declare class AugmentedTest extends Test {
  {% if postgres -%}
  public postgresClient: PostgresClient
  {% endif -%}
  {% if redis -%}
  public redisClient: IHandyRedis
  {% endif -%}

  request(options: {
    method?: string,
    url?: string,
    headers?: {[key: string]: string[] | string},
    payload?: any,
    [x: string]: any
  }): Promise<ResponseObject>;
}

export declare type AugmentedTestHandler = (t: AugmentedTest) => Promise<any | void> | any | void
export declare type TestHandler = (t: Test) => Promise<any | void> | any | void

export namespace middleware {
  export const log: Middleware
  export const applyXFO: Middleware
  export const handleCORS: Middleware
  export const session: Middleware
  {% if jwt -%}
  export const authenticateJWT: Middleware
  {% endif -%}
  {% if templates -%}
  export const template: Middleware
  export const templateContext: Middleware
  {% endif -%}
  {% if oauth -%}
  export const oauth: Middleware
  export const handleOAuthLogin: Middleware
  export const handleOAuthLogout: Middleware
  export const handleOAuthCallback: Middleware
  {% endif -%}
  {% if staticfiles -%}
  export const staticfiles: Middleware
  {% endif -%}
  {% if esbuild -%}
  export const esbuild: Middleware
  {% endif -%}
  {% if csrf -%}
  export const applyCSRF: Middleware
  {% endif %}

  export namespace validate {
    export const body: Middleware
    export const query: Middleware
    export const params: Middleware
  }

  export function test(options?: {
    middleware?: (Middleware | [Middleware, ...any[]])[]
    handlers?: { [key: string]: Handler }
    bodyParsers?: BodyParser[]
    after?: (xs: any) => any
  }): (handler: AugmentedTestHandler) => TestHandler
}

export namespace body {
  export const body: BodyParser
  export const urlEncoded: BodyParser
}

// Decorators are deprecated they export many of the same
// things as 'middleware', but we have legacy code we need to support.
export namespace decorators {
  export namespace validate {
    export const body: Middleware
    export const query: Middleware
    export const params: Middleware
  }

  export function test(options?: {
    middleware?: (Middleware | [Middleware, ...any[]])[]
    handlers?: { [key: string]: Handler }
    bodyParsers?: BodyParser[]
    after?: (xs: any) => any
  }): (handler: AugmentedTestHandler) => TestHandler
}

export class Cookie extends Map {
  constructor(values: Iterable<[any, any]>)
  public changed: Set<string>
  private collect(): [string]
  static from(input: string): Cookie
}

export class Session extends Map {
  constructor(id: string, values: Iterable<[any, any]>)
  public reissue(): void
}

export class BadSessionError extends Error {}
export declare function printRoutes(): Promise<string>

// inlining some TAP typings @ 14.10.1 because we need the Test class
// available in order to define TestHandler above.
declare class Test {
    constructor(options?: Options.Test);
    tearDown(fn: () => void | Promise<void>): void;
    teardown(fn: () => void | Promise<void>): void;
    setTimeout(n: number): void;
    endAll(): void;
    threw(error: Error, extra?: Error, proxy?: Test): void;
    pragma(set: Options.Pragma): void;
    plan(n: number, comment?: string): void;
    end(): void;
    test(name: string, extra?: Options.Test, cb?: (t: Test) => Promise<void> | void): Promise<void>;
    test(name: string, cb?: (t: Test) => Promise<void> | void): Promise<void>;
    todo(name: string, cb?: (t: Test) => Promise<void> | void): Promise<void>;
    todo(name: string, extra?: Options.Test, cb?: (t: Test) => Promise<void> | void): Promise<void>;
    skip(name: string, cb?: (t: Test) => Promise<void> | void): Promise<void>;
    skip(name: string, extra?: Options.Test, cb?: (t: Test) => Promise<void> | void): Promise<void>;
    only(name: string, cb?: (t: Test) => Promise<void> | void): Promise<void>;
    only(name: string, extra?: Options.Test, cb?: (t: Test) => Promise<void> | void): Promise<void>;
    current(): Test;
    stdin(name: string, extra?: Options.Bag): Promise<void>;
    spawn(cmd: string, args: string, options?: Options.Bag, name?: string, extra?: Options.Spawn): Promise<void>;
    done(): void;
    passing(): boolean;
    pass(message?: string, extra?: Options.Assert): boolean;
    fail(message?: string, extra?: Options.Assert): boolean;
    addAssert(name: string, length: number, fn: (...args: any[]) => boolean): boolean;
    comment(message: string, ...args: any[]): void;
    bailout(message?: string): void;
    beforeEach(fn: (done: () => void, childTest: Test) => void | Promise<void>): void;
    afterEach(fn: (done: () => void, childTest: Test) => void | Promise<void>): void;

    cleanSnapshot: (s: string) => string;
    formatSnapshot: (obj: any) => string;

    context: any;
    name: string;
    runOnly: boolean;
    jobs: number;

    // Assertions

    // Verifies that the object is truthy.
    ok: Assertions.Basic;
    true: Assertions.Basic;
    assert: Assertions.Basic;

    // Verifies that the object is not truthy.
    notOk: Assertions.Basic;
    false: Assertions.Basic;
    assertNot: Assertions.Basic;

    // If the object is an error, then the assertion fails.
    // Note: if an error is encountered unexpectedly, it's often better to simply throw it. The Test object will handle this as a failure.
    error: Assertions.Basic;
    ifErr: Assertions.Basic;
    ifError: Assertions.Basic;

    // Verify that the event emitter emits the named event before the end of the test.
    emits(eventEmitter: EventEmitter, event: string, message?: string, extra?: Options.Assert): void;

    // Verifies that the promise (or promise-returning function) rejects. If an expected error is provided, then also verify that the rejection matches the expected error.
    // Note: since promises always reject and resolve asynchronously, this assertion is implemented asynchronously. As such, it does not return a boolean to indicate its passing status.
    // Instead, it returns a Promise that resolves when it is completed.
    rejects(
        promiseOrFn: Promise<any> | ((...args: any[]) => Promise<any>),
        expectedError: Error,
        message?: string,
        extra?: Options.Assert,
    ): void;
    rejects(
        promiseOrFn: Promise<any> | ((...args: any[]) => Promise<any>),
        message?: string,
        extra?: Options.Assert,
    ): void;

    // Verifies that the promise (or promise-returning function) resolves, making no expectation about the value that the promise resolves to.
    // Note: since promises always reject and resolve asynchronously, this assertion is implemented asynchronously. As such, it does not return a boolean to indicate its passing status.
    // Instead, it returns a Promise that resolves when it is completed.
    resolves(
        promiseOrFn: Promise<any> | ((...args: any[]) => Promise<any>),
        message?: string,
        extra?: Options.Assert,
    ): void;

    // Verifies that the promise (or promise-returning function) resolves, and furthermore that the value of the promise matches the wanted pattern using match.
    // Note: since promises always reject and resolve asynchronously, this assertion is implemented asynchronously. As such, it does not return a boolean to indicate its passing status.
    // Instead, it returns a Promise that resolves when it is completed.
    resolveMatch(
        promiseOrFn: Promise<any> | ((...args: any[]) => Promise<any>),
        wanted: string | RegExp | { [key: string]: RegExp },
        message?: string,
        extra?: Options.Assert,
    ): void;

    // Verifies that the promise (or promise-returning function) resolves, and furthermore that the value of the promise matches the snapshot.
    // Note: since promises always reject and resolve asynchronously, this assertion is implemented asynchronously. As such, it does not return a boolean to indicate its passing status.
    // Instead, it returns a Promise that resolves when it is completed.
    resolveMatchSnapshot(
        promiseOrFn: Promise<any> | ((...args: any[]) => Promise<any>),
        message?: string,
        extra?: Options.Assert,
    ): void;

    // As of version 11, tap supports saving and then comparing against "snapshot" strings. This is a powerful technique for testing programs that generate output, but it comes with some caveats.
    matchSnapshot(output: any, message?: string, extra?: Options.Assert): boolean;

    // Expect the function to throw an error. If an expected error is provided, then also verify that the thrown error matches the expected error.
    // If the expected error is an object, then it's matched against the thrown error using t.match(er, expectedError). If it's a function, then the error is asserted to be a member of that class.
    // If the function has a name, and the message is not provided, then the function name will be used as the message.
    // If the function is not provided, then this will be treated as a todo test.
    // Caveat: if you pass a extra object to t.throws, then you MUST also pass in an expected error, or else it will read the diag object as the expected error, and get upset when your thrown error
    // doesn't match {skip:true} or whatever.
    // For example, this will not work as expected:
    // // anti-example, do not use!
    // t.throws(function() {throw new Error('x')}, { skip: true })
    // But this is fine:
    // // this example is ok to use.
    // // note the empty 'expected error' object.
    // // since it has no fields, it'll only verify that the thrown thing is
    // // an object, not the value of any properties
    // t.throws(function() {throw new Error('x')}, {}, { skip: true })
    // The expected error is tested against the throw error using t.match, so regular expressions and the like are fine. If the expected error is an Error object, then the stack field is ignored,
    // since that will generally never match.
    throws: Assertions.Throws;
    throw: Assertions.Throws;

    // Verify that the provided function does not throw.
    // If the function has a name, and the message is not provided, then the function name will be used as the message.
    // If the function is not provided, then this will be treated as a todo test.
    // Note: if an error is encountered unexpectedly, it's often better to simply throw it. The Test object will handle this as a failure.
    doesNotThrow: Assertions.DoesNotThrow;
    notThrow: Assertions.DoesNotThrow;

    // Expect the function to throw an uncaught exception at some point in the future, before the test ends. If the test ends without having thrown the expected error, then the test fails.
    // This is useful for verifying that an error thrown in some part of your code will not be handled, which would normally result in a program crash, and verify behavior in those scenarios.
    // If the error is thrown synchronously, or within a promise, then the t.throws() or t.rejects() methods are more appropriate.
    // If called multiple times, then the uncaught exception errors must be emitted in the order called.
    // Note: This method will not properly link a thrown error to the correct test object in some cases involving native modules on Node version 8, because the async_hooks module does not track
    // the execution context ID across native boundaries.
    expectUncaughtException(
        fn?: (...args: any[]) => any,
        expectedError?: Error,
        message?: string,
        extra?: Options.Assert,
    ): boolean;

    // Verify that the object found is exactly the same (that is, ===) to the object that is wanted.
    equal: Assertions.Equal;
    equals: Assertions.Equal;
    isEqual: Assertions.Equal;
    is: Assertions.Equal;
    strictEqual: Assertions.Equal;
    strictEquals: Assertions.Equal;
    strictIs: Assertions.Equal;
    isStrict: Assertions.Equal;
    isStrictly: Assertions.Equal;

    // Inverse of t.equal().
    // Verify that the object found is not exactly the same (that is, !==) as the object that is wanted.
    notEqual: Assertions.NotEqual;
    notEquals: Assertions.NotEqual;
    inequal: Assertions.NotEqual;
    notStrictEqual: Assertions.NotEqual;
    notStrictEquals: Assertions.NotEqual;
    isNotEqual: Assertions.NotEqual;
    isNot: Assertions.NotEqual;
    doesNotEqual: Assertions.NotEqual;
    isInequal: Assertions.NotEqual;

    // Verify that the found object is deeply equivalent to the wanted object. Use non-strict equality for scalars (ie, ==). See: tcompare
    same: Assertions.Equal;
    equivalent: Assertions.Equal;
    looseEqual: Assertions.Equal;
    looseEquals: Assertions.Equal;
    deepEqual: Assertions.Equal;
    deepEquals: Assertions.Equal;
    isLoose: Assertions.Equal;
    looseIs: Assertions.Equal;

    // Inverse of t.same().
    // Verify that the found object is not deeply equivalent to the unwanted object. Uses non-strict inequality (ie, !=) for scalars.
    notSame: Assertions.NotEqual;
    inequivalent: Assertions.NotEqual;
    looseInequal: Assertions.NotEqual;
    notDeep: Assertions.NotEqual;
    deepInequal: Assertions.NotEqual;
    notLoose: Assertions.NotEqual;
    looseNot: Assertions.NotEqual;

    // Strict version of t.same().
    // Verify that the found object is deeply equivalent to the wanted object. Use strict equality for scalars (ie, ===).
    strictSame: Assertions.Equal;
    strictEquivalent: Assertions.Equal;
    strictDeepEqual: Assertions.Equal;
    sameStrict: Assertions.Equal;
    deepIs: Assertions.Equal;
    isDeeply: Assertions.Equal;
    isDeep: Assertions.Equal;
    strictDeepEquals: Assertions.Equal;

    // Inverse of t.strictSame().
    // Verify that the found object is not deeply equivalent to the unwanted object. Use strict equality for scalars (ie, ===).
    strictNotSame: Assertions.NotEqual;
    strictInequivalent: Assertions.NotEqual;
    strictDeepInequal: Assertions.NotEqual;
    notSameStrict: Assertions.NotEqual;
    deepNot: Assertions.NotEqual;
    notDeeply: Assertions.NotEqual;
    strictDeepInequals: Assertions.NotEqual;
    notStrictSame: Assertions.NotEqual;

    // Verify that the found object contains all of the provided fields, and that they are of the same type and value as the pattern provided.
    // This does not do advanced/loose matching based on constructor, regexp patterns, and so on, like t.match() does. You may specify key: undefined in the pattern to ensure that a field is not
    // defined in the found object, but it will not differentiate between a missing property and a property set to undefined.
    // Note that t.has(), the un-strict version of this function, is an alias for t.match().
    hasStrict: Assertions.Match;

    // Verify that the found object matches the pattern provided.
    // If pattern is a regular expression, and found is a string, then verify that the string matches the pattern.
    // If the pattern is a string, and found is a string, then verify that the pattern occurs within the string somewhere.
    // If pattern is an object, then verify that all of the (enumerable) fields in the pattern match the corresponding fields in the object using this same algorithm. For example, the pattern
    // // {x:/a[sdf]{3}/} would successfully match {x:'asdf',y:'z'}.
    // This is useful when you want to verify that an object has a certain set of required fields, but additional fields are ok.
    // See tcompare for the full details on how this works.
    match: Assertions.Match;
    has: Assertions.Match;
    hasFields: Assertions.Match;
    matches: Assertions.Match;
    similar: Assertions.Match;
    like: Assertions.Match;
    isLike: Assertions.Match;
    includes: Assertions.Match;
    include: Assertions.Match;
    contains: Assertions.Match;

    // Inverse of match()
    // Verify that the found object does not match the pattern provided.
    notMatch: Assertions.Match;
    dissimilar: Assertions.Match;
    unsimilar: Assertions.Match;
    notSimilar: Assertions.Match;
    unlike: Assertions.Match;
    isUnlike: Assertions.Match;
    notLike: Assertions.Match;
    isNotLike: Assertions.Match;
    doesNotHave: Assertions.Match;
    isNotSimilar: Assertions.Match;
    isDissimilar: Assertions.Match;

    // Verify that the object is of the type provided.
    // Type can be a string that matches the typeof value of the object, or the string name of any constructor in the object's prototype chain, or a constructor function in the
    // object's prototype chain. For example, all the following will pass:
    // t.type(new Date(), 'object');
    // t.type(new Date(), 'Date');
    // t.type(new Date(), Date);
    type: Assertions.Type;
    isa: Assertions.Type;
    isA: Assertions.Type;
}

declare namespace Options {
    interface Bag {
        [key: string]: any;
    }

    interface Pragma {
        [key: string]: boolean;
    }

    interface Assert extends Bag {
        todo?: boolean | string;
        skip?: boolean | string;
        diagnostic?: boolean;
    }

    interface Spawn extends Assert {
        bail?: boolean;
        timeout?: number;
    }

    interface Test extends Assert {
        timeout?: number;
        bail?: boolean;
        autoend?: boolean;
        buffered?: boolean;
        jobs?: number;
        grep?: RegExp[];
        only?: boolean;
        runOnly?: boolean;
    }
}

declare namespace Assertions {
    type Basic = (obj: any, message?: string, extra?: Options.Assert) => boolean;
    interface Throws {
        (fn?: (...args: any[]) => any, expectedError?: Error, message?: string, extra?: Options.Assert): boolean;
        (fn?: (...args: any[]) => any, messageOrExpectedError?: string | Error, extra?: Options.Assert): boolean;
    }
    type DoesNotThrow = (fn?: (...args: any[]) => any, message?: string, extra?: Options.Assert) => boolean;
    type Equal = (found: any, wanted: any, message?: string, extra?: Options.Assert) => boolean;
    type NotEqual = (found: any, notWanted: any, message?: string, extra?: Options.Assert) => boolean;
    type Match = (
        found: any,
        pattern: string | RegExp | { [key: string]: RegExp },
        message?: string,
        extra?: Options.Assert,
    ) => boolean;
    type Type = (
        found: any,
        type: string | (new (...args: any[]) => object),
        message?: string,
        extra?: Options.Assert,
    ) => boolean;
}
// End transcluded TAP typing content.
