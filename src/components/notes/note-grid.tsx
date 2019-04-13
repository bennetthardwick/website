import React, { StatelessComponent, useEffect, useRef, useState } from "react"
import { NOTE_WIDTH, MARGIN_SIZE, Note } from "./preview-note"
import { rhythm } from "../../utils/typography"
import styled, { css } from "styled-components"
import { Flipped, Flipper } from "react-flip-toolkit"

const OriginalWidth = css`
  max-width: calc(${rhythm(24)} - calc(${rhythm(3 / 4)} * 2));
  margin: auto;
`

const SelectedBackdrop = styled.div<{ open: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: background 0.6s;
  background: rgba(28, 28, 28, ${props => (props.open ? 0.2 : 0.0)});

  ${props => (props.open ? "" : "pointer-events: none;")}
`

const NotesContainer = styled.div<{ height?: number; width: number }>`
  position: relative;
  width: ${props => props.width}px;
  min-height: 300px;
  height: ${props => (props.height ? props.height + "px" : "auto")};
  margin: auto;
`

const SSRNotesContainer = styled.div`
  display: grid;
  width: fit-content;
  grid-gap: 8px;
  margin: auto;

  @media (min-width: 1100px) {
    grid-template-columns: ${NOTE_WIDTH}px ${NOTE_WIDTH}px ${NOTE_WIDTH}px ${NOTE_WIDTH}px;
  }

  @media (max-width: 1100px) {
    grid-template-columns: ${NOTE_WIDTH}px ${NOTE_WIDTH}px ${NOTE_WIDTH}px;
  }

  @media (max-width: 800px) {
    grid-template-columns: ${NOTE_WIDTH * 1.25}px ${NOTE_WIDTH * 1.25}px;
  }

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`

const HiddenNotesContainer = styled.div`
  position: fixed;
  visibility: hidden;
`

const b = [
  {
    id: "a",
    text:
      "wowowowo asd fas df asdlkjfa;lskdj f;alskjd f;alks jdf;lkajs d;flkajs d;lkfjas d;lkfja sd;lkfj",
  },
  { id: "b", text: "wowowowo" },
  {
    id: "c",
    text: "wowowowo asdfajsd fa sd fas df as df askdjflaskdjflkajshd flakjshdf",
  },
  { id: "d", text: "wowowowo" },
  { id: "e", text: "wowowowo asdf" },
  { id: "f", text: "wowowowo" },
]

const isSSR = () => typeof window == "undefined"

const calculateColumnCount = () =>
  Math.max(
    1,
    Math.min(
      4,
      Math.floor((window.innerWidth - 20 * 2) / (NOTE_WIDTH + MARGIN_SIZE))
    )
  )

const WINDOW_COLUMN_COUNT = () => (!isSSR() ? calculateColumnCount() : 4)

export const NotesGrid: StatelessComponent = ({ children, ...rest }) => {
  const [shouldUpdate, setShouldUpdate] = useState(false)
  const [shouldRecalculatePosition, setRecalculatePosition] = useState(false)
  const [containerHeight, setContainerHeight] = useState(0)
  const [columnCount, setColumnCount] = useState(WINDOW_COLUMN_COUNT())
  const [notesMap, setNotesMap] = useState({})
  const [notesList, setNotesList] = useState([...b])
  const [columnSize, setColumnSize] = useState(
    Array.from({ length: columnCount }).map(() => 0)
  )
  const [selected, setSelected] = useState(undefined)
  const [topElement, setTopElement] = useState(undefined)

  const notesRef = useRef<HTMLDivElement | null>()

  function measureNoteRects(): void {
    setNotesMap(
      Array.from(
        notesRef.current!.getElementsByClassName("preview-note")
      ).reduce(
        (acc, a, i) => {
          const { height } = a.getBoundingClientRect()
          const index = columnSize.indexOf(Math.min(...columnSize))
          const top = columnSize[index]
          const left = index * (NOTE_WIDTH + MARGIN_SIZE)
          columnSize[index] += height + MARGIN_SIZE
          acc[a.getAttribute("data-note-id")] = {
            height,
            top,
            left,
            visible: false,
          }
          return acc
        },
        { ...notesMap }
      )
    )
    setContainerHeight(Math.max(...columnSize))
  }

  useEffect(() => {
    measureNoteRects()
  }, [notesList])

  useEffect(() => {
    if (selected) {
      setTopElement(selected)
    }
  }, [selected])

  useEffect(() => {
    setShouldUpdate(!shouldUpdate)
  }, [selected])

  useEffect(() => {
    if (shouldRecalculatePosition) {
      recalculateNoteSizes()
    }
  })

  useEffect(() => {
    function handleResize(e: UIEvent) {
      const newCount = calculateColumnCount()
      if (newCount !== columnCount) {
        setColumnCount(newCount)
        setRecalculatePosition(true)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  })

  function setAllNotesVisible(nm?: typeof notesMap): typeof notesMap {
    nm = nm || notesMap

    return {
      ...notesList
        .filter(x => !!nm[x.id])
        .reduce(
          (acc, a) => {
            acc[a.id] = {
              ...acc[a.id],
              visible: true,
            }
            return acc
          },
          { ...nm }
        ),
    }
  }

  function recalculateNoteSizes(): void {
    const newColumns = Array.from({ length: columnCount }).map(() => 0)

    setNotesMap(
      notesList
        .filter(x => !!notesMap[x.id])
        .reduce(
          (acc, a) => {
            const index = newColumns.indexOf(Math.min(...newColumns))
            const top = newColumns[index]
            const left = index * (NOTE_WIDTH + MARGIN_SIZE)
            const height = notesMap[a.id].height

            newColumns[index] += height + MARGIN_SIZE

            acc[a.id] = {
              ...acc[a.id],
              height,
              left,
              top,
            }

            return acc
          },
          { ...notesMap }
        )
    )

    setColumnSize(newColumns)
    setContainerHeight(Math.max(...newColumns))
    setRecalculatePosition(false)
    setShouldUpdate(!shouldUpdate)
  }

  useEffect(() => {
    setTimeout(() => {
      setNotesList([
        ...notesList,
        {
          id: "g",
          text:
            "wowowowo asd fas df asdlkjfa;lskdj f;alskjd f;alks jdf;lkajs d;flkajs d;lkfjas d;lkfja sd;lkfj",
        },
        { id: "h", text: "wowowowo" },
        {
          id: "i",
          text:
            "wowowowo asdfajsd fa sd fas df as df askdjflaskdjflkajshd flakjshdf",
        },
        { id: "j", text: "wowowowo" },
        { id: "k", text: "wowowowo asdf" },
        { id: "l", text: "wowowowo" },
      ])
    }, 3000)
  }, [false])

  useEffect(() => {
    for (const note of notesList) {
      if (!notesMap[note.id]) {
        continue
      }

      if (!notesMap[note.id].visible) {
        setNotesMap(setAllNotesVisible(notesMap))
        setShouldUpdate(!shouldUpdate)
        break
      }
    }
  })

  function selectNote(id: string): void {
    setSelected(id)
    setShouldUpdate(!shouldUpdate)
  }

  function closeNotes(): void {
    setSelected(undefined)
    setShouldUpdate(!shouldUpdate)
  }

  return (
    <div {...rest}>
      <HiddenNotesContainer ref={notesRef}>
        {notesList
          .filter(x => !notesMap[x.id])
          .map(x => (
            <Note
              key={x.id}
              className="preview-note"
              data-note-id={x.id}
              type={"text"}
              id={x.id}
              data={x.text}
            />
          ))}
      </HiddenNotesContainer>
      <Flipper flipKey={shouldUpdate}>
        {isSSR() ? (
          <SSRNotesContainer>
            {notesList.map(({ id, text }) => (
              <Flipped translate scale key={id} flipId={id}>
                <Note
                  onSelected={selectNote}
                  type={"text"}
                  id={id}
                  data={text}
                  visible={true}
                  server={true}
                  key={id}
                />
              </Flipped>
            ))}
          </SSRNotesContainer>
        ) : (
          <NotesContainer
            width={
              columnCount !== 1
                ? columnCount * (NOTE_WIDTH + MARGIN_SIZE) - MARGIN_SIZE
                : undefined
            }
            height={columnCount !== 1 ? containerHeight : undefined}
          >
            {notesList
              .filter(x => !!notesMap[x.id])
              .map(({ id, text }) => (
                <Flipped translate scale key={id} flipId={id}>
                  <Note
                    server={columnCount === 1}
                    topElement={id === topElement}
                    open={id === selected}
                    onSelected={selectNote}
                    type={"text"}
                    id={id}
                    data={text}
                    visible={notesMap[id].visible}
                    key={id}
                    rect={columnCount !== 1 && notesMap[id]}
                  />
                </Flipped>
              ))}
          </NotesContainer>
        )}
      </Flipper>
      <SelectedBackdrop onClick={closeNotes} open={!!selected} />
    </div>
  )
}
