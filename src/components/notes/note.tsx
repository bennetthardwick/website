import React, { StatelessComponent, useEffect, useState } from "react"
import styled, { css } from "styled-components"
import { rhythm } from "../../utils/typography"
import { NOTE_TYPE_MAP, BaseNote } from "./note-types/module";
import { Link, PageRenderer, parsePath } from "gatsby";
import { openSync } from "fs";

export const NOTE_WIDTH = 238
export const MARGIN_SIZE = 8

const TOP_PADDING = 12
const LEFT_PADDING = 16

const PreviewNote = styled.div<{ set?: boolean }>`
  overflow: hidden;
  user-select: none;
  height: 100%;
  width: ${NOTE_WIDTH - 32 + 'px'};
  font-size: ${rhythm(0.54)};

  > a {
    color: inherit;
  }

  ${props =>
    props.set
      ? css`
          top: ${TOP_PADDING};
          left: ${LEFT_PADDING};
          position: absolute;
        `
      : ""}
`
const DetailNote = styled.div``

const NoteContainer = styled.div<{
  rect?: { height: number; left: number; top: number }
  open?: boolean
  visible?: boolean
  topElement?: boolean
  server?: boolean
}>`

  ${props => props.server ? css`
    width: 100%;
    height: fit-content;
    ${PreviewNote} {
      width: 100% !important;
    }
  ` : css`
    position: absolute;
    width: ${NOTE_WIDTH + 'px'};
  `};

  top: 0;
  left: 0;
  height: auto;
  min-height: 60px;
  border: solid #e0e0e0 1px;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 1px 1px 4px rgba(28, 28, 28, 0);
  background: #fff;
  margin-bottom: 8px;

  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.8s;

  :hover {
    box-shadow: 0px 1px 4px rgba(28, 28, 28, 0.2);
  }

  ${DetailNote} {
    position: ${props => (!props.open ? "absolute" : "relative")};
    opacity: ${props => (!props.open ? 0 : 1)};
    top: 0;
    left: 0;
  }

  ${props => props.topElement ? 'z-index: 10;' : ''}

  ${({ rect, open }) => {
    if (open) {
      return css`
        height: fit-content;
        width: 600px;
        z-index: 10;
        top: 10vh;
        max-height: 88vh;
        overflow-y: auto;

        &::-webkit-scrollbar-track {
        	border-radius: 4px;
        }

        &::-webkit-scrollbar {
          width: 8px;
          border-radius: 4px;
        	background-color: #F5F5F5;
        }

        &::-webkit-scrollbar-thumb
        {
        	border-radius: 4px;
        	background-color: rgba(28, 28, 28, 0.3);
        }


        left: calc(50% - 300px);
        position: fixed;
        box-shadow: 1px 2px 16px rgba(28, 28, 28, 0.1);

        @media (max-width: 693px) {
          width: 94vw;
          left: calc(50% - 47vw);
        }
        
      `
    } else if (rect) {
      return css`
        transform: translate(${rect.left}px, ${rect.top}px);
        height: ${rect.height}px;
      `
    } else {
      return ""
    }
  }}
`

export const Note: StatelessComponent<
  {
    rect?: { height: number; left: number; top: number }
    visible?: boolean
    className?: string
    open?: boolean
    topElement?: boolean
    server?: boolean
    onSelected?: (id: string) => void
  } & BaseNote<any>
> = ({
  children,
  onSelected,
  visible,
  open,
  server,
  type,
  data,
  name,
  id,
  title,
  ...rest
}) => {

  const [ loadStarted, setLoadStarted ] = useState(false);
  const [ loadComplete, setLoadComplete ] = useState(false);
  const [ shouldOpen, setShouldOpen ] = useState(false);

  useEffect(() => {
    if (shouldOpen && loadComplete) {
      onSelected(id);
      setShouldOpen(false);
    }
  });

  function selectNote() {
    (window || {} as any).__NOTES_LAYOUT_LOADED = true;

    if (loadStarted) {
      return;
    }

    if (!loadComplete) {
      setLoadStarted(true);
      (___loader as any).getResourcesForPathname(detailsLink)
        .then(() => {
          setLoadComplete(true)
          setLoadStarted(false);
          setShouldOpen(true);
        });
    } else {
      onSelected(id);
    }
  }

  function preventClick(e: React.MouseEvent) {
    e.preventDefault();
  }

  const Preview = NOTE_TYPE_MAP[type].preview;

  const detailsLink = `/notes/d/${name}`;

  const showDetail = open && loadComplete;

  return (
    <NoteContainer server={server} visible={visible} open={showDetail} onClick={selectNote} {...rest}>
      {!showDetail && (
        <PreviewNote set={!!rest.rect}>
        <Link to={detailsLink} onClick={preventClick}>
          <Preview {...{ id, type, data, name, title }} />
        </Link>
        </PreviewNote>
      )}
      {showDetail && (
        <DetailNote>
          <PageRenderer location={parsePath(detailsLink)} /> 
        </DetailNote>
      )}
    </NoteContainer>
  )
}
