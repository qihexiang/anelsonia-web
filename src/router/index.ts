type ParamFlag<T extends string> = `...<${T}>` | `<${T}>`;
// type QueryPattern<L extends string, R extends string> = `${L}&${R}`;
type RoutePattern<L extends string, R extends string> = `${L}/${R}`;
type RouteParam<U extends string> = U extends RoutePattern<infer L, infer R>
    ? (L extends ParamFlag<infer T>
        ? { [propName in (T | keyof RouteParam<R>)]: string }
        : { [propName in keyof RouteParam<R>]: string })
    : (U extends ParamFlag<infer T>
        ? { [propName in T]: string }
        : {});
export type RouteHandler<P extends string, R> = (params: RouteParam<P>, queries: URLSearchParams) => R;
type Route<R> = (url: string) => R | null;
export type ExtendRouteHandler<P extends string, X, R> = (params: RouteParam<P>, queries: URLSearchParams, extra: X) => R;
type ExtendRoute<R, X> = (url: string, extra: X) => R | null;

/**
 * Create a route that request can get in.
 * 
 * @param pattern specify the url matching pattern, 
 * like `/user/<username>/<age>/...<extra>` can match url
 * `/user/miku/10/other/many/arguments?timestamp=1641891955803`.
 * 
 * @param handler is a function that can receive route matched 
 * params and searchParams generated by URL class and return some
 * thing.
 * 
 * @returns a function that receive a string as argument, if the
 * string matched the pattern, call the handler and return its 
 * result, otherwise return null.
 */
export function createRoute<P extends string, R>(pattern: P, handler: RouteHandler<P, R>): Route<R> {
    const re = createRegExp(pattern);
    console.log(re);
    return (url: string) => {
        const { pathname, searchParams } = new URL('http://localhost' + (url.indexOf("/") === 0 ? "" : "/") + url);
        const matched = re.exec(pathname);
        if (matched) {
            return handler(
                matched.groups as RouteParam<P>, searchParams
            );
        }
        return null;
    };
}

/**
 * Create a route that request can get in.
 * 
 * @param pattern specify the url matching pattern, 
 * like `/user/<username>/<age>/...<extra>` can match url
 * `/user/miku/10/other/many/arguments?timestamp=1641891955803`.
 * 
 * @param handler is a function that can receive route matched 
 * params and searchParams generated by URL class and return some
 * thing.
 * 
 * @returns a function that receive a string argument and 
 * a extra arugment, if the string matched the pattern, 
 * call the handler and return its result, otherwise return
 * null.
 */
export function createExtRoute<P extends string, X, R>(pattern: P, handler: ExtendRouteHandler<P, X, R>): ExtendRoute<R, X> {
    const re = createRegExp(pattern);
    return (url: string, extra: X) => {
        const { pathname, searchParams } = new URL('http://localhost' + (url.indexOf("/") === 0 ? "" : "/") + url);
        const matched = re.exec(pathname);
        if (matched) {
            return handler(
                matched.groups as RouteParam<P>, searchParams, extra
            );
        }
        return null;
    };
}

/**
 * Create a switcher connected to many routes.
 * Routes will be matched with the order of
 * the arguments.
 * 
 * @param routes routes created by createRoute() and has
 * same return type, for example some routes with handlers
 * all return string. 
 * 
 * @returns a function that receive a string as argument, if the
 * string matched the pattern, call the handler and return its 
 * result, otherwise return null.
 */
export function createSwitcher<R>(...routes: Route<R>[]) {
    return (url: string): R | null =>
        routes.reduce<R | null>((lastRouted, nextRoute) => lastRouted ?? nextRoute(url), null);
}

/**
 * Create a switcher connected to many routes with same 
 * extra argument. Routes will be matched with the order of
 * the arguments.
 * 
 * @param routes routes created by createExtRoute() and has
 * same return type, for example some routes with handlers
 * all return string. 
 * 
 * @returns a function that receive a string argument and 
 * a extra arugment, if the string matched the pattern, 
 * call the handler and return its result, otherwise return
 * null.
 */
export function createExtendSwitcher<R, X>(...routes: ExtendRoute<R, X>[]) {
    return (url: string, extra: X): R | null =>
        routes.reduce<R | null>((lastRouted, nextRoute) => lastRouted ?? nextRoute(url, extra), null);
}

/**
 * Create a switcher and routes connect to it at the same time.
 * Use route function return from it to add route, and use switcher 
 * in the object.
 * For example, you can use it like this:
 * 
 * ```js
 * const { switcher } = createSwRt()
 *     .route('/user/<username>/<age>', (p, q) => `User ${p.username} is ${p.age}`)
 *     .route('/user/<username>/hello', (p, q) => `hello, ${p.username}`)
 * 
 * const reuslt = switcher(url)
 * ```
 * 
 * @returns a route function and switcher function.
 */
export function createSwRt<R>() {
    let routes: Route<R>[] = [];
    const route = <P extends string>(pattern: P, handler: RouteHandler<P, R>) => {
        routes = [...routes, createRoute(pattern, handler)];
        return {
            route, switcher: createSwitcher(...routes)
        };
    };
    return { route, switcher: createSwitcher(...routes) };
}

/**
 * Create a switcher and extended routes connect to it at the same time.
 * Use route function return from it to add route, and use switcher 
 * in the object.
 * For example, you can use it like this:
 * 
 * ```ts
 * const { switcher } = createExtendSwRt<string, Request>()
 *     .route('/user/<username>/<age>', (p, q, x) => `User ${p.username} is ${p.age}, request from ${x.ip}`)
 *     .route('/user/<username>/hello', (p, q, x) => `hello, ${p.username}, request from ${x.ip}`)
 * 
 * const reuslt = switcher(url)
 * ```
 * 
 * @returns a route function and switcher function.
 */
export function createExtendSwRt<R, X>() {
    let routes: ExtendRoute<R, X>[] = [];
    const route = <P extends string>(pattern: P, handler: ExtendRouteHandler<P, X, R>) => {
        routes = [...routes, createExtRoute(pattern, handler)];
        return {
            route, switcher: createExtendSwitcher(...routes)
        };
    };
    return {
        route, switcher: createExtendSwitcher(...routes)
    };
}

export function condition<T>(reality: string) {
    let result: T | null = null;
    function match(condition: string | string[] | RegExp, callback: (condition: string) => T) {
        if (condition instanceof RegExp && reality.match(condition)) result = result ?? callback(reality);
        if (condition instanceof Array && condition.includes(reality)) result = result ?? callback(reality);
        if (condition === reality) result = result ?? callback(reality);
        return {
            match, result
        };
    }
    return { match, result };
}

function createRegExp<P extends string>(pattern: P) {
    return new RegExp("^" + pattern.replace(/(\.\.\.)<.+?>/g, "(?$&.+)").replace(/[^(\.\.\.)]<.+?>/g, "(?$&.+?)").replace(/\.\.\./g, "").replace(/\(\?\//g, "/(?"));
}
