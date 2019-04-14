import React, { StatelessComponent, useState, useEffect } from "react"
import { NotesGrid } from "../components/notes/note-grid"
import styled, { css } from "styled-components"
import Layout from "../components/layout"
import { SEO } from "../components/seo"
import { Stagger, StaggerWrapper } from "../components/stagger-wrapper"
import { rhythm } from "../utils/typography"
import { PageRenderer, graphql } from "gatsby"

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

const isSSR = () => typeof window === 'undefined';

export const Notes: StatelessComponent<{ data: any; location: any }> = ({
  data,
  location,
}) => {

  const [ notesList, setNotesList ] = useState( isSSR() ? data.allFile.nodes.map(x => x.id) : []);

  useEffect(() => {
    const nl = data.allFile.nodes.map(x => x.id);
    const nlp = nl.map(id => ( ___loader as any).getResourcesForPathname(`/data/notes/preview/${id}`));

    for (const n of nl) {
      ___loader.getResourcesForPathname(`/data/notes/detail/${n}`);
    }


    Promise.all(nlp).then(() => {
      setTimeout(() => setNotesList(nl));
    })

  }, [false]);

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
            <p>Some stuff I done learned.</p>
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
