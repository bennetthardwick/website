import elasticlunr from "elasticlunr";

import { makeTeaser } from "./util/teaser";

const searchIndex = fetch(`/wiki-index.json?${COMMIT}`).then((x) => x.json());

import { render } from "react-dom";
import React, { useState, useEffect, Suspense, useMemo, useRef } from "react";

const searchRoot = document.getElementById("search");

if (!searchRoot) {
  return;
}

const Results = ({ data }) => {
  return (
    <ul>
      {" "}
      {data.map((x) => (
        <li key={x.id}>
          <a href={x.href}>{x.breadcrumbs}</a>
          {x.teaser && <div dangerouslySetInnerHTML={{ __html: x.teaser }} />}
        </li>
      ))}
    </ul>
  );
};

const SearchBar = ({ index }) => {
  const data = useMemo(() => elasticlunr.Index.load(index), [index]);
  const searchRef = useRef();

  const [output, setOutput] = useState({
    term: undefined,
    loading: false,
    results: [],
  });

  useEffect(() => {
    window.addEventListener("keyup", function handleKey(e) {
      if (e.key == "/") {
        e.preventDefault();
        e.stopImmediatePropagation();

        searchRef.current.focus();
        window.scroll(0, 0);
      }
    });

    return () => {
      window.removeEventListener("keyup", handleKey);
    };
  }, []);

  useEffect(() => {
    const results = data
      .search(output.term, {
        fields: {
          title: { boost: 2 },
          body: { boost: 2 },
          breadcrumbs: { boost: 1 },
        },
        bool: "AND",
        expand: true,
      })
      .map((x) => data.documentStore.getDoc(x.ref))
      .map((x) => ({
        teaser: makeTeaser(x.body, [output.term]),
        ...x,
      }));

    setOutput({
      term: output.term,
      loading: false,
      results,
    });
  }, [output.term]);

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <input
        ref={searchRef}
        placeholder="Search the wiki..."
        onChange={(e) => {
          setOutput({
            term: e.target.value,
            loading: true,
            results: [],
          });
        }}
      />
      {output.term && !output.loading && (
        <div
          className="search-results"
          style={{
            position: "absolute",
            width: "100%",
          }}
        >
          {output.results.length === 0 ? (
            <>No results for "{output.term}"</>
          ) : (
            <Results data={output.results} />
          )}
        </div>
      )}
    </div>
  );
};

const withData = (Component, data) => () => {
  return <Component index={data} />;
};

const LazySearchBar = React.lazy(() =>
  searchIndex.then((data) => ({ default: withData(SearchBar, data) }))
);

render(
  <Suspense fallback={<input placeholder="Loading..." disabled />}>
    <LazySearchBar />
  </Suspense>,
  searchRoot
);