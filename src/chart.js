function draw_chart(data, labels, containerId, selectId) {
  var equities = ["深證成指", "滬深300", "恆生指數", "美國標普500", "美國納指", "上證綜指", "國企指數", "歐洲斯托克50", "恆生科技指數"];
  commodities = ["BTC 指數", "布蘭特原油", "金", "銅", "天然氣"];

  d.StrDate = d3.timeParse("%m/%d/%Y")(d.Date);
  
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

    line_chart.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickSizeOuter(0));
    )

    .selectAll("text")  
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");
    .selectAll("text")  
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");

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

    function monthToChinese(month) {
      const chineseMonths = {
        "January": "一月",
        "February": "二月",
        "March": "三月",
        "April": "四月",
        "May": "五月",
        "June": "六月",
        "July": "七月",
        "August": "八月",
        "September": "九月",
        "October": "十月",
        "November": "十一月",
        "December": "十二月"
      };
      return chineseMonths[month];
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
        .call(d3.axisBottom(x).tickSizeOuter(0));

      line_chart.select(".axis--y")
        .transition().duration(500) // Add transition for smooth axis update
        .call(d3.axisLeft(y).tickSizeOuter(0).tickFormat(d3.format(".2f"))); // Add tickFormat here

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
  d.StrDate = d3.timeParse("%m/%d/%Y")(d.Date);

  equities.forEach(function(equity) {
    d[equity] = parseFloat(d[equity].replace('%', '')) / 100.0;
    console.log(d[equity]);
  });

  return d;
}).then(function(data) {
    draw_chart(data, equities, "#chart", "#selectBoxContainer");
  }).catch(function(error) {
    console.error("Error loading the data:", error);
  });

var commodities = ["BTC 指數", "布蘭特原油", "金", "銅", "天然氣)"];

d3.csv("data/pcommodities.csv", function(d) {
  d.StrDate = d3.timeParse("%m/%d/%Y")(d.Date);

  commodities.forEach(function(commodity) {
    d[commodity] = parseFloat(d[commodity].replace('%', '')) / 100.0;
    console.log(d[commodity]);
  });

  return d;
}).then(function(data) {
    draw_chart(data, commodities, "#chart2", "#selectBoxContainer2");
  }).catch(function(error) {
    console.error("Error loading the data:", error);
});
