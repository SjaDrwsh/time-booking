import * as chokidar from 'chokidar';
import * as fs from 'fs';

function getTemplateFileNames(fileName: string): { componentFileTemplate: string; testFileTemplate: string } {
  return {
    componentFileTemplate: `${fileName}.tsx`,
    testFileTemplate: `${fileName}.test.tsx`
  };
}

function writeToPath(path: string, fileName: string, content: any): void {
  const filePath = `${path}/${fileName}`;
  fs.writeFile(filePath, content, (err) => {
    if (err) {
      throw err;
    }
    // tslint:disable-next-line:no-console
    console.info('Created file: ', filePath);

    return true;
  });
}

function fileExists(path: string, file: string): boolean {
  return fs.existsSync(`${path}/${file}`);
}

function createFiles(filePath: string, fileName: string, templateFilesPath: string): void {
  const templateFileNames = getTemplateFileNames(fileName);
  const templateFilesAreMissing = (file: any) => !fileExists(filePath, fileName);
  const checkAllMissing = (prev: any, cur: any) => prev && cur;

  const componentNotExist = Object.keys(templateFileNames)
    .map((file) => templateFilesAreMissing(file))
    .reduce((previousValue, currentValue) => checkAllMissing(previousValue, currentValue));

  if (componentNotExist) {
    // tslint:disable-next-line:no-console
    console.info(`Detected new component: ${fileName}, ${filePath}`);
    Object.keys(templateFileNames).forEach((key) => {
      const fileContent = fs.readFileSync(`${templateFilesPath}/${key}.tsx`, 'utf8').replace(/NAME/g, `${fileName}`);

      writeToPath(filePath, templateFileNames[key], fileContent);
    });
  }
}

function startFileWatcher(): void {
  // file watcher for creating overview pages
  chokidar
    .watch('src/page/overview/**', { ignored: '_snapshots_', depth: 0, ignoreInitial: true })
    .on('addDir', (path, event) => {
      const fileName = path.replace(/.*[\/\\]page[\/\\]overview[\/\\]/, '');

      if (!fileName.includes('/') && !fileName.includes('test') && fileName.includes('Overview')) {
        createFiles(path, `${fileName.charAt(0).toUpperCase() + fileName.slice(1)}`, 'src/page/overview/template');
      }
    });

  // file watcher for creating instance pages
  chokidar
    .watch('src/page/instance/**', { ignored: '_snapshots_', depth: 0, ignoreInitial: true })
    .on('addDir', (path, event) => {
      const fileName = path.replace(/.*[\/\\]page[\/\\]instance[\/\\]/, '');

      if (!fileName.includes('/') && !fileName.includes('test') && fileName.includes('Instance')) {
        createFiles(path, `${fileName.charAt(0).toUpperCase() + fileName.slice(1)}`, 'src/page/instance/template');
      }
    });

  // file watcher for creating view components
  chokidar
    .watch('src/component/view/**', { ignored: '_snapshots_', depth: 0, ignoreInitial: true })
    .on('addDir', (path, event) => {
      const fileName = path.replace(/.*[\/\\]component[\/\\]view[\/\\]/, '');

      if (!fileName.includes('/') && !fileName.includes('test') && fileName.includes('View')) {
        createFiles(path, `${fileName.charAt(0).toUpperCase() + fileName.slice(1)}`, 'src/component/view/template');
      }
    });

  // file watcher for creating action components
  chokidar
    .watch('src/component/sidebarContent/**', { ignored: '_snapshots_', depth: 0, ignoreInitial: true })
    .on('addDir', (path, event) => {
      const fileName = path.replace(/.*[\/\\]component[\/\\]action[\/\\]/, '');

      if (!fileName.includes('/') && !fileName.includes('test') && fileName.includes('Action')) {
        createFiles(
          path,
          `${fileName.charAt(0).toUpperCase() + fileName.slice(1)}`,
          'src/component/sidebarContent/template'
        );
      }
    });

  // file watcher for creating wizard components
  chokidar
    .watch('src/component/wizard/**', { ignored: '_snapshots_', depth: 0, ignoreInitial: true })
    .on('addDir', (path, event) => {
      const fileName = path.replace(/.*[\/\\]component[\/\\]wizard[\/\\]/, '');

      if (!fileName.includes('/') && !fileName.includes('test') && fileName.includes('Wizard')) {
        createFiles(path, `${fileName.charAt(0).toUpperCase() + fileName.slice(1)}`, 'src/component/wizard/template');
      }
    });

  // file watcher for creating table components
  chokidar
    .watch('src/component/common/table/**', { ignored: '_snapshots_', depth: 0, ignoreInitial: true })
    .on('addDir', (path, event) => {
      const fileName = path.replace(/.*[\/\\]component[\/\\]common[\/\\]table[\/\\]/, '');
      if (!fileName.includes('/') && !fileName.includes('test')) {
        createFiles(
          path,
          `${fileName.charAt(0).toUpperCase() + fileName.slice(1)}`,
          'src/component/common/table/template'
        );
      }
    });
}

startFileWatcher();
