import React, { FunctionComponent } from "react"
import { BaseNote } from "../module"

type Data = {
  html: string;
}

export const TextNote: FunctionComponent<BaseNote<Data>> = ({
  children,
  data,
  ...rest
}) => <div dangerouslySetInnerHTML={{ __html: data.html }} {...rest}/>


