import React, { StatelessComponent, useState, useEffect } from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { PostPreview } from "../components/post-preview"
import About from "../components/about"
import Projects from "../components/projects"
import { Stagger, StaggerWrapper } from "../components/stagger-wrapper";

export const Home: StatelessComponent<{ data: any, location: any }> = ({ data, location }) => {
  const posts = data.allMarkdownRemark.edges.map(x => x.node) as Post[];
  const projects = data.allProjectsYaml.edges.map(x => x.node) as Project[];
  return (
    <Layout location={location}>
      <SEO
        title="Projects"
        keywords={[`projects`, `gatsby`, `javascript`, `react`]}
      />

      <StaggerWrapper>

        <Stagger id="about-section-wow" >
          <About />
        </Stagger>

        <Stagger id="project" >
        <h2>Projects</h2>
        </Stagger>

        <Projects projects={projects} />

        <Stagger id="posts-to-flip" >
        <h2>Recent Posts</h2>
        </Stagger>

        <PostPreview posts={posts.slice(0, 3)} />

      </StaggerWrapper>
    </Layout>
  )
}

export default Home;

export const pageQuery = graphql`
  query {
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
    allProjectsYaml {
      edges {
        node {
          title
          byline
          date
          link
        }
      }
    }
  }
`
