import { Application } from "express";
import { getEvent, postEvent, putEvent, delEvent } from "./events/index";
import { Settings, SettingsInterface } from "./index";
import { createExpressRequest } from "./createExpressRequest";
/**
 * Register the get and post requests from express
 *
 * @param app The express app
 */
export function registerExpress(app: Application, route: string, settings: SettingsInterface) {
    const url = `/${route.replace(/^\/|\/$/g, "")}/:api/:id`;
    app.get(url, (request, response) => {
        console.log(request);
        let event = createExpressRequest(request, response, "get", settings);
        getEvent.triggerEvent(event);
    });
    app.post(url, (request, response) => {
        console.log(request);
        let event = createExpressRequest(request, response, "post", settings);
        postEvent.triggerEvent(event);
    });
    app.put(url, (request, response) => {
        console.log(request);
        let event = createExpressRequest(request, response, "put", settings);
        putEvent.triggerEvent(event);
    });
    app.delete(url, (request, response) => {
        console.log(request);
        let event = createExpressRequest(request, response, "delete", settings);
        delEvent.triggerEvent(event);
    });
}