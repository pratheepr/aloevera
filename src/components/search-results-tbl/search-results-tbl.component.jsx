import React, { useState , useEffect } from "react";
import ReactDataGrid from "react-data-grid";
import { Toolbar, Data } from "react-data-grid-addons";

import './search-results-tbl.styles.css';
import WrapperFormatter from './WrapperFormatter';

import { TiInfoLarge } from "react-icons/ti";

const defaultColumnProperties = {
  filterable: true ,
  formatter : WrapperFormatter
};

const selectors = Data.Selectors;

const columns = [
  {
    key: "id",
    name: "id",
    resizable: true,
    width: 50
  },
  {
    key: "sqlarea",
    name: "sqlarea",
    width: 120
  },
  {
    key: "sqlowner",
    name: "sqlowner",
    width: 140
  },
  {
    key: "sqlname",
    name: "sqlname",
    width: 150
  },
  {
    key: "sqlcomments",
    name: "sqlcomments",
    width: 220
  },
  {
    key: "sqlscript",
    name: "sqlscript",
    width: 540
  }
].map(c => ({ ...c, ...defaultColumnProperties }));

const sqlscriptActions = (row) => [
    {
      icon: <TiInfoLarge />,
      callback: () => {
        alert( row.sqlscript );
      }
    }
  ]

function getCellActions(column, row) {
    const cellActions = {
      sqlscript: sqlscriptActions (row)
    };
    return cellActions[column.key] ;
  }

const handleFilterChange = filter => filters => {
  const newFilters = { ...filters };
  if (filter.filterTerm) {
    newFilters[filter.column.key] = filter;
  } else {
    delete newFilters[filter.column.key];
  }
  return newFilters;
};

function getRows(rows, filters) {
  return selectors.getRows({ rows, filters });
}


//var rows_use_effect; 

function SearchResultsTbl  ( dbsqls )  {

  console.log('****INSIDE MAIN HOOK FUNTION ')
  console.log(dbsqls);

  const [dataRows, setDataRows] = useState([]); 

  console.log( dataRows) ;

  if( dbsqls.rows !== dataRows ) {
    setDataRows(dbsqls.rows); 
  }
  //setDataRows(dbsqls.rows);

  useEffect(() => {
      console.log ('INSIDE search results component *****');
      console.log( dbsqls );
      console.log ('COMPLETED search results component *****');
      //setDataRows(dbsqls.rows);
      // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const rows  = dataRows ; //rows_use_effect; // dbsqls; // 
  const [filters, setFilters] = useState({}); 
  const filteredRows = getRows(rows, filters);

  return (
    <ReactDataGrid
      columns={columns}
      rowGetter={i => filteredRows[i]}
      rowsCount={filteredRows.length}
      minHeight={500}
      rowHeight={60}
      toolbar={<Toolbar enableFilter={true} />}
      onAddFilter={filter => setFilters(handleFilterChange(filter))}
      onClearFilters={() => setFilters({})}
      getCellActions={getCellActions}
    />
  );
};

//const rootElement = document.getElementById("root");
//ReactDOM.render(<Example rows={createRowData(50)} />, rootElement);
export default SearchResultsTbl;