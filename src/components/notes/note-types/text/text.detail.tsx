import React, { FunctionComponent } from "react"
import { BaseNote } from "../module"
import styled from "styled-components";

type Data = {
  html: string
}

const DetailedTitle = styled.h2`
  margin-top: 1.1rem;
`;

export const TextNote: FunctionComponent<
  BaseNote<Data> & { showTitle?: boolean }
> = ({ children, data, showTitle, title, ...rest }) => (
  <>
    {showTitle ? <DetailedTitle>{title}</DetailedTitle> : undefined}
    <div dangerouslySetInnerHTML={{ __html: data.html }} {...rest} />
  </>
)
