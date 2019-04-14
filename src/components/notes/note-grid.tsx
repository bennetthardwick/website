import React, { StatelessComponent, useEffect, useRef, useState } from "react"
import { NOTE_WIDTH, MARGIN_SIZE, Note } from "./note"
import styled from "styled-components"
import { Flipped, Flipper } from "react-flip-toolkit"
import { BaseNote } from "./note-types/module";

// declare var ___loader: any;

const SelectedBackdrop = styled.div<{ open: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;
  transition: background 0.6s;
  background: rgba(28, 28, 28, ${props => (props.open ? 0.2 : 0.0)});

  ${props => (props.open ? "" : "pointer-events: none;")}
`

const NotesContainer = styled.div<{ height?: number; width: number }>`
  position: relative;
  width: ${props => props.width}px;
  min-height: 50vh;
  transition: height 0.2s;
  height: ${props => (props.height !== undefined ? props.height + "px" : "auto")};
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


export const NotesGrid: StatelessComponent<{ notesList: BaseNote<any>[] }> = ({ children, notesList, ...rest }) => {
  const [shouldUpdate, setShouldUpdate] = useState(false)
  const [shouldRecalculatePosition, setRecalculatePosition] = useState(false)
  const [columnCount, setColumnCount] = useState(WINDOW_COLUMN_COUNT())
  const [notesMap, setNotesMap] = useState({})
  const [containerHeight, setContainerHeight] = useState(0);
  const [columnSize, setColumnSize] = useState(Array.from({ length: columnCount }).map(() => 0));
  const [selected, setSelected] = useState(undefined)
  const [topElement, setTopElement] = useState(undefined)

  const notesRef = useRef<HTMLDivElement | null>()

  useEffect(() => {
    measureNoteRects()
  }, [notesList]);

  function measureNoteRects(): void {

    const newNotes = 
      Array.from(
        notesRef.current!.getElementsByClassName("preview-note")
      );

      if (newNotes.length <= 0) {
        return
      }

    setNotesMap(
      newNotes.reduce(
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
        .filter(note => !!nm[note.id])
        .reduce(
          (acc, note) => {
            acc[note.id] = {
              ...acc[note.id],
              visible: true,
            }
            return acc
          },
          { ...nm }
        ),
    }
  }

  function recalculateNoteSizes(): void {
    const newColumns = Array.from({ length: columnCount }).map(() => 0);

    setNotesMap(
      notesList
        .filter(({ id }) => !!notesMap[id])
        .reduce(
          (acc, { id }) => {
            const index = newColumns.indexOf(Math.min(...newColumns))
            const top = newColumns[index]
            const left = index * (NOTE_WIDTH + MARGIN_SIZE)
            const height = notesMap[id].height

            newColumns[index] += height + MARGIN_SIZE

            acc[id] = {
              ...acc[id],
              height,
              left,
              top,
            }

            return acc
          },
          { ...notesMap }
        )
    )

    setColumnSize(newColumns);
    setContainerHeight(Math.max(...newColumns))
    setRecalculatePosition(false)
    setShouldUpdate(!shouldUpdate)
  }

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

  function updateAnimation(): void {
    setShouldUpdate(!shouldUpdate);
  }

  return (
    <div {...rest}>
      <HiddenNotesContainer ref={notesRef}>
        {notesList
          .filter(({ id }) => !notesMap[id])
          .map(x => (
            <Note
              key={x.id}
              className="preview-note"
              data-note-id={x.id}
              {...x}
            />
          ))}
      </HiddenNotesContainer>
      <Flipper flipKey={shouldUpdate}>
        {isSSR() ? (
          <SSRNotesContainer>
            {notesList.map(x => (
              <Flipped translate scale key={x.id} flipId={x.id}>
                <Note
                  onSelected={selectNote}
                  visible={true}
                  server={true}
                  {...x}
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
            height={containerHeight}
          >
            {notesList
              .filter(({ id }) => !!notesMap[id])
              .map(x => (
                <Flipped translate scale key={x.id} flipId={x.id}>
                  <Note
                    server={columnCount === 1}
                    topElement={x.id === topElement}
                    open={x.id === selected}
                    onSelected={selectNote}
                    visible={notesMap[x.id].visible}
                    key={x.id}
                    rect={columnCount !== 1 && notesMap[x.id]}
                    {...x}
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
