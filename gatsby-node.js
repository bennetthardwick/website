const path = require(`path`)
const {
  createFilePath
} = require(`gatsby-source-filesystem`)

exports.createPages = ({
  graphql,
  actions
}) => {
  const {
    createPage,
    createRedirect
  } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.tsx`)
  const tagPage = path.resolve(`./src/templates/tag-page.tsx`)


  const dataNotesPreview = path.resolve(`./src/templates/notes/preview-note.tsx`)
  const dataNotesDetail = path.resolve(`./src/templates/notes/detail-note.tsx`)

  return graphql(
    `
      {

	      allFile {
         nodes {
          sourceInstanceName
          id
           childMarkdownRemark {
             id
             html
             frontmatter {
               title
             }
           }
         }
        }

        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          filter: { frontmatter: { draft: { ne: true } } }
          limit: 1000
        ) {
          nodes {
              id
              fields {
                slug
              }
              frontmatter {
                title
                tags
              }
            }
          }
      }
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors
    }

    createRedirect({
      fromPath: '/about',
      toPath: '/',
      statusCode: 302
    });

    const postIds = new Set(result.data.allFile.nodes.filter(x => x.sourceInstanceName === 'blog' && x.childMarkdownRemark).map(x => x.childMarkdownRemark.id));

    // Create blog posts pages.
    const posts = result.data.allMarkdownRemark.nodes.filter(x => postIds.has(x.id));
    const tags = new Set(posts.reduce((acc, post) => acc.concat(post.frontmatter.tags || []), []))

    posts.forEach((post, index) => {
      const previous = index === posts.length - 1 ? null : posts[index + 1].node
      const next = index === 0 ? null : posts[index - 1].node

      createPage({
        path: post.fields.slug,
        component: blogPost,
        context: {
          slug: post.fields.slug,
          previous,
          next,
        },
      })
    })

    tags.forEach(tag => {
      createPage({
        path: `/blog/tag/${tag}`,
        component: tagPage,
        context: {
          tag
        }
      })
    })


    /**
     * NOTES
     */


    const notes = result.data.allFile.nodes.filter(x => x.sourceInstanceName === 'notes');

    for (const note of notes) {

      createPage({
        path: `/data/notes/preview/${note.id}`,
        component: dataNotesPreview
      });

      createPage({
        path: `/data/notes/detail/${note.id}`,
        component: dataNotesDetail
      });

    }


  })
}

exports.onCreateNode = ({
  node,
  actions,
  getNode
}) => {
  const {
    createNodeField
  } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({
      node,
      getNode
    })
    createNodeField({
      name: `slug`,
      node,
      value: '/blog' + value,
    })
  }
}