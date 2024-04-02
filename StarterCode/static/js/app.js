// Store URL with data
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"

// Read the JSON file from the URL
d3.json(url).then(function(data) {
    console.log(data);
});

// Initializes the page with a default plot 
function init() {
    d3.json(url).then((data) => {

        // Dropdown Menu
        let dropdownMenu = d3.select("#selDataset");

        // Variable for sample names
        let names = data.names;

        // Add samples to dropdown menu
        names.forEach((name) => {
            dropdownMenu.append("option").text(name).property("value", name);

        });

        // Set the first sample of the list
        let samplechart = names[0];

        // Get value of the samples
        console.log(samplechart)

        // Plots 
        demographics(samplechart);
        barchart(samplechart);
        bubblechart(samplechart);
        gaugechart(samplechart);
    });
};

// Metadata for demographics
function demographics(selectedValue) {

    // D3 to retrieve all the data
    d3.json(url).then((data) => {

        // Retrieve all metadata
        let metadata = data.metadata;

        // Call the custom function with filter()
        let filteredData = metadata.filter((meta) => meta.id == selectedValue);

        // Log the data to console
        console.log(filteredData)

        // First index of the array
        let obj = filteredData[0];

        // Clear metadata content to make it ready for user input
        d3.select("#sample-metadata").html("");

        // Call Object.enteries() 
        Object.entries(obj).forEach(([key,value]) => {

            // Log data to console
            console.log(key,value);

            // Key/Value pair to append 
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

}

// Bar chart 
function barchart (selectedValue) {

    // D3 to retrieve all the data
    d3.json(url).then((data) => {

        // Retrieve all samples data
        let samples = data.samples;

        // Call the custom function with filter()
        let filteredData = samples.filter((sample) => sample.id === selectedValue);

        // First index of the array
        let obj = filteredData[0];

        // Use otu_ids for the x values, sample_values for the y values, and otu_labels for text values
        let otu_ids = obj.otu_ids;
        let otu_labels = obj.otu_labels;
        let sample_values = obj.sample_values;

        // Log data to console
        console.log(otu_ids,otu_labels,sample_values);

        // Trace for bar chart
        let trace = [{
             x: sample_values.slice(0,10).reverse(),
             y: otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse(),
             text: otu_labels.slice(0,10).reverse(),
             type: "bar",
             marker: {
                  color: "#4682B4"
              },
              orientation: "h"
          }];
         
          // Use Plotly to plot bar chart
          Plotly.newPlot("bar", trace);
      });
}


// Bubble chart
function bubblechart(selectedValue) {

    // D3 to retrieve all the data
    d3.json(url).then((data) => {
        
        // Retrieve all sample data
        let samples = data.samples;

        // Call the custom function with filter()
        let filteredData = samples.filter((sample) => sample.id === selectedValue);

        // First index of the array
        let obj = filteredData[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = obj.otu_ids;
        let otu_labels = obj.otu_labels;
        let sample_values = obj.sample_values;

        // Log data to console
        console.log(otu_ids,otu_labels,sample_values);
        
        // Trace for bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // Apply layout
        let layout = {
            xaxis: {title: "OTU ID"}
        };

        // Use Plotly to plot bubble chart
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

// Gauge Chart
function gaugechart(selectedValue) {
    // D3 to retrieve all the data
    d3.json(url).then((data) => {
      
      // Retrieve all metadata
      let metadata = data.metadata;
      
      // Call the custom function with filter()
      let filteredData = metadata.filter((meta) => meta.id == selectedValue);
      
      // First index of the array
      let obj = filteredData[0];
      
      // Get the washing frequency value
      let wfreq = obj.wfreq;

      // Log datta to console
      console.log(wfreq);
      
      // Trace for gauge chart
      let trace2 = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: wfreq,
          title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: {size: 24}},
          type: "indicator",
          mode: "gauge+number",
          gauge: {
            axis: { range: [null, 9] },
            bar: { color: "#850000"},
            steps: [
                { range: [0, 1], color: "#f8f3ec" },
                { range: [1, 2], color: "#f4f1e4" },
                { range: [2, 3], color: "#e9e6c9" },
                { range: [3, 4], color: "#e5e8b0" },
                { range: [4, 5], color: "d5e599" },
                { range: [5, 6], color: "#b7cd8f" },
                { range: [6, 7], color: "#8ac086" },
                { range: [7, 8], color: "#89bc8d" },
                { range: [8, 9], color: "#84b589" }
            ],
          }
        }
      ];
    
      
      // Use Plotly to plot gauge chart
      Plotly.newPlot("gauge", trace2);
    });
}

// Updates plots when sample is changed
function optionChanged(selectedValue) { 

    // Log data to new values
    console.log(selectedValue); 

    // Plot all functions
    demographics(selectedValue);
    barchart(selectedValue);
    bubblechart(selectedValue);
    gaugechart(selectedValue);

};

init();