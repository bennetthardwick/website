import React, { StatelessComponent } from "react"
import styled, { css } from "styled-components"
import { rhythm } from "../../utils/typography"
import { PageRenderer, parsePath } from "gatsby";

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
  selected?: boolean
  open?: boolean
  visible?: boolean
  topElement?: boolean
  server?: boolean
}>`

  ${props => props.server ? css`
    width: 100%;
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
  transition: opacity 0.3s;

  :hover {
    box-shadow: 0px 1px 4px rgba(28, 28, 28, 0.2);
  }

  ${DetailNote} {
    position: ${props => (!props.open ? "absolute" : "relative")};
    opacity: ${props => (!props.open ? 0 : 1)};
    top: 0;
    left: 0;
  }

  ${props => props.topElement ? 'z-index: 4;' : ''}

  ${({ rect, open }) => {
    if (open) {
      return css`
        height: fit-content;
        width: 600px;
        z-index: 10;
        top: 20vh;
        left: calc(50% - 300px);
        position: fixed;
        box-shadow: 1px 2px 16px rgba(28, 28, 28, 0.1);

        @media (max-width: 693px) {
          width: 94vw;
          top: 15vh;
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
    selected?: boolean
    topElement?: boolean
    server?: boolean
    onSelected?: (id: string) => void
    noteId: string
  }
> = ({
  children,
  onSelected,
  visible,
  noteId,
  open,
  server,
  ...rest
}) => {

  function selectNote() {
    onSelected && onSelected(noteId)
  }

  return (
    <NoteContainer server={server} visible={visible} open={open} onClick={selectNote} {...rest}>
      {!open && (
        <PreviewNote set={!!rest.rect}>
          <React.Fragment>
            <PageRenderer location={parsePath(`/data/notes/preview/${noteId}`)} />
          </React.Fragment>
        </PreviewNote>
      )}
      {open && (
        <DetailNote>
          {/* <Detail {...noteData} /> */}
          <PageRenderer location={parsePath(`/data/notes/detail/${noteId}`)} />
        </DetailNote>
      )}
    </NoteContainer>
  )
}
