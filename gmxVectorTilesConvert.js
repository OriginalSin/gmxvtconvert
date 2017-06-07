var fs = require('fs');

 
var attr = ["mmsi", "imo", "vessel_name", "vessel_type", "callsign", "vessel_type_code", "vessel_type_cargo", "length", "width", "flag_country", "flag_code", "destination", "eta", "draught", "longitude", "latitude", "sog", "cog", "rot", "heading", "nav_status", "nav_status_code", "ts_pos_utc", "ts_static_utc", "ts_eta"];
var types = ["integer", "integer", "string", "string", "string", "integer", "string", "integer", "integer", "string", "integer", "string", "string", "float", "float", "float", "float", "float", "float", "integer", "string", "integer", "datetime", "datetime", "datetime"];
var layerProps = {};
if (fs.existsSync('to/layerProps.json')) {
	var txt = fs.readFileSync('to/layerProps.json', 'utf8');
	layerProps = JSON.parse(txt);
} else {
	attr.forEach(function(it) {
		layerProps[it] = [];
	});
}

var _getLinkProp = function(nm, val) {
	var name = attr[nm - 1],
		arr = layerProps[name],
		len = arr.length,
		i = 0;

	for (; i < len; i++) {
		if (val === arr[i]) { return i; }
	}
	arr[i] = val;
	return i;
};


var files = [
	// '4_4_2_709718_1_13670.gmxt',
	'5_11_7_709732_1_13670.gmxt'
];
var txt = fs.readFileSync('from/' + files[0], 'utf8');
txt = txt.replace(/gmxAPI._vectorTileReceiver\(/, '');
txt = txt.replace(/\)$/, '');
var json = JSON.parse(txt);

var arr = [];
var points = [];
json.values.forEach(function(it) {
	var len = it.length - 1,
		props = new Array(len),
		i;

	props[0] = it[0];
	for (i = 1; i < len; i++) {
		if (it[i] === null) { it[i] = ''; }
		props[i] = _getLinkProp(i, it[i]);
	}
	arr.push(props);
	var geo = it[len];
	points.push(0);		// при 0 - далее следует x, y точки
	points.push(Math.round(100 * geo.coordinates[0]));
	points.push(Math.round(100 * geo.coordinates[1]));
})
delete json.values;
json.properties = arr;
json.points = points;
// fs.writeFileSync('to/' + files[0], JSON.stringify(json, null, 2));
fs.writeFileSync('to/' + files[0], JSON.stringify(json));
fs.writeFileSync('to/layerProps.json', JSON.stringify(layerProps, null, 2));

