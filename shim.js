import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { fileURLToPath } from "url";
import { dirname as getDirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = getDirname(__filename);
