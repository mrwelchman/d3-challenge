// chart parameters
var svpWidth = 960;
var svpHeight = 500;
var margin = {top:10, right:30, bottom:50, left:50};

var width = svpWidth-margin.left-margin.right;
var height = svpHeight-margin.top-margin.bottom;
// append svg object to body
var svg = d3.select('#scatter')
	.append('svg')
	.style('background-color', 'heather')
	.style('opacity', 0.9)
	.attr('width', svpWidth)
	.attr('height', svpHeight)
	.append('g')
	.attr('transform', 'translate('+margin.left+','+margin.top+')');
// read data
d3.csv('assets/data/data.csv').then(function (data) {
	console.log(data);
	data.forEach(function (data) {
		data['poverty'] = +data['poverty'];
		data['healthcare'] = +data['healthcare'];
		data['age'] = +data['age'];
		data['income'] = +data['income'];
		data['obesity'] = +data['obesity'];
		data['smokes'] = +data['smokes'];
	});
	// x-axis
	var x = d3.scaleLinear()
		.domain([d3.min(data, d=>d['poverty'])-1, d3.max(data, d=>d['poverty'])+1])
		.range([0, width]);
	svg.append('g')
		.attr('transform', 'translate(0,'+height+')')
		.call(d3.axisBottom(x));
	// y-axis
	var y = d3.scaleLinear()
		.domain([d3.min(data, d=>d['healthcare'])-1, d3.max(data, d=>d['healthcare'])+1])
		.range([height,0]);
	svg.append('g')
		.call(d3.axisLeft(y));
	// x-axis label
	svg.append('text')
		.attr('text-anchor', 'end')
		.attr('x', (width+margin.left+margin.right)/2)
		.attr('y', height+margin.top+25)
		.text('Poverty Rate(%)')
		.style('fill', 'black');
	// y-axis label
	svg.append('text')
		.attr('text-anchor', 'middle')
		.attr('transform', 'rotate(-90)')
		.attr('y', -margin.left+20)
		.attr('x', -(height+margin.top+margin.bottom)/2)
		.text('Population Without Healthcare (%)')
		.style('fill', 'black');
	// tooltip variable
	var tooltip = d3.select('#scatter')
		.append('div')
		.style('opacity', 0)
		.attr('class', 'tooltip')
		.style('background-color', 'white')
		.style('border', 'solid')
		.style('border-width', '1px')
		.style('border-radius', '5px')
		.style('padding', '10px')
	// ntooltip hover
	var mouseover = function (d) {
		tooltip
			.style('opacity', 1)
	}
	var mousemove = function (d) {
		tooltip
			.html(d['state'] + '<br>' + 'No Healthcare: ' + d['healthcare'] + '%' + '<br>' + 'Poverty Rate: ' + d['poverty'] + '%')
			.style('left', (d3.mouse(this)[0]+90)+'px')
			.style('top', (d3.mouse(this)[1])+'px')
	}
	var mouseleave = function (d) {
		tooltip
			.transition()
			.duration(200)
			.style('opacity', 0)
	}
	// scatter bubbles
	svg.append('g')
		.selectAll('dot')
		.data(data)
		.enter()
		.append('circle')
		.attr('cx', function (d) {return x(d['poverty']);})
		.attr('cy', function (d) {return y(d['healthcare']);})
		.attr('r', 12)
		.style('fill', 'violet')
		.style('opacity', 0.75)
		.style('stroke', 'white')
		.style('stroke-width', 1)
		.on('mouseover', mouseover)
		.on('mousemove', mousemove)
		.on('mouseleave', mouseleave);
	// state abbreviations
	svg.append('g')
		.selectAll('text')
		.data(data)
		.enter()
		.append('text')
		.text(d=>d['abbr'])
		.attr('x', (d)=>x(d['poverty']))
		.attr('y', (d)=>y(d['healthcare']))
		.attr('font-size', '10px')
		.style('font', 'bold Verdana, Helvetica, Arial, sans-serif')
		.attr('text-anchor', 'middle')
		.style('opacity', 0.85)
		.style('fill', 'white')	
});
