String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

function figure3() {
    var margin = ({
        top: 30,
        right: 30,
        bottom: 30,
        left: 60
    });
    
    var indicator_image_size = 75;
    var indicator_image_padding = 10;
    var indicator_box_top_padding = 25;
    
    var tooltip_image_size = 100;

    var chart_width = 650;
    var chart_height = 300;
    var chart_padding = 80;
    
    var width = chart_width;
    var height = chart_height + indicator_box_top_padding + indicator_image_padding + indicator_image_size + chart_padding;
    
    var base_image_name = '美國國債孳息曲線(10-2年)';
    var current_data = null;

    var bar_colors = {
        '美國國債孳息曲線(10-2年)': 'rgb(233, 205, 73)',
        'JPM環球高風險債利差': 'rgb(211, 86, 42)',
    }

    var indicator_data = [
        { x: 0, y: 0, id: '美國國債孳息曲線(10-2年)', opacity: 1.0},
        { x: indicator_image_size + indicator_image_padding, y: 0, id: 'JPM環球高風險債利差', opacity: 0.2 },
    ]
    var container = d3.select('#bond')
                        .append('svg')
                        .attr('width',  '100%')
                        .attr('height', '100%')
                        .style('min-width', `${(width + margin.left + margin.right ) / 2}px`)
                        .style('max-width', `${width + margin.left + margin.right}px`)
                        .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);
    
    var indicator_group = container
        .append('g')
        .attr('id', 'indicator_group')
        .attr('width', 4 * indicator_image_size + 3 * indicator_image_padding)
        .attr('height', indicator_image_size + indicator_image_padding)
        .attr('transform', `translate(${margin.left}, ${margin.top + chart_height + indicator_box_top_padding + chart_padding})`);
    indicator_group
        .append('text')
        .attr('x', indicator_group.attr('width') / 2)
        .attr('y', -indicator_box_top_padding / 2)
        .attr('text-anchor', 'middle')
        .style('font-weight', 700)
        .style('font-size', '18px')
        .text('選擇債卷名稱:')
            
    var chart_group = container
        .append('g')
        .attr('id', 'chart_group')
        .attr('width', chart_width)
        .attr('height', chart_height)
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    chart_group.append('text')
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chart_padding / 2 - 10)
        .attr("x", 0 - chart_height / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        
    chart_group.append("text")             
      .attr("transform", `translate(${(chart_width / 2)}, ${(chart_height + chart_padding / 2)})`)
      .style("text-anchor", "middle")

    chart_group.append("text")
      .attr('id', 'chart_title')
      .attr("transform", `translate(${(chart_width) / 2}, -10)`)
      .style("text-anchor", "middle")
      .style("font-weight", 700)
      .text("債卷名稱： " + base_image_name.replace(/_/g, ' ').capitalize());
    
    container.selectAll('text').style("font-family", "sans-serif");
    
    function draw_chart(data, should_init) {
        current_data = data;
        var x = d3.scaleTime()
            .range([0, chart_width])
            .domain(d3.extent(current_data, function(d) { return new Date(d.Date); }));

        var y = d3.scaleLinear()
        .range([chart_height, 0])
        .domain([d3.min(current_data, function(d) { return Math.min(+d['美國國債孳息曲線(10-2年)'], +d['JPM環球高風險債利差']); }),
          d3.max(current_data, function(d) { return Math.max(+d['美國國債孳息曲線(10-2年)'], +d['JPM環球高風險債利差']); })]);
            
        var line = d3.line()
            .x(function(d) { return x(new Date(d.Date)) }) // Use date for x-axis
            .y(function(d) { return y(+d[[base_image_name]])})
            .curve(d3.curveMonotoneX);
    
        
        if (should_init) {
            var xaxis = chart_group.append('g')
                .attr('class', 'axis axis--x')
                .attr('transform', `translate(0, ${chart_height})`)
                .attr('id', 'chart-x-axis')
                .call(d3.axisBottom(x).ticks(d3.timeMonth.every(1)).tickFormat(d3.timeFormat('%m/%Y')));
            
            var yaxis = chart_group.append('g')
                .attr('class', 'axis axis--y')
                .attr('id', 'chart-y-axis')
                .call(d3.axisLeft(y));
            
            chart_group.append('g')
                .attr('id', 'grid_markings_horz')    
                .selectAll('line.horizontalGrid').data(y.ticks()).enter()
                .append('line')
                .attr('class', 'horizontalGrid')
                .attr('x1', 0)
                .attr('x2', chart_width)
                .attr('y1', function(d) { return y(d) + 0.5; })
                .attr('y2', function(d) { return y(d) + 0.5; })
                .attr('shape-rendering', 'crispEdges')
                .attr('fill', 'none')
                .attr('stroke', 'gray')
                .attr('stroke-width', '1px')
                .attr('stroke-opacity', 0.3);

          chart_group.append('g')
              .attr('id', 'grid_markings_vert')    
              .selectAll('line.verticalGrid').data(x.ticks()).enter()
              .append('line')
              .attr('class', 'verticalGrid')
              .attr('x1', function(d) { return x(d) + 0.5; })
              .attr('x2', function(d) { return x(d) + 0.5; })
              .attr('y1', 0)
              .attr('y2', chart_height)
              .attr('shape-rendering', 'crispEdges')
              .attr('fill', 'none')
              .attr('stroke', 'gray')
              .attr('stroke-width', '1px')
              .attr('stroke-opacity', 0.3);
                
            var path = chart_group.append('path')
                .datum(current_data)
                .attr('id', 'line_mark')
                .attr('class', 'line')
                .attr('d', line)
                .attr('fill', 'none')
                .attr('stroke', bar_colors[[base_image_name]])
                .attr('stroke-width', 4);
            
            var w = tooltip_image_size - 10;
            var h = tooltip_image_size - 10;

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute");

chart_group.append("rect")
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .attr("width", chart_width)
    .attr("height", chart_height)
    .on("mouseover", function() { tooltip.style("opacity", 1); })
    .on("mouseout", function() { tooltip.style("opacity", 0); })
    .on("mousemove", mousemove);

var bisectDate = d3.bisector(function(d) { return new Date(d.Date); }).left;

function mousemove() {
        return;
  var x0 = x.invert(d3.mouse(this)[0]);
  var i = bisectDate(current_data, x0, 1);
  var d0 = current_data[i - 1];
  var d1 = current_data[i];

  if (d0 === undefined || d1 === undefined) {
      return;
  }

  var d = x0 - new Date(d0.Date) > new Date(d1.Date) - x0 ? d1 : d0;

  tooltip.html("Date: " + d3.timeFormat("%Y-%m-%d")(new Date(d.Date)) + "<br/>Price: " + d[base_image_name])
      .style("left", (d3.event.pageX + 10) + "px")
      .style("top", (d3.event.pageY - 28) + "px")
      .style("opacity", 1);
}


        }
        else {
            var transition_duration = 500;
            var mark_transition = d3
                .transition()
                .duration(transition_duration);
            chart_group.select('#line_mark')
                .datum(current_data)
                .transition(mark_transition)
                .attr('d', line)
                .attr('stroke', bar_colors[[base_image_name]])
            chart_group.select('#chart-x-axis')
                .transition(mark_transition)
                .call(d3.axisBottom(x).ticks(d3.timeMonth.every(1)).tickFormat(d3.timeFormat('%m/%Y')));
        }
    }
    
    function select_new_image(row, i) {
        if (base_image_name === row.id) {
            return;
        }
        
        var indicator_images = indicator_group.selectAll('image').data(indicator_data)
        indicator_images.attr('opacity', function(d) {
            if (row.id == d.id) {
                return 1.0;
            } else {
                return 0.2
            }
        })
        
        base_image_name = row.id;
        chart_group.select('#chart_title')
            .text("債卷名稱: " + base_image_name.replace(/_/g, ' ').capitalize());
        draw_chart(current_data, false);
    }
    
    var indicator_images = indicator_group.selectAll('image').data(indicator_data);
    indicator_images.enter()
        .append('image')
        .attr('width', indicator_image_size)
        .attr('height', indicator_image_size)
        .attr('xlink:href', function(d) {
            return 'images/jpm.webp';
        })
        .attr('id', function(d) { return d.id; })
        .attr('x', function(d) { return d.x; })
        .attr('y', function(d) { return d.y; })
        .attr('opacity', function(d) { return d.opacity; })
        .on('click', select_new_image);
    
    d3.csv('data/macroindicators.csv').then(function(data) { 
      data.forEach(function(d) {
          d.Date = d3.timeParse('%m/%d/%Y')(d.Date);
      });
      draw_chart(data, true) 
    });
}

figure3();
