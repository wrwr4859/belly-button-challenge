// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    console.log(data);
    // get the metadata field
    let metadata = data.metadata;
    console.log(metadata)

    // Filter the metadata for the object with the desired sample number
    let sampleMeta = metadata.filter(sampleObj => sampleObj.id == sample)[0];
    console.log(sampleMeta);

    // Use d3 to select the panel with id of `#sample-metadata`
    let metadataPanel = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    metadataPanel.html("");

    // Loop through each key-value pair in the metadata
    // Append a new paragraph tag with the key-value pair
    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    if (sampleMeta) {
      // Loop through each key-value pair in the metadata
      Object.entries(sampleMeta).forEach(([key, value]) => {
        // Append a new paragraph tag with the key-value pair
        metadataPanel.append("p").text(`${key.toUpperCase()}: ${value}`);
      });
    } else {
      metadataPanel.append("p").text("No demographic data found.");
    }
  });

}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;

    // Build a Bubble Chart
    let bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    }];

    let bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 30 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" }
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);


    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // Build a Bar Chart
    // Combine the data into an array of objects to facilitate sorting
    let combinedData = otu_ids.map((otu_id, index) => {
      return {
        otu_id: `OTU ${otu_id}`,
        sample_value: sample_values[index],
        otu_label: otu_labels[index]
      };
    });

    // Sort the data by result array descending
    let sortedData = combinedData.sort((a, b) => b.sample_value - a.sample_value);

    // Slice the first 10 objects with reverse orderfor plotting
    let slicedData = sortedData.slice(0, 10).reverse();

    let trace1 = {
      x: slicedData.map(object => object.sample_value),
      y: slicedData.map(object => object.otu_id),
      text: slicedData.map(object => object.otu_label),
      type: "bar",
      orientation: "h"
    };
        // Data array
    let plotdata = [trace1];

    // Apply a title to the layout
    let layout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }
    };

    // Don't forget to slice and reverse the input data appropriately
    // Render the Bar Chart
    Plotly.newPlot("bar", plotdata, layout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names

    // Use d3 to select the dropdown with id of `#selDataset`
    let selDataset = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
        // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((sample) => {
      selDataset.append("option").text(sample).property('value', sample);
    }); 

    // Get the first sample from the list
    let firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });
}
  
  // Function to handle change in dropdown selection
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
}

// Initialize the dashboard
init();
