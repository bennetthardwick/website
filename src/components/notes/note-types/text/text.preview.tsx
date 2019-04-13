import React, { FunctionComponent } from "react"
import { BaseNote } from "../module"

type Data = string

export const TextNotePreview: FunctionComponent<BaseNote<Data>> = ({
  children,
  data,
  ...rest
}) => <div {...rest}>
{data}</div>

