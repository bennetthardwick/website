import React, { FunctionComponent } from "react"
import { BaseNote } from "../module"

type Data = string

export const TextNote: FunctionComponent<BaseNote<Data>> = ({
  children,
  data,
  ...rest
}) => <div {...rest}>
    <h1>This is an amazing title</h1>
    {data}
</div>
