import React, { FunctionComponent } from "react"
import { BaseNote } from "../module"
import styled from "styled-components"
import { rhythm } from "../../../../utils/typography"

type Data = {
  html: string
  preview: string
}

const PreviewTextContainer = styled.div`
  h1 {
    margin-top: ${rhythm(0.3)};
    margin-bottom: ${rhythm(0.2)};
    font-size: ${rhythm(0.7)};
  }

  p {
    margin-bottom: ${rhythm(0.3)};
    font-size: ${rhythm(0.55)};
  }

  h2,
  h3,
  h4 {
    margin-top: ${rhythm(0.3)};
    margin-bottom: ${rhythm(0.2)};
    font-size: ${rhythm(0.6)};
  }

  code {
    display: none;
  }
`

export const TextNotePreview: FunctionComponent<BaseNote<Data>> = ({
  children,
  data,
  ...rest
}) => (
  <PreviewTextContainer>
    <h2>{ rest.title }</h2>
    <div dangerouslySetInnerHTML={{ __html: data.preview }} {...rest} />
  </PreviewTextContainer>
)
