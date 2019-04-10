import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import flow from "rollup-plugin-flow"
import babel from "rollup-plugin-babel";
import {uglify} from "rollup-plugin-uglify";

export default {
    input: "./components/index.js",
    output: {
        dir: "./",
        format: "cjs"
    },
    plugins: [
        peerDepsExternal(),
        flow({all: true}),
        babel({
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: ["@babel/plugin-proposal-class-properties"]
        }),
        uglify()
    ]
}