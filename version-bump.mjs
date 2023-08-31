import { readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";

const highestTag = execSync("git describe --tags --abbrev=0").toString().trim();

const incrementVersion = (version) => {
    const [major, minor, patch] = version.split(".").map(Number);
    if (patch < 9) {
        return `${major}.${minor}.${patch + 1}`;
    } else if (minor < 9) {
        return `${major}.${minor + 1}.0`;
    } else {
        return `${major + 1}.0.0`;
    }
};

function updateVersion(name) {
    let file = JSON.parse(readFileSync(name, "utf-8"));
    file.version = targetVersion;
    writeFileSync(name, JSON.stringify(file, null, "\t"));
}

const targetVersion = incrementVersion(highestTag);
updateVersion("manifest.json")
const { minAppVersion } = JSON.parse(readFileSync("manifest.json", "utf8"));
let versions = JSON.parse(readFileSync("versions.json", "utf8"));
versions[targetVersion] = minAppVersion;
writeFileSync("versions.json", JSON.stringify(versions, null, "\t"));
updateVersion("package.json");