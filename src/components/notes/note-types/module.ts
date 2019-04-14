import { StatelessComponent, FunctionComponent } from "react";
import { TextNote } from "./text/text.detail";
import { TextNotePreview } from "./text/text.preview";

export type NoteType = keyof typeof NOTE_TYPE_MAP;

export interface BaseNote<T = any> {
  id: string
  title: string;
  name: string;
  type: NoteType;
  data: T
}

interface NoteTypeMap {
    [key: string]: {
        preview: FunctionComponent<BaseNote>,
        detail: FunctionComponent<BaseNote & { showTitle?: boolean }>
    }
}

export const NOTE_TYPE_MAP: NoteTypeMap = {
  text: {
      preview: TextNotePreview,
      detail: TextNote
  }
}
