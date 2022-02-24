import { useURL } from "../core/shimHTTP";
import { RouteHandler, RouteHandlerX } from "./createRoute";

/**
 * Limit HTTP methods on a route.
 *
 * @param handler the route handler.
 * @param methods an array of methods, like `["GET", "POST"]`
 * @returns a new handler, which will return null when
 * methods is not allowed.
 */
export const allowMethods = <P extends string, R>(
    handler: RouteHandler<P, R>,
    methods: string[]
): RouteHandler<P, R | null> => {
    return (...args: Parameters<typeof handler>) => {
        if (methods.includes(useURL("method"))) return handler(...args);
        return null;
    };
};

export const All = <P extends string, R>(handler: RouteHandler<P, R>) =>
    allowMethods(handler, [
        "GET",
        "HEAD",
        "POST",
        "PUT",
        "DELETE",
        "CONNECT",
        "OPTIONS",
        "TRACE",
        "PATCH",
    ]);
export const Get = <P extends string, R>(handler: RouteHandler<P, R>) =>
    allowMethods(handler, ["GET"]);
export const Head = <P extends string, R>(handler: RouteHandler<P, R>) =>
    allowMethods(handler, ["HEAD"]);
export const Post = <P extends string, R>(handler: RouteHandler<P, R>) =>
    allowMethods(handler, ["POST"]);
export const Put = <P extends string, R>(handler: RouteHandler<P, R>) =>
    allowMethods(handler, ["PUT"]);
export const Delete = <P extends string, R>(handler: RouteHandler<P, R>) =>
    allowMethods(handler, ["DELETE"]);
export const Connect = <P extends string, R>(handler: RouteHandler<P, R>) =>
    allowMethods(handler, ["CONNECT"]);
export const Options = <P extends string, R>(handler: RouteHandler<P, R>) =>
    allowMethods(handler, ["OPTIONS"]);
export const Trace = <P extends string, R>(handler: RouteHandler<P, R>) =>
    allowMethods(handler, ["TRACE"]);
export const Patch = <P extends string, R>(handler: RouteHandler<P, R>) =>
    allowMethods(handler, ["PATCH"]);

/**
 * Limit HTTP methods on a extended route.
 *
 * @param handler the extended route handler.
 * @param methods an array of methods, like `["GET", "POST"]`
 * @returns a new extended handler, which will return null when
 * methods is not allowed.
 */
export const allowMethodsX = <P extends string, X, R>(
    handler: RouteHandlerX<P, X, R>,
    methods: string[]
): RouteHandlerX<P, X, R | null> => {
    return (...args: Parameters<typeof handler>) => {
        if (methods.includes(useURL("method"))) return handler(...args);
        return null;
    };
};

export const AllX = <P extends string, X, R>(handler: RouteHandlerX<P, X, R>) =>
    allowMethodsX(handler, [
        "GET",
        "HEAD",
        "POST",
        "PUT",
        "DELETE",
        "CONNECT",
        "OPTIONS",
        "TRACE",
        "PATCH",
    ]);
export const GetX = <P extends string, X, R>(handler: RouteHandlerX<P, X, R>) =>
    allowMethodsX(handler, ["GET"]);
export const HeadX = <P extends string, X, R>(
    handler: RouteHandlerX<P, X, R>
) => allowMethodsX(handler, ["HEAD"]);
export const PostX = <P extends string, X, R>(
    handler: RouteHandlerX<P, X, R>
) => allowMethodsX(handler, ["POST"]);
export const PutX = <P extends string, X, R>(handler: RouteHandlerX<P, X, R>) =>
    allowMethodsX(handler, ["PUT"]);
export const DeleteX = <P extends string, X, R>(
    handler: RouteHandlerX<P, X, R>
) => allowMethodsX(handler, ["DELETE"]);
export const ConnectX = <P extends string, X, R>(
    handler: RouteHandlerX<P, X, R>
) => allowMethodsX(handler, ["CONNECT"]);
export const OptionsX = <P extends string, X, R>(
    handler: RouteHandlerX<P, X, R>
) => allowMethodsX(handler, ["OPTIONS"]);
export const TraceX = <P extends string, X, R>(
    handler: RouteHandlerX<P, X, R>
) => allowMethodsX(handler, ["TRACE"]);
export const PatchX = <P extends string, X, R>(
    handler: RouteHandlerX<P, X, R>
) => allowMethodsX(handler, ["PATCH"]);
