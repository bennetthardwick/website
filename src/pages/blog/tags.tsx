import React, { StatelessComponent } from "react"
import Helmet from "react-helmet"
import { Link, graphql } from "gatsby"
import Layout from "../../components/layout"
import { Stagger, StaggerWrapper } from "../../components/stagger-wrapper"

const AllTagsPage: StatelessComponent<{ data: any; location: any }> = ({
  data,
  location,
}) => {
  const title = data.site.siteMetadata.title
  const allTags = data.allMarkdownRemark.group

  return (
    <Layout location={location}>
      <Helmet title={title} />
      <div>
        <StaggerWrapper>
          <Stagger id="all-tags-title">
            <h1>Tags</h1>
          </Stagger>
          <Stagger id="tags">
            <ul>
              {allTags.map(tag => (
                <li key={tag.fieldValue}>
                  <Link
                    style={{
                      textDecoration: "none",
                    }}
                    to={`/blog/tag/${tag.fieldValue}/`}
                  >
                    {tag.fieldValue} ({tag.totalCount})
                  </Link>
                </li>
              ))}
            </ul>
          </Stagger>
        </StaggerWrapper>
      </div>
    </Layout>
  )
}

export default AllTagsPage

export const pageQuery = graphql`
  query TagsQuery {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      limit: 2000
      filter: { frontmatter: { draft: { ne: true } } }
    ) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`
