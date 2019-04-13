import React, { StatelessComponent, useEffect, useState } from "react";
import { graphql, StaticQuery, Link } from "gatsby";
import Image from 'gatsby-image';
import styled, { css } from 'styled-components';
import { rhythm } from "../utils/typography";
import { Flipper, Flipped } from 'react-flip-toolkit';

const LinksContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  * {
    margin: 0px 13px;
  }
`

const NavContainer = styled.div<{ side: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  min-height: 92px;

  ${props => props.side ? css`
    flex-direction: row;
    justify-content: space-between;
  ` : css`
    flex-direction: column;
    ${LinksContainer} {
      margin-top: 16px;
      flex-direction: column;
    }
  `}
  
  > * {
    display: flex;
    width: fit-content;
    height: fit-content;
  }
`;

const HomeButton = styled(Link)`
  background-image: none;
`;

const ROOT_PATH = `${__PATH_PREFIX__}/`
const BLOG_PATH = `${__PATH_PREFIX__}/blog`
const NOTES_PATH = `${__PATH_PREFIX__}/notes`

const NavLink = styled(Link)`
  font-size: ${rhythm(0.8)};
  display: inline-block;
  width: fit-content;
`

// middle to side = 

let previousPath = undefined;

export const Nav: StatelessComponent<{ path: string }> = ({ path: currentPath, children, ...rest }) => {

  const [statePath, setPath] = useState(previousPath || currentPath);

  const path = statePath || currentPath;

  useEffect(() => {
    setPath(currentPath);
    previousPath = currentPath;
  }, [false]);

  return (
    <nav>
      <Flipper flipKey={path !== ROOT_PATH}>
        <NavContainer {...rest} side={path !== ROOT_PATH} >
          <Flipped flipId="home-button">
            <HomeButton to={'/'}>
              <StaticQuery
                query={avatarQuery}
                render={data => (
                  <Image
                    fixed={data.avatar.childImageSharp.fixed}
                    style={{
                      minWidth: 50,
                      borderRadius: `50%`
                    }}
                    imgStyle={{
                      borderRadius: `50%`
                    }} />
                )} />
            </HomeButton>
          </Flipped>
          <LinksContainer>
            <Flipped flipId="notes-button">
              <NavLink to={NOTES_PATH}>
                Notes
            </NavLink>
            </Flipped>

            <Flipped flipId="blog-button">
              <NavLink to={BLOG_PATH}>
                Blog
            </NavLink>
            </Flipped>
          </LinksContainer>
        </NavContainer>
      </Flipper>
    </nav>
  )
};

export default Nav;

const avatarQuery = graphql`
  query AvatarQuery {
    avatar: file(absolutePath: { regex: "/profile.jpg/" }) {
      childImageSharp {
        fixed(width: 50, height: 50) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`

