module.exports = csvtojson;

function csvtojson ( csv, options ) {
	var rows, headers, records;

	rows = csv.split( '\n' );
	headers = rows.shift().split( ',' ).map( cleanCell );

	records = rows.map( function ( row ) {
		var cells,
			record;

		cells = row.split( ',' ).map( cleanCell );
		record = {};

		cells.forEach( function ( data, i ) {
			if ( !options.parseValues ) {
				try {
					data = JSON.parse( data );
				} catch ( e ) {
					// treat as string
				}
			}

			if ( options.includeNullValues || ( data !== null && data !== '' ) ) {
				record[ headers[i] ] = data;
			}
		});

		return record;
	});

	return JSON.stringify( records, null, options.space );
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
