import React, { StatelessComponent } from "react"
import { rhythm } from "../utils/typography"
import Nav from "./nav";
import styled from 'styled-components';

const LayoutContainer = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: ${rhythm(24)};
  padding: ${rhythm(1.5)} ${rhythm(3 / 4)};
`;

export const Layout: StatelessComponent<{ location: any }> = ({ location, children, ...rest }) =>
  <LayoutContainer {...rest}>
    <Nav path={location.pathname} />
    <main>{children}</main>
    <footer
      style={{ opacity: 0.5, marginTop: rhythm(4), textAlign: "center" }}
    >
      The result of torturous tinkering and misplaced motivation. I'm just
      waiting for things to break.
        </footer>
  </LayoutContainer>;

export default Layout
