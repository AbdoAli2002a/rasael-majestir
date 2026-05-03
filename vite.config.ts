import { defineConfig } from "vite";
import { lovableTanstack } from "@lovable.dev/vite-tanstack-config";

export default defineConfig((env) => lovableTanstack(env));
