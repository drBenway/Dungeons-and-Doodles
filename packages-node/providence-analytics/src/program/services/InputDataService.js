/* eslint-disable no-param-reassign */
// @ts-ignore-next-line
require('../types/index.js');

const fs = require('fs');
const pathLib = require('path');

const child_process = require('child_process'); // eslint-disable-line camelcase
const glob = require('glob');
const anymatch = require('anymatch');
const isNegatedGlob = require('is-negated-glob');
const { LogService } = require('./LogService.js');
const { AstService } = require('./AstService.js');
const { getFilePathRelativeFromRoot } = require('../utils/get-file-path-relative-from-root.js');
const { toPosixPath } = require('../utils/to-posix-path.js');

// TODO: memoize
function getPackageJson(rootPath) {
  try {
    const fileContent = fs.readFileSync(`${rootPath}/package.json`, 'utf8');
    return JSON.parse(fileContent);
  } catch (_) {
    return undefined;
  }
}

function getLernaJson(rootPath) {
  try {
    const fileContent = fs.readFileSync(`${rootPath}/lerna.json`, 'utf8');
    return JSON.parse(fileContent);
  } catch (_) {
    return undefined;
  }
}

/**
 *
 * @param {string[]} list
 * @param {string} rootPath
 * @returns {{path:string, name:string}[]}
 */
function getPathsFromGlobList(list, rootPath) {
  const results = [];
  list.forEach(pathOrGlob => {
    if (!pathOrGlob.endsWith('/')) {
      // eslint-disable-next-line no-param-reassign
      pathOrGlob = `${pathOrGlob}/`;
    }

    if (pathOrGlob.includes('*')) {
      const globResults = glob.sync(pathOrGlob, { cwd: rootPath, absolute: false });
      globResults.forEach(r => {
        results.push(r);
      });
    } else {
      results.push(pathOrGlob);
    }
  });
  return results.map(path => {
    const packageRoot = pathLib.resolve(rootPath, path);
    const basename = pathLib.basename(path);
    const pkgJson = getPackageJson(packageRoot);
    const name = (pkgJson && pkgJson.name) || basename;
    return { name, path };
  });
}

function getGitignoreFile(rootPath) {
  try {
    return fs.readFileSync(`${rootPath}/.gitignore`, 'utf8');
  } catch (_) {
    return undefined;
  }
}

function getGitIgnorePaths(rootPath) {
  const fileContent = getGitignoreFile(rootPath);
  if (!fileContent) {
    return [];
  }

  const entries = fileContent.split('\n').filter(entry => {
    entry = entry.trim();
    if (entry.startsWith('#')) {
      return false;
    }
    if (entry.startsWith('!')) {
      return false; // negated folders will be kept
    }
    return entry.trim().length;
  });

  // normalize entries to be compatible with anymatch
  const normalizedEntries = entries.map(e => {
    let entry = toPosixPath(e);

    if (entry.startsWith('/')) {
      entry = entry.slice(1);
    }
    const isFile = entry.indexOf('.') > 0; // index of 0 means hidden file.
    if (entry.endsWith('/')) {
      entry += '**';
    } else if (!isFile) {
      entry += '/**';
    }
    return entry;
  });
  return normalizedEntries;
}

/**
 * Gives back all files and folders that need to be added to npm artifact
 */
function getNpmPackagePaths(rootPath) {
  const pkgJson = getPackageJson(rootPath);
  if (!pkgJson) {
    return [];
  }
  if (pkgJson.files) {
    return pkgJson.files.map(fileOrFolder => {
      const isFolderGlob = !fileOrFolder.includes('*') && !fileOrFolder.includes('.');
      if (isFolderGlob) {
        return `${fileOrFolder}/**/*`;
      }
      return fileOrFolder;
    });
  }
  return [];
}

/**
 *
 * @param {string|array} v
 * @returns {array}
 */
function ensureArray(v) {
  return Array.isArray(v) ? v : [v];
}

function multiGlobSync(patterns, { keepDirs = false, root } = {}) {
  patterns = ensureArray(patterns);
  const res = new Set();
  patterns.forEach(pattern => {
    const files = glob.sync(pattern, { root });
    files.forEach(filePath => {
      if (fs.lstatSync(filePath).isDirectory() && !keepDirs) {
        return;
      }
      res.add(filePath);
    });
  });
  return Array.from(res);
}

/**
 * @typedef {Object} ProjectData
 * @property {string} project project name
 * @property {string} path full path to project folder
 * @property {string[]} entries all file paths within project folder
 */

/**
 * To be used in main program.
 * It creates an instance on which the 'files' array is stored.
 * The files array contains all projects.
 *
 * Also serves as SSOT in many other contexts wrt data locations and gathering
 */
class InputDataService {
  /**
   * @desc create an array of ProjectData
   * @param {string[]} projectPaths
   * @param {GatherFilesConfig} gatherFilesConfig
   * @returns {ProjectData}
   */
  static createDataObject(projectPaths, gatherFilesConfig = {}) {
    const inputData = projectPaths.map(projectPath => ({
      project: {
        name: pathLib.basename(projectPath),
        path: projectPath,
      },
      entries: this.gatherFilesFromDir(projectPath, {
        ...this.defaultGatherFilesConfig,
        ...gatherFilesConfig,
      }),
    }));
    return this._addMetaToProjectsData(inputData);
  }

  /**
   * From 'main/file.js' or '/main/file.js' to './main/file.js'
   */
  static __normalizeMainEntry(mainEntry) {
    if (mainEntry.startsWith('/')) {
      return `.${mainEntry}`;
    }
    if (!mainEntry.startsWith('.')) {
      return `./${mainEntry}`;
    }
    return mainEntry;
  }

  /**
   * @param {string} projectPath
   * @returns { { path:string, name?:string, mainEntry?:string, version?: string, commitHash?:string }}
   */
  static getProjectMeta(projectPath) {
    const project = { path: projectPath };
    // Add project meta info
    try {
      const file = pathLib.resolve(projectPath, 'package.json');
      const pkgJson = JSON.parse(fs.readFileSync(file, 'utf8'));
      // eslint-disable-next-line no-param-reassign
      project.mainEntry = this.__normalizeMainEntry(pkgJson.main || './index.js');
      // eslint-disable-next-line no-param-reassign
      project.name = pkgJson.name;
      // TODO: also add meta info whether we are in a monorepo or not.
      // We do this by checking whether there is a lerna.json on root level.
      // eslint-disable-next-line no-empty
      project.version = pkgJson.version;
    } catch (e) {
      LogService.warn(e);
    }
    project.commitHash = this._getCommitHash(projectPath);
    return project;
  }

  static _getCommitHash(projectPath) {
    let commitHash;
    let isGitRepo;
    try {
      isGitRepo = fs.lstatSync(pathLib.resolve(projectPath, '.git')).isDirectory();
      // eslint-disable-next-line no-empty
    } catch (_) {}

    if (isGitRepo) {
      try {
        const hash = child_process
          .execSync('git rev-parse HEAD', {
            cwd: projectPath,
          })
          .toString('utf-8')
          .slice(0, -1);
        // eslint-disable-next-line no-param-reassign
        commitHash = hash;
      } catch (e) {
        LogService.warn(e);
      }
    } else {
      commitHash = '[not-a-git-root]';
    }
    return commitHash;
  }

  /**
   * @desc adds context with code (c.q. file contents), project name and project 'main' entry
   * @param {InputData} inputData
   */
  static _addMetaToProjectsData(inputData) {
    return inputData.map(projectObj => {
      // Add context obj with 'code' to files
      const newEntries = [];
      projectObj.entries.forEach(entry => {
        const code = fs.readFileSync(entry, 'utf8');
        const file = getFilePathRelativeFromRoot(
          toPosixPath(entry),
          toPosixPath(projectObj.project.path),
        );
        if (pathLib.extname(file) === '.html') {
          const extractedScripts = AstService.getScriptsFromHtml(code);
          // eslint-disable-next-line no-shadow
          extractedScripts.forEach((code, i) => {
            newEntries.push({ file: `${file}#${i}`, context: { code } });
          });
        } else {
          newEntries.push({ file, context: { code } });
        }
      });

      const project = this.getProjectMeta(toPosixPath(projectObj.project.path));

      return { project, entries: newEntries };
    });
  }

  // TODO: rename to `get targetProjectPaths`
  /**
   * @desc gets all project directories/paths from './submodules'
   * @returns {string[]} a list of strings representing all entry paths for projects we want to query
   */
  static getTargetProjectPaths() {
    if (this.__targetProjectPaths) {
      return this.__targetProjectPaths;
    }
    const submoduleDir = pathLib.resolve(
      __dirname,
      '../../../providence-input-data/search-targets',
    );
    let dirs;
    try {
      dirs = fs.readdirSync(submoduleDir);
    } catch (_) {
      return [];
    }
    return dirs
      .map(dir => pathLib.join(submoduleDir, dir))
      .filter(dirPath => fs.lstatSync(dirPath).isDirectory());
  }

  static get referenceProjectPaths() {
    if (this.__referenceProjectPaths) {
      return this.__referenceProjectPaths;
    }

    let dirs;
    try {
      const referencesDir = pathLib.resolve(__dirname, '../../../providence-input-data/references');
      dirs = fs.readdirSync(referencesDir);
      dirs = dirs
        .map(dir => pathLib.join(referencesDir, dir))
        .filter(dirPath => fs.lstatSync(dirPath).isDirectory());
      // eslint-disable-next-line no-empty
    } catch (_) {}
    return dirs;
  }

  static set referenceProjectPaths(v) {
    this.__referenceProjectPaths = ensureArray(v);
  }

  static set targetProjectPaths(v) {
    this.__targetProjectPaths = ensureArray(v);
  }

  static get defaultGatherFilesConfig() {
    return {
      extensions: ['.js'],
      allowlist: ['!node_modules/**', '!bower_components/**', '!**/*.conf.js', '!**/*.config.js'],
      depth: Infinity,
    };
  }

  static getGlobPattern(startPath, cfg, withoutDepth = false) {
    // if startPath ends with '/', remove
    let globPattern = startPath.replace(/\/$/, '');
    // let globPattern = '';
    if (process.platform === 'win32') {
      // root = root.replace(/^.\:/, '').replace(/\\/g, '/');
      globPattern = globPattern.replace(/^.:/, '').replace(/\\/g, '/');
    }
    if (!withoutDepth) {
      if (cfg.depth !== Infinity) {
        globPattern += `/*`.repeat(cfg.depth + 1);
      } else {
        globPattern += `/**/*`;
      }
    }
    // globPattern = globPattern.slice(1)
    return { globPattern };
  }

  /**
   * @desc Gets an array of files for given extension
   * @param {string} startPath - local filesystem path
   * @param {GatherFilesConfig} customConfig - configuration object
   * @param {number} [customConfig.depth=Infinity] how many recursive calls should be made
   * @param {string[]} [result] - list of file paths, for internal (recursive) calls
   * @returns {string[]} result list of file paths
   */
  static gatherFilesFromDir(startPath, customConfig = {}) {
    const cfg = {
      ...this.defaultGatherFilesConfig,
      ...customConfig,
    };
    if (!customConfig.omitDefaultAllowlist) {
      cfg.allowlist = [
        ...this.defaultGatherFilesConfig.allowlist,
        ...(customConfig.allowlist || []),
      ];
    }
    const allowlistModes = ['npm', 'git', 'all'];
    if (customConfig.allowlistMode && !allowlistModes.includes(customConfig.allowlistMode)) {
      throw new Error(
        `[gatherFilesConfig] Please provide a valid allowListMode like "${allowlistModes.join(
          '|',
        )}". Found: "${customConfig.allowlistMode}"`,
      );
    }

    let gitIgnorePaths = [];
    let npmPackagePaths = [];

    const hasGitIgnore = getGitignoreFile(startPath);
    const allowlistMode = cfg.allowlistMode || (hasGitIgnore ? 'git' : 'npm');

    if (allowlistMode === 'git') {
      gitIgnorePaths = getGitIgnorePaths(startPath);
    } else if (allowlistMode === 'npm') {
      npmPackagePaths = getNpmPackagePaths(startPath);
    }
    const removeFilter = gitIgnorePaths;
    const keepFilter = npmPackagePaths;

    cfg.allowlist.forEach(allowEntry => {
      const { negated, pattern } = isNegatedGlob(allowEntry);
      if (negated) {
        removeFilter.push(pattern);
      } else {
        keepFilter.push(allowEntry);
      }
    });

    let { globPattern } = this.getGlobPattern(startPath, cfg);
    globPattern += `.{${cfg.extensions.map(e => e.slice(1)).join(',')},}`;
    const globRes = multiGlobSync(globPattern);

    let filteredGlobRes;
    if (removeFilter.length || keepFilter.length) {
      filteredGlobRes = globRes.filter(filePath => {
        const localFilePath = toPosixPath(filePath).replace(`${toPosixPath(startPath)}/`, '');
        let shouldRemove = removeFilter.length && anymatch(removeFilter, localFilePath);
        let shouldKeep = keepFilter.length && anymatch(keepFilter, localFilePath);

        if (shouldRemove && shouldKeep) {
          // Contradicting configs: the one defined by end user takes highest precedence
          // If the match came from allowListMode, it loses.
          if (allowlistMode === 'git' && anymatch(gitIgnorePaths, localFilePath)) {
            // shouldRemove was caused by .gitignore, shouldKeep by custom allowlist
            shouldRemove = false;
          } else if (allowlistMode === 'npm' && anymatch(npmPackagePaths, localFilePath)) {
            // shouldKeep was caused by npm "files", shouldRemove by custom allowlist
            shouldKeep = false;
          }
        }

        if (removeFilter.length && shouldRemove) {
          return false;
        }
        if (!keepFilter.length) {
          return true;
        }
        return shouldKeep;
      });
    }

    if (!filteredGlobRes || !filteredGlobRes.length) {
      LogService.warn(`No files found for path '${startPath}'`);
    }

    // reappend startPath
    // const res = filteredGlobRes.map(f => pathLib.resolve(startPath, f));
    return filteredGlobRes.map(toPosixPath);
  }

  /**
   * @desc Allows the user to provide a providence.conf.js file in its repository root
   */
  static getExternalConfig() {
    try {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      return require(`${process.cwd()}/providence.conf.js`);
    } catch (e) {
      return null;
    }
  }

  /**
   * Gives back all monorepo package paths
   */
  static getMonoRepoPackages(rootPath) {
    // [1] Look for npm/yarn workspaces
    const pkgJson = getPackageJson(rootPath);
    if (pkgJson && pkgJson.workspaces) {
      return getPathsFromGlobList(pkgJson.workspaces, rootPath);
    }
    // [2] Look for lerna packages
    const lernaJson = getLernaJson(rootPath);
    if (lernaJson && lernaJson.packages) {
      return getPathsFromGlobList(lernaJson.packages, rootPath);
    }
    // TODO: support forward compatibility for npm?
    return undefined;
  }
}
InputDataService.cacheDisabled = false;

module.exports = { InputDataService };
