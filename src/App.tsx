import { nanoid } from "nanoid";
import React, { FormEvent, useCallback, useEffect, useState } from "react";

import faultSearch from "./utils/faultSearch";

import ToggleSwitch from "./components/ToggleSwitch";
import BackgroundSvg from "./components/svg/BackgroundSvg";

import "./App.scss";

const App = () => {
  const [theme, setTheme] = useState<"--light" | "--dark">("--light");

  // TODO: create useTheme hook
  const onToggleTheme = useCallback(() => {
    const { body } = document;

    theme === "--light"
      ? (body.style.backgroundColor = "black") && setTheme("--dark")
      : (body.style.backgroundColor = "white") && setTheme("--light");
  }, [theme]);

  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<any[]>([]);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();

      const input = e.target as HTMLInputElement;
      setQuery(input.value);
    },
    [query]
  );

  const onFormSubmit = useCallback(
    (e: FormEvent) => e.preventDefault(),
    [onInputChange]
  );

  useEffect(() => {
    if (query?.length) {
      if (results) setResults([]);

      const searchResults = faultSearch(query);
      if (searchResults) setResults(searchResults);
    }
  }, [query]);

  return (
    <div className="page">
      <div className="svg-background">
        <BackgroundSvg />
      </div>

      <header>
        <h1 className={`theme${theme}`}>Boiler Fault Finder</h1>
        <ToggleSwitch
          callback={onToggleTheme}
          aria-label="dark mode theme toggle"
        />
      </header>
      <main>
        <form className={`theme${theme}`} onSubmit={onFormSubmit}>
          <label htmlFor="search-input" className={`theme${theme}`}>
            Fault Search
            <input
              name="search-input"
              onChange={onInputChange}
              placeholder="Enter a fault code, model or brand name"
            />
          </label>
        </form>

        <section className="search-results">
          {query && results.length ? (
            <p style={{ fontWeight: "bold" }}>
              {results.length === 1
                ? "Exact match found"
                : `${results.length} results found`}
            </p>
          ) : null}

          {query && results.length ? (
            results.map((result: FaultItem, i) => (
              <ul key={nanoid()} className="fault-cards">
                <li className="fault-cards__item">
                  <div className={`fault-cards__item--brand theme${theme}`}>
                    <span className="tag">
                      <i
                        className="fa-solid fa-shield"
                        role="img"
                        aria-label="Boiler Brand"
                      />
                      Brand
                    </span>
                    <h2 className={`theme${theme}`}>{result.brand}</h2>
                  </div>
                </li>
                <li className="fault-cards__item">
                  <div className={`fault-cards__item--code theme${theme}`}>
                    <span className="tag">
                      <i
                        className="fa-solid fa-triangle-exclamation"
                        role="img"
                        aria-label="Fault Code"
                      />
                      Fault Code
                    </span>
                    <p>{result.faultCode}</p>
                  </div>

                  {result.faultCause ? (
                    <div className={`fault-cards__item--cause theme${theme}`}>
                      <span className="tag">
                        <i
                          className="fa-solid fa-screwdriver-wrench"
                          role="img"
                          aria-label="Fault Cause"
                        />
                        Fault Cause
                      </span>

                      <p>{result.faultCause}</p>
                    </div>
                  ) : null}

                  {result.faultCheck ? (
                    <div className={`fault-cards__item--details theme${theme}`}>
                      <span className="tag">
                        <i
                          className="fa-solid fa-circle-info"
                          role="img"
                          aria-label="Fault Details"
                        />
                        Fault Details
                      </span>
                      <p>{result.faultCheck}</p>
                    </div>
                  ) : null}
                </li>
                <li className="fault-cards__item">
                  <div className={`fault-cards__item--model theme${theme}`}>
                    <span className="tag">
                      <i
                        className="fa-solid fa-layer-group"
                        role="img"
                        aria-label="Boiler Model"
                      />
                      Model(s)
                    </span>
                    <p>{result.model}</p>
                  </div>
                </li>
              </ul>
            ))
          ) : query && !results.length ? (
            <p style={{ justifySelf: "center" }}>No results</p>
          ) : null}
        </section>
      </main>

      <footer></footer>
    </div>
  );
};

export default App;