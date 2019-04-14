import { graphql } from "gatsby"
import React, { StatelessComponent, useState } from "react"
import styled, { css } from "styled-components"
import Layout from "../../components/layout"
import { NotesGrid } from "../../components/notes/note-grid"
import { SEO } from "../../components/seo"
import { Stagger, StaggerWrapper } from "../../components/stagger-wrapper"
import { rhythm } from "../../utils/typography"
import { BaseNote } from "../../components/notes/note-types/module"

const OriginalWidth = css`
  max-width: calc(${rhythm(24)} - calc(${rhythm(3 / 4)} * 2));
  margin: auto;
`

const NotesLayout = styled(Layout)`
  @media (min-width: 778px) {
    max-width: 1385px;

    > nav {
      ${OriginalWidth}
    }
    > footer {
      ${OriginalWidth}
    }
    > main {
      width: 100%;
      > header {
        ${OriginalWidth}
      }
    }
  }

  margin: auto;
  max-width: calc(${484}px + calc(${rhythm(3 / 4)} * 2));
`

export const Notes: StatelessComponent<{
  data: any
  location: any
  pageContext: { notes: BaseNote<any>[] }
}> = ({ data, location, pageContext: { notes } }) => {

  const [notesList, setNotesList] = useState(notes);

  return (
    <NotesLayout location={location}>
      <SEO
        title="Notes"
        keywords={[
          `blog`,
          `javascript`,
          `typescript`,
          `programming`,
          "bennetthardwick",
        ]}
      />

      <header>
        <StaggerWrapper>
          <Stagger id="notes">
            <h1>Notes</h1>
          </Stagger>
          <Stagger id="stuff">
            <p>Some stuff I done learned. Click on a note to read more.</p>
          </Stagger>
        </StaggerWrapper>
      </header>
      <NotesGrid notesList={notesList} />
    </NotesLayout>
  )
}

export default Notes

export const pageQuery = graphql`
  query {
    allFile(filter: { sourceInstanceName: { eq: "notes" } }) {
      nodes {
        id
      }
    }
  }
`
