import React, { StatelessComponent } from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { PostPreview } from "../components/post-preview"
import { Stagger, StaggerWrapper } from "../components/stagger-wrapper";

export const BlogIndex: StatelessComponent<{ data: any, location: any }> = ({ data, location }) => {
  const posts = data.allMarkdownRemark.edges.map(x => x.node) as Post[];
  return (
    <Layout location={location}>
      <SEO
        title="Blog"
        keywords={[
          `blog`,
          `javascript`,
          `typescript`,
          `programming`,
          "bennetthardwick",
        ]}
      />
      <StaggerWrapper>
        <Stagger id="blog-title">
          <h1>Blog</h1>
        </Stagger>
        <PostPreview posts={posts} />
      </StaggerWrapper>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { draft: { ne: true } } fileAbsolutePath: { regex: "^\/blog\/" } }
      limit: 1000
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            byline
          }
        }
      }
    }
  }
`
