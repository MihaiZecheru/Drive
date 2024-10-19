declare const __brand: unique symbol
type Brand<B> = { [__brand]: B };
type Branded<T, B> = T & Brand<B>;

// ----------------------------------------

type ID = Branded<`${string}-${string}-${string}-${string}`, "ID">;
export type UserID = Branded<ID, "UserID">;
export type FileID = Branded<ID, "FileID">;
export type FolderID = Branded<ID, "FolderID">;