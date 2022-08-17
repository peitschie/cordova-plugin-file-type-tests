/// <reference types="cordova-plugin-file"/>

export async function resolveLocalFileSystemURLAsync(path: string) {
  return new Promise<Entry>((resolve, reject) =>
    window.resolveLocalFileSystemURL(path, resolve, reject)
  );
}

export async function removeEntry(entry: FileEntry|DirectoryEntry) {
  return new Promise<void>((resolve, reject) => entry.remove(resolve, reject));
}

export async function requestFileSystem(fs: LocalFileSystem) {
  return new Promise<FileSystem>((resolve, reject) => {
    window.requestFileSystem(fs, 0, resolve, reject);
  });
}

export function isDirectoryEntry(entry: Entry): entry is DirectoryEntry {
  return entry.isDirectory;
}

export async function resolveDirectoryEntry(path: string) {
  const entry = await resolveLocalFileSystemURLAsync(path);
  if (!isDirectoryEntry(entry)) throw new Error(`${path} was not a directory`);
  return entry;
}

export async function listDir(path: string) {
  const dir = await resolveDirectoryEntry(path);
  const reader = dir.createReader();
  return new Promise<Entry[]>((resolve, reject) => reader.readEntries(resolve, reject));
}


export async function getFile(fileEntry: FileEntry) {
  return new Promise<File>((resolve, reject) => fileEntry.file(resolve, reject));
}

export async function readFileAsText(file: File) {
  return new Promise<string | undefined>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target?.result as string | undefined);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export async function readFileAsArrayBuffer(file: File) {
  return new Promise<ArrayBuffer | undefined>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target?.result as ArrayBuffer | undefined);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export async function createWriter(fileEntry: FileEntry) {
  return new Promise<FileWriter>((resolve, reject) => fileEntry.createWriter(resolve, reject));
}

export async function writeFile(fileEntry: FileEntry, dataContent: ArrayBuffer) {
  const writer = await createWriter(fileEntry);
  return new Promise<void>((resolve, reject) => {
    writer.onwriteend = () => resolve();
    writer.onerror = reject;
    writer.write(new Blob([dataContent]));
  });
}

export async function getFileEntry(directoryEntry: DirectoryEntry, path: string, options?: Flags): Promise<FileEntry> {
  return new Promise<FileEntry>((resolve, reject) => directoryEntry.getFile(path, options, e => resolve(e as FileEntry), reject));
}