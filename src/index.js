import ExampleTable from './components/example-table.svelte';
import './styles.css'

const exampleTable = new ExampleTable({
  target: document.getElementById('example-table'),
});

function monthToChinese(month) {
  const chineseMonths = {
    "January": "1月",
    "February": "2月",
    "March": "3月",
    "April": "4月",
    "May": "5月",
    "June": "6月",
    "July": "7月",
    "August": "8月",
    "September": "9月",
    "October": "10月",
    "November": "11月",
    "December": "12月"
  };
  return chineseMonths[month] || month;
}

function draw_chart(data, labels, containerId, selectId) {
    var equities = ["深證成指", "滬深300", "恆生指數", "美國標普500", "美國納指", "上證綜指", "國企指數", "歐洲斯托克50", "恆生科技指數"];
    var commodities = ["BTC 指數", "WTI 原油", "Brent 布蘭特原油", "金(每百oz)", "銅(每磅)", "天然氣 (MMBtu)"];
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right;

    var sliderWidth = width;
    var sliderHeight = 50;
    var sliderPadding = 10;

    var colors = d3.schemeCategory10;

    var height = 500 - margin.top - margin.bottom - sliderHeight - sliderPadding;

    var container = d3.select(containerId)
        .append('svg')
        .attr('width', '100%')
        .attr('height', height + margin.top + margin.bottom + sliderHeight + sliderPadding)
        .style('min-width', `${(width + margin.left + margin.right) / 2}px`)
        .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom + sliderHeight + sliderPadding}`);

    var line_chart = container
      .append('g')
      .attr('id', 'line_chart')
      .attr('width', width)
      .attr('height', height)
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    var x = d3.scaleTime()
    .range([0, width])
    .domain(d3.extent(data, function(d) { return d.StrDate; }));

    var y = d3.scaleLinear()
    .range([height, 0])
    .domain([
      d3.min(data, function(d) {
        return Math.min(...labels.map(label => d[label])) * 0.99;
      }),
      d3.max(data, function(d) {
        return Math.max(...labels.map(label => d[label])) * 1.2;
      })
    ]);

    var line = d3.line()
    .x(function(d) { return x(d.StrDate); })
    .y(function(d) { return y(d.percentage); });

    var numXTicks = 20; // Adjust this value to change the number of x-axis labels

    line_chart.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(
        d3.axisBottom(x)
          .ticks(numXTicks)
          .tickFormat(d => {
            // Update tickFormat to display the month in Chinese
            const date = new Date(d);
            const month = date.toLocaleString('en-us', { month: 'long' });
            return `${monthToChinese(month)} ${date.getFullYear()}`;
          })
      );

    line_chart.append("g")
      .attr("class", "axis axis--y")
      .call(
        d3.axisLeft(y)
          .tickFormat(d3.format(".0%")) // Update tickFormat to display the value in percent
      );

    labels.forEach(function(equity, index) {
      var equityData = data.map(function(d) {
        return {
          StrDate: d.StrDate,
          percentage: d[equity]
        };
      });

      line_chart.append("path")
        .datum(equityData)
        .attr("fill", "none")
        .attr("stroke", colors[index % colors.length])
        .attr("stroke-width", 2)
        .attr("d", line)
        .attr("id", "line_" + index);
    });

    // Slider

    var sliderScale = d3.scaleTime()
      .domain(x.domain())
      .range([0, sliderWidth])
      .clamp(true);

    var sliderExtraPadding = 20; // Add this variable

    var slider = container.append("g")
        .attr("class", "slider")
        .attr("transform", "translate(" + margin.left + "," + (height + margin.top + sliderPadding + sliderHeight + sliderExtraPadding) + ")");

    slider.append("line")
      .attr("class", "track")
      .attr("x1", sliderScale.range()[0])
      .attr("x2", sliderScale.range()[1])
      .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
      .attr("class", "track-inset")
      .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
      .attr("class", "track-overlay")
      .call(d3.drag()
        .on("start.interrupt", function() { slider.interrupt(); })
        .on("start drag", function() {
          updateChart(sliderScale.invert(d3.event.x), labels);
        }));

    d3.select("#chart > svg > g.slider")
      .insert("rect", "line.track") // Insert the rect element before the track element
      .classed("track-background", true) // Add the "track-background" class to the rect element
      .attr("x", 0)
      .attr("y", -10)
      .attr("width", 890)
      .attr("height", 20)
      .attr("rx", 10)
      .attr("ry", 10);

    var handle = slider.append("rect")
      .attr("class", "handle")
      .attr("width", 20)
      .attr("height", 20)
      .attr("rx", 3)
      .attr("ry", 3)
      .attr("y", -10);

    function getMinValue(d) {
      let min = Infinity;
      for (const key in d) {
        if (typeof d[key] === 'number' && d[key] < min) {
          min = d[key];
        }
      }
      return min;
    }

    function getMaxValue(d) {
      let max = -Infinity;
      for (const key in d) {
        if (typeof d[key] === 'number' && d[key] > max) {
          max = d[key];
        }
      }
      return max;
    }

    function updateChart(newDate, labels) {
      var filteredData = data.filter(function(d) { return d.StrDate >= newDate; });

      var newYMin = d3.min(filteredData, function(d) {
        return Math.min(...labels.map(label => d[label]));
      });
      var newYMax = d3.max(filteredData, function(d) {
        return Math.max(...labels.map(label => d[label]));
      });

      y.domain([newYMin * 0.99, newYMax * 1.01]);

      x.domain([newDate, d3.max(filteredData, function(d) { return d.StrDate; })]); // Update the x-axis domain using the filtered data

      line_chart.select(".axis--x")
        .transition().duration(500) // Add transition for smooth axis update
        .call(
          d3.axisBottom(x)
            .ticks(numXTicks)
            .tickFormat(d => {
              // Update tickFormat to display the month in Chinese
              const date = new Date(d);
              const month = date.toLocaleString('en-us', { month: 'long' });
              return `${monthToChinese(month)}`;
            })
        );

      line_chart.select(".axis--y")
        .transition().duration(500) // Add transition for smooth axis update
        .call(
          d3.axisLeft(y)
            .tickFormat(d3.format(".0%")) // Update tickFormat to display the value in percent
        );

      labels.forEach(function(equity, index) {
        var equityData = filteredData.map(function(d) { // Use the filteredData here
            return {
                StrDate: d.StrDate,
                percentage: d[equity]
            };
        });

        // Update the line function to use the new x and y scales
        var updatedLine = d3.line()
        .x(function(d) { return x(d.StrDate); })
        .y(function(d) { return y(d.percentage); });

        line_chart.select("#line_" + index)
          .datum(equityData)
          .attr("d", updatedLine); // Use the updated line function here
      });

      handle.attr("x", sliderScale(newDate) - 10);
    }

    // Add chartId parameter to the toggleEquity function
    function toggleEquity(chartId, index) {
      var line = d3.select(chartId + ' #line_' + index);
      // Match the new select box IDs based on the chartId
      var selectBox = d3.select('#selectBox_' + chartId.replace('#', '') + '_' + index).node();
      line.style('display', selectBox.checked ? 'block' : 'none');
    }

    // Add chartId parameter to the createSelectBoxAndLegend function
    function createSelectBoxAndLegend(chartId, selectId) {
      var container = d3.select(selectId);

      labels.forEach(function (equity, index) {
        var equityContainer = container.append('div').attr('class', 'equity-container');

        // Generate a unique ID for each select box based on the chartId
        var selectBoxId = 'selectBox_' + chartId.replace('#', '') + '_' + index;

        var selectBox = equityContainer.append('input')
          .attr('type', 'checkbox')
          .attr('id', selectBoxId)
          .attr('checked', true)
          .on('change', function () {
            toggleEquity(chartId, index); // Pass the chartId to the toggleEquity function
          });

        var label = equityContainer.append('label')
          .attr('for', 'selectBox_' + index)
          .style('color', colors[index % colors.length])
          .text(equity);
      });
    }

    createSelectBoxAndLegend(containerId, selectId);
  }


var equities = ["深證成指", "滬深300", "恆生指數", "美國標普500", "美國納指", "上證綜指", "國企指數", "歐洲斯托克50", "恆生科技指數"];

 d3.csv("data/pequity.csv", function(d) {
    d.Date = +d.Date;
    d.StrDate = d3.timeParse("%m/%d/%Y")(d.StrDate);
    d.深證成指 = +d.深證成指;
    d.滬深300 = +d.滬深300;
    d.恆生指數 = +d.恆生指數;
    d.美國標普500 = +d.美國標普500;
    d.美國納指 = +d.美國納指;
    d.上證綜指 = +d.上證綜指;
    d.國企指數 = +d.國企指數;
    d.歐洲斯托克50 = +d.歐洲斯托克50;
    d.恆生科技指數 = +d.恆生科技指數;
    return d;
  }).then(function(data) {
    draw_chart(data, equities, "#chart", "#selectBoxContainer");
  }).catch(function(error) {
    console.error("Error loading the data:", error);
  });

var commodities = ["BTC 指數", "WTI 原油", "Brent 布蘭特原油", "金(每百oz)", "銅(每磅)", "天然氣 (MMBtu)"];

 d3.csv("data/pcommodities.csv", function(d) {
    d.Date = +d.Date;
    d.StrDate = d3.timeParse("%m/%d/%Y")(d.StrDate);
    d["BTC 指數"] = +d["BTC 指數"];
    d["WTI 原油"] = +d["WTI 原油"];
    d["Brent 布蘭特原油"] = +d["Brent 布蘭特原油"];
    d["金(每百oz)"] = +d["金(每百oz)"];
    d["銅(每磅)"] = +d["銅(每磅)"];
    d["天然氣 (MMBtu)"] = +d["天然氣 (MMBtu)"];
    return d;
  }).then(function(data) {
    draw_chart(data, commodities, "#chart2", "#selectBoxContainer2");
  }).catch(function(error) {
    console.error("Error loading the data:", error);
  });

String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

function figure3(csvFileName, targetDivId, headers, colors, base_image_name, dirname) {
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
    
   // var base_image_name = '美國國債孳息曲線(10-2年)';
    var current_data = null;

  /*
    var bar_colors = {
        '美國國債孳息曲線(10-2年)': 'rgb(233, 205, 73)',
        'JPM環球高風險債利差': 'rgb(211, 86, 42)',
    }
  */

    var bar_colors = colors;

    var indicator_data = headers.map(function (header, index) {
        return {
            x: index * (indicator_image_size + indicator_image_padding),
            y: 0,
            id: header,
            idx: index,
            opacity: index === 0 ? 1.0 : 0.2
        };
    });

    var container = d3.select(targetDivId)
                        .append('svg')
                        .attr('width',  '100%')
                        .attr('height', '100%')
                        .style('min-width', `${(width + margin.left + margin.right ) / 2}px`)
                        .style('max-width', `${width + margin.left + margin.right}px`)
                        .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);
    
  console.log("container", container);
    var indicator_group = container
        .append('g')
        .attr('id', 'indicator_group')
        .attr('width', 4 * indicator_image_size + 3 * indicator_image_padding)
        .attr('height', indicator_image_size + indicator_image_padding)
        .attr('transform', `translate(${margin.left}, ${margin.top + chart_height + indicator_box_top_padding + chart_padding})`);

    indicator_group
        .append('text')
        .attr('x', (4 * indicator_image_size + 3 * indicator_image_padding) / 2)
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
      .text("債卷名稱： " + headers[0].replace(/_/g, ' ').capitalize());
    
    container.selectAll('text').style("font-family", "sans-serif");
    
    function draw_chart(data, should_init) {
        current_data = data;
        var x = d3.scaleTime()
            .range([0, chart_width])
            .domain(d3.extent(current_data, function(d) { return new Date(d.Date); }));
        if (targetDivId == "#bond") {
          // based on only the current data
          var yMin = d3.min(current_data, function(d) {
              return +d[[base_image_name]];
          });

          var yMax = d3.max(current_data, function(d) {
              return +d[[base_image_name]];
          });
        } else {
          // Calculate the domain for the y scale dynamically based on headers
          var yMin = d3.min(current_data, function(d) {
              return Math.min.apply(null, headers.map(function(header) {
                  return +d[header];
              }));
          });

          var yMax = d3.max(current_data, function(d) {
              return Math.max.apply(null, headers.map(function(header) {
                  return +d[header];
              }));
          });
        }

        yMin = yMin * 0.95;
        yMax = yMax * 1.05;

        var y = d3.scaleLinear()
        .range([chart_height, 0])
        .domain([yMin, yMax]);
            
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
            
            if (targetDivId == "#bond2") {
              var yaxis = chart_group.append('g')
                  .attr('class', 'axis axis--y')
                  .attr('id', 'chart-y-axis')
                  .call(d3.axisLeft(y).tickFormat(function(d) { return d + '%'; }));
            } else {
              var yaxis = chart_group.append('g')
                  .attr('class', 'axis axis--y')
                  .attr('id', 'chart-y-axis')
                  .call(d3.axisLeft(y));
            }
            
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
        var new_chart_title = "#chart_title"; // Change this line
        chart_group.select(new_chart_title)
            .text("債卷名稱: " + base_image_name.replace(/_/g, ' ').capitalize());
        draw_chart(current_data, false);
    }
    
    var indicator_images = indicator_group.selectAll('image').data(indicator_data);
    indicator_images.enter()
        .append('image')
        .attr('width', indicator_image_size)
        .attr('height', indicator_image_size)
        .attr('xlink:href', function(d) {
            return 'images/' + dirname + '/' + d.idx + '.png';
        })
        .attr('id', function(d) { return d.id; })
        .attr('x', function(d) { return d.x; })
        .attr('y', function(d) { return d.y; })
        .attr('opacity', function(d) { return d.opacity; })
        .on('click', select_new_image);
    
    d3.csv(csvFileName).then(function(data) { 
      data.forEach(function(d) {
          d.Date = d3.timeParse('%m/%d/%Y')(d.Date);
      });
      draw_chart(data, true) 
    });
}


// Header arrays for both CSV files
const header1 = ["美國國債孳息曲線(10-2年)", "JPM環球高風險債利差"];
const header2 = ["美國國債孳息-2年", "美國國債孳息-5年", "美國國債孳息-10年", "美國國債孳息-30年", "中國國債孳息-2年", "中國國債孳息-5年", "中國國債孳息-10年", "中國國債孳息-30年"];

// Bar color objects for both CSV files
const color1 = {
  "美國國債孳息曲線(10-2年)": "rgb(233, 205, 73)",
  "JPM環球高風險債利差": "rgb(211, 86, 42)",
};

const color2 = {
  "美國國債孳息-2年": "rgb(233, 205, 73)",
  "美國國債孳息-5年": "rgb(211, 86, 42)",
  "美國國債孳息-10年": "rgb(76, 173, 80)",
  "美國國債孳息-30年": "rgb(50, 137, 197)",
  "中國國債孳息-2年": "rgb(177, 110, 235)",
  "中國國債孳息-5年": "rgb(240, 128, 128)",
  "中國國債孳息-10年": "rgb(102, 205, 170)",
  "中國國債孳息-30年": "rgb(218, 165, 32)",
};


var base_image_name1 = '美國國債孳息曲線(10-2年)';
var base_image_name2 = '美國國債孳息-2年';

figure3("data/macroindicators.csv", "#bond", header1, color1, base_image_name1, "bond1");
figure3("data/bonds.csv", "#bond2", header2, color2, base_image_name2, "bond2");
