import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const root = "c:/Users/scardino/Downloads/repo/secretagentpikmin-wow-phase1/secretagentpikmin-main";
const r = spawnSync("npm", ["run", "build"], { cwd: root, encoding: "utf8", shell: true, maxBuffer: 10 * 1024 * 1024 });
const out = (r.stdout || "") + (r.stderr || "");
writeFileSync(`${root}/docs/build-v25-log.txt`, `exit=${r.status}\n${out}`);
process.exit(r.status ?? 1);
