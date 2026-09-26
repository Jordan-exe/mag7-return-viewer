import createClient from "openapi-fetch";
import type { paths, components } from "./schema";

export const api = createClient<paths>({ baseUrl: "/api" });

export type SingleReturn = components["schemas"]["SingleReturn"];
export type ReturnsData = Record<string, SingleReturn[]>;
