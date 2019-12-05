import * as fs from "fs";
import * as os from "os";
import * as path from "path";

export function getNewTempDir(): string {
    const prefix = "telestrations-";
    const tmpDir = os.tmpdir();

    fs.readdirSync(tmpDir, {withFileTypes: true})
        .filter(file => file.isDirectory() && file.name.startsWith(prefix))
        .forEach(folder => {
            fs.readdirSync(path.join(tmpDir, folder.name))
                .forEach(file => fs.unlinkSync(path.join(tmpDir, folder.name, file)));
            fs.rmdirSync(path.join(tmpDir, folder.name));
        });

    return fs.mkdtempSync(path.join(tmpDir, prefix));
}
