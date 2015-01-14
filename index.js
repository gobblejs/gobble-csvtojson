module.exports = csvtojson;

function csvtojson ( csv, options ) {
	var data = csvToJson( csv );
	return JSON.stringify( data, null, options.space );
}

csvtojson.defaults = {
	accept: '.csv',
	ext: '.json'
};

function cleanCell ( header ) {
	header = header.trim();

	// dequote
	if ( header[0] === '"' || header[0] === "'" && header[0] === header[ header.length - 1 ] ) {
		header = header.slice( 1, -1 );
	}

	return header;
}

function csvToJson ( csv, delimiter, headerRow ) {
	var rows, row, records, record, i, len, j, numHeaders, key, datum, hasData;

	rows = csvToArray( csv, delimiter );

	// find the first non-empty row, and assume it contains headers
	if ( !headerRow ) {
		while ( row = rows.shift() ) {
			i = row.length;
			while ( i-- ) {
				if ( !!row[i] ) {
					headerRow = row;
					numHeaders = headerRow.length;
				}
			}

			if ( headerRow ) {
				break;
			}
		}
	}

	records = [];

	len = rows.length;
	for ( i = 0; i < len; i += 1 ) {
		row = rows[i];
		record = {};

		hasData = false;

		j = headerRow.length;
		while ( j-- ) {
			if ( key = headerRow[j] ) {
				datum = row[j];

				if ( !datum ) {
					continue;
				}

				record[ headerRow[j] ] = datum;
				hasData = true;
			}
		}

		if ( hasData ) {
			records[ records.length ] = record;
		}
	}

	return records;
}

function csvToArray ( csv, delimiter ) {
	var pattern, rows, row, matches, matchedValue, matchedDelimiter;

	delimiter = ( delimiter || ',' );

	// Create a regular expression to parse the CSV values.
	pattern = new RegExp(
		(
			// Delimiters.
			"(\\" + delimiter + "|\\r?\\n|\\r|^)" +

			// Quoted fields.
			"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

			// Standard fields.
			"([^\"\\" + delimiter + "\\r\\n]*))"
		),
		"gi"
	);


	// Create an array to hold our data. Give the array
	// a default empty first row.
	rows = [];
	rows[0] = row = [];

	// Create an array to hold our individual pattern
	// matching groups.
	matches = null;

	// Keep looping over the regular expression matches
	// until we can no longer find a match.
	while ( matches = pattern.exec( csv ) ) {

		// Get the delimiter that was found.
		matchedDelimiter = matches[ 1 ];

		// Check to see if the given delimiter has a length
		// (is not the start of string) and if it matches
		// field delimiter. If id does not, then we know
		// that this delimiter is a row delimiter.
		if ( matchedDelimiter.length && ( matchedDelimiter !== delimiter ) ) {

			// Since we have reached a new row of data,
			// add an empty row to our data array.
			rows.push( row = [] );
		}


		// Now that we have our delimiter out of the way,
		// let's check to see which kind of value we
		// captured (quoted or unquoted).
		if (matches[ 2 ]) {

			// We found a quoted value. When we capture
			// this value, unescape any double quotes.
			matchedValue = matches[ 2 ].replace( /\"\"/g, '"' );
		}

		else {
			// We found a non-quoted value.
			matchedValue = matches[ 3 ];
		}

		// Now that we have our value string, let's add
		// it to the data array.
		row.push( matchedValue );
	}

	// Return the parsed data.
	return rows;
}