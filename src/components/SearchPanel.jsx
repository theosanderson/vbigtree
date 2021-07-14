import React from "react";
import SearchItem from "./SearchItem";
import { FaSearch } from "react-icons/fa";
import { RiAddCircleLine } from "react-icons/ri";
import { BiPalette } from "react-icons/bi";
import { BsInfoCircle } from "react-icons/bs";
import { DebounceInput } from "react-debounce-input";

function numberWithCommas(x) {
  const internationalNumberFormat = new Intl.NumberFormat("en-US");
  return internationalNumberFormat.format(x);
}

function SearchPanel({
  searchItems,
  setSearchItems,
  colourBy,
  setColourBy,
  selectedNode,
  data,
  searchColors,
  numSearchResults,
  totalSeqs,
  setZoomToSearch,
}) {
  const node_data = data.node_data;
  return (
    <div>
      <div className=" border-t md:border-t-0 border-b border-gray-300">
        <div className="mt-3 mb-3 text-gray-500 text-sm">
          Displaying {numberWithCommas(totalSeqs)} sequences from INSDC, COG-UK
          and CNCB
        </div>
        <h2 className="text-xl mt-5 mb-4 text-gray-700">
          <FaSearch className="inline-block mr-2" />
          Search
        </h2>
        {searchItems.map(function (item, index) {
          return (
            <SearchItem
              numResultsHere={numSearchResults[index]}
              searchColors={searchColors}
              index={index}
              key={item.id}
              id={item.id}
              category={item.category}
              value={item.value}
              setThis={(mapping) => {
                searchItems[index] = { ...searchItems[index], ...mapping };
                setSearchItems([...searchItems]);
              }}
              zoomToMe={() => {
                console.log(index);
                setZoomToSearch({ index });
              }}
              removeItem={(id) => {
                // console.log("remove", id);
                setSearchItems(searchItems.filter((x) => x.id !== id));
              }}
              enabled={item.enabled}
            ></SearchItem>
          );
        })}

        <button
          className="block bg-gray-100 text-sm mx-auto p-1 rounded border-gray-300 border m-5 text-gray-700"
          onClick={() =>
            setSearchItems([
              ...searchItems,
              {
                id: Math.random(),
                category: "name",
                value: "",
                enabled: true,
              },
            ])
          }
        >
          <RiAddCircleLine className="inline-block mr-2" />
          Add a new search
        </button>
      </div>
      <div className="border-b border-gray-300 pb-3">
        <h2 className="text-xl mt-5 mb-4 text-gray-700">
          <BiPalette className="inline-block mr-2" />
          Colour by
        </h2>

        <select
          className="border py-2 px-3 text-grey-darkest"
          value={colourBy.variable}
          onChange={(event) =>
            setColourBy({ ...colourBy, variable: event.target.value })
          }
        >
          <option value="lineage">Lineage</option>
          <option value="country">Country</option>
          <option value="aa">Amino acid at site</option>
          <option value="none">None</option>
        </select>
        {colourBy.variable === "aa" && (
          <div>
            {" "}
            Gene
            <select
              className="border py-2 px-3 text-grey-darkest"
              value={colourBy.gene}
              onChange={(event) =>
                setColourBy({ ...colourBy, gene: event.target.value })
              }
            >
              {Array.from(data.all_genes).map((x) => (
                <option value={x}>{x}</option>
              ))}
            </select>
            <div>
              Residue{" "}
              <DebounceInput
                type="number"
                value={colourBy.residue}
                onChange={(event) =>
                  setColourBy({ ...colourBy, residue: event.target.value })
                }
                className="border py-2 px-3 text-grey-darkest"
              />
            </div>
          </div>
        )}
      </div>

      <div>
        {selectedNode && (
          <div className="text-gray-500 mr-3">
            <h2 className="text-xl mt-5 mb-4 text-gray-700">
              <BsInfoCircle className="inline-block mr-2" />
              Node info
            </h2>

            <div className="font-bold">{node_data.names[selectedNode]}</div>
            {node_data.genbanks[selectedNode] &&
              node_data.genbanks[selectedNode] !== "unknown" &&
              node_data.genbanks[selectedNode] !== "nan" && (
                <div>
                  <span className="font-semibold">Genbank:</span>{" "}
                  <a
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                    href={
                      "https://www.ncbi.nlm.nih.gov/nuccore/" +
                      node_data.genbanks[selectedNode]
                    }
                  >
                    {node_data.genbanks[selectedNode]}
                  </a>
                </div>
              )}
            <div>
              <span className="font-semibold">Date:</span>{" "}
              {data.date_mapping[node_data.dates[selectedNode]]}
            </div>
            <div>
              <span className="font-semibold">Lineage:</span>{" "}
              <a
                className="underline"
                target="_blank"
                rel="noreferrer"
                href={
                  "https://outbreak.info/situation-reports?pango=" +
                  data.lineage_mapping[node_data.lineages[selectedNode]]
                }
              >
                {data.lineage_mapping[node_data.lineages[selectedNode]]}
              </a>
            </div>
            <div>
              <span className="font-semibold">Country:</span>{" "}
              {data.country_mapping[node_data.countries[selectedNode]]}
            </div>
            <span className="font-semibold">Mutations:</span>
            <div className="text-xs mr-5">
              {
                node_data.mutations[selectedNode].mutation &&
                  node_data.mutations[selectedNode].mutation
                    .map((y) => {
                      const x = data.mutation_mapping[y];

                      return (
                        x.gene + ":" + x.orig_res + x.position + x.final_res
                      );
                    })
                    .join(", ") //TODO assign the top thing to a constant and use it again
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPanel;
