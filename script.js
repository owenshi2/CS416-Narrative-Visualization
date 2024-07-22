let currentScene = 0;
const scenes = [renderScene1, renderScene2, renderScene3];  



window.onload = renderScene;

document.getElementById('previous').style.display = 'none'; 

document.getElementById('next').addEventListener('click', function() {
    if (currentScene === scenes.length - 1) {
        document.getElementById('next').style.display = 'none';
        document.getElementById('start-over').style.display = 'inline-block'; 
    } else {
        currentScene = (currentScene + 1) % scenes.length;
        renderScene();

        if (currentScene === 1) {
            document.getElementById('previous').style.display = 'inline-block'; 
        }
    }
});

document.getElementById('previous').addEventListener('click', function() {

    if (currentScene === 1) {
        document.getElementById('previous').style.display = 'none';
    }

    currentScene = (currentScene - 1 + scenes.length) % scenes.length;
    renderScene();

    if (currentScene === scenes.length - 2) { // If you're on the second to the last scene
        document.getElementById('next').style.display = 'inline-block';
        document.getElementById('start-over').style.display = 'none';
    }
});
document.getElementById('start-over').addEventListener('click', function() {
    clearScene3Content() 
    currentScene = 0;
    renderScene();
    
    document.getElementById('start-over').style.display = 'none';
    document.getElementById('previous').style.display = 'none';
    document.getElementById('next').style.display = 'inline-block'; 
});


function clearScene() {
    d3.select("#slide-container svg").selectAll("*").remove();
}

function renderScene() {
    if (currentScene === 1 || currentScene === 0) { // assuming scene3 is the third scene, you can adjust this
        clearScene3Content();
    }
    clearScene();
    loadData().then(data => {
        scenes[currentScene](data);
    });
   addParagraphForScene(currentScene)

}

function renderScene1(raw_data) {
    var aggregatedData = aggregateData(raw_data);
    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    // Define margins for the SVG
    var margin = { top: 50, right: 30, bottom: 100, left: 50 },
        chartWidth = width - margin.left - margin.right,
        chartHeight = height - margin.top - margin.bottom;

    var xScale = d3.scaleBand()
        .domain(aggregatedData.map(d => d.genre))
        .range([0, chartWidth])
        .padding(0.5);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(aggregatedData, d => d.averageEnergy) + 0.2])
        .range([chartHeight, 0]);

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);


    // Draw the axes
    var chartGroup = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        chartGroup.append("text")
    .attr("transform", "rotate(-90)")  // To rotate the text and make it vertical
    .attr("y", -50) 
    .attr("x", -chartHeight / 2)  
    .attr("dy", "-3em")  
    .style("text-anchor", "middle")
    .text("Energy");

    chartGroup.append("g")
        .attr("transform", "translate(0," + chartHeight + ")")
        .call(xAxis)
        .selectAll(".tick text")
        .attr("transform", "rotate(-45)")  // Rotates text by 45 degrees
        .style("text-anchor", "end")
        .attr("dx", "-0.5em")
        .attr("dy", "0.5em");

    chartGroup.append("g")
        .call(yAxis);

    // Draw the scatterplot
    chartGroup.selectAll("circle")
        .data(aggregatedData)
        .enter().append("circle")
        .attr("cx", d => xScale(d.genre) + xScale.bandwidth() / 2)  // Align with center of band
        .attr("cy", d => yScale(d.averageEnergy))
        .attr("r", 5)
        .style("fill", "#0077b6")
        .on("mouseover", function(event, d) {
            d3.select(this)
            .attr("r", 7)
            .style("fill", "#ff5733");
    
        // Add tooltip
        chartGroup.append("text")
            .attr("id", "tooltip")
            .attr("x", xScale(d.genre) + xScale.bandwidth() / 2)  // Center the tooltip text within the band
            .attr("y", yScale(d.averageEnergy) - 15)
            .attr("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("font-weight", "bold")
            .attr("fill", "black")
            .text(`Danceability: ${d.averageDanceability}`);
        })
        .on("mouseout", function(d) {
            d3.select(this)
            .attr("r", 5)
            .style("fill", "#0077b6");
    
        // Remove tooltip
        d3.select("#tooltip").remove();
        });

    // Add annotation
    const annotations = [{
        note: {
            label: "Hover over each point to see danceability.",
            title: "Note"
        },
        x: width / 2,
        y: margin.top / 2,
        dy: 0,
        dx: 0
    }];

    const makeAnnotations = d3.annotation()
        .annotations(annotations);

    svg.append("g")
        .attr("class", "annotation-group1")
        .call(makeAnnotations);
}

  
function renderScene2(raw_data) {
    clearScene();
    var aggregatedData = aggregateData2(raw_data);
    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    // Define margins for the SVG
    var margin = { top: 50, right: 30, bottom: 100, left: 50 },
        chartWidth = width - margin.left - margin.right,
        chartHeight = height - margin.top - margin.bottom;

    var xScale = d3.scaleBand()
        .domain(aggregatedData.map(d => d.genre))
        .range([0, chartWidth])
        .padding(0.5);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(aggregatedData, d => d.averageTempo) + 100])
        .range([chartHeight, 0]);

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    let maxValenceData = aggregatedData.reduce((max, curr) => (curr.averageValence > max.averageValence ? curr : max), {averageValence: -Infinity});
    let maxTempoData = aggregatedData.reduce((max, curr) => (curr.averageTempo > max.averageTempo ? curr : max), {averageTempo: -Infinity});


    // Draw the axes
    var chartGroup = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        chartGroup.append("text")
    .attr("transform", "rotate(-90)")  // To rotate the text and make it vertical
    .attr("y", -50) 
    .attr("x", -chartHeight / 2)  
    .attr("dy", "-3em")  
    .style("text-anchor", "middle")
    .text("Tempo");

    chartGroup.append("g")
        .attr("transform", "translate(0," + chartHeight + ")")
        .call(xAxis)
        .selectAll(".tick text")
        .attr("transform", "rotate(-45)")  // Rotates text by 45 degrees
        .style("text-anchor", "end")
        .attr("dx", "-0.5em")
        .attr("dy", "0.5em");

    chartGroup.append("g")
        .call(yAxis);

    // Draw the scatterplot
    chartGroup.selectAll("circle")
        .data(aggregatedData)
        .enter().append("circle")
        .attr("cx", d => xScale(d.genre) + xScale.bandwidth() / 2)  // Align with center of band
        .attr("cy", d => yScale(d.averageTempo))
        .attr("r", 5)
        .style("fill", "#0077b6")
        .on("mouseover", function(event, d) {
            d3.select(this)
            .attr("r", 7)
            .style("fill", "#ff5733");
    
        // Add tooltip
        chartGroup.append("text")
            .attr("id", "tooltip")
            .attr("x", xScale(d.genre) + xScale.bandwidth() / 2)  // Center the tooltip text within the band
            .attr("y", yScale(d.averageTempo) - 15)
            .attr("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("font-weight", "bold")
            .attr("fill", "black")
            .text(`Valence: ${d.averageValence}`);

    // Remove tooltip
    }) .on("mouseout", function(d) {
        d3.select(this)
        .attr("r", 5)
        .style("fill", "#0077b6");

    // Remove tooltip
    d3.select("#tooltip").remove();
    });
   

            // Add annotation
    const annotations = [{
        note: {
            label: "Hover over each point to see the genre's average valence.",
            title: "Note"
        },
        x: width / 2,
        y: margin.top / 2,
        dy: 0,
        dx: 0   
    }];

    const makeAnnotations = d3.annotation()
    .annotations(annotations);

    svg.append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations);
  
  }
  

async function loadData() {
        const data = await d3.csv("data/data.csv");
        return data;
 }

 function addParagraphForScene(sceneIndex) {
    const container = document.getElementById('text-container'); // assuming you have a div with id "sceneContainer" where you want to append the paragraph
    container.innerHTML = ''; 
    let paragraphContent;
    switch (sceneIndex) {
        case 0:
            paragraphContent = "Here we are looking at the top 30 most energetic genres. Energy is the y-axis with a scale from 0.0 - 1.0. You need energy in your music if you" +
            " want to have a fun party. Here we see how the genres compare to the energy levels. Additionally, if you hover over each " +
            " data point, you can see the danceability of each song. Dancing is important for a party too.";
            break;
        case 1:
            paragraphContent = "In this scene we are looking at the top 30 genres with the fastest tempos. Tempos is on the y-axis and goes from 0-300. Fast music means more energetic dancing like we" +
            " saw in the previous scene. If you hover over each point you can see each genre's valence. Valence is the musical positiveness conveyed by a track. In this scenario, UK Alt hip hop has the fastest tempo." +
            " Chinese idol pop had the highest average valence of 0.784 meaning it is the happiest genre.";
            break;
        case 2:
            paragraphContent = "In this scene, you can curate your own 10 song party playlist based on " +
            "inputs of valence, energy, danceability, and tempo to enhance your next party's experience.";
            break;
        default:
            paragraphContent = ""; // default or for additional scenes
    }

    if (paragraphContent) {
        const paragraph = document.createElement('h3');
        paragraph.textContent = paragraphContent;
        container.appendChild(paragraph);
    }
}

function aggregateData(data) {
    let genreMap = new Map();

    data.forEach(d => {
        if (genreMap.has(d.genre)) {
            let current = genreMap.get(d.genre);
            current.count += 1;
            current.totalEnergy += +d.energy;
            genreMap.set(d.genre, current);
        } else {
            genreMap.set(d.genre, { count: 1, totalEnergy: +d.energy,  totalDanceability: +d.danceability });
        }
    });

    let aggregatedData = [];
    genreMap.forEach((value, key) => {
        aggregatedData.push({
            genre: key,
            averageEnergy: value.totalEnergy / value.count,
            averageDanceability: value.totalDanceability / value.count 
        });
    });
    aggregatedData.sort((a, b) => b.averageEnergy - a.averageEnergy);
    return aggregatedData.slice(0, 30);
}

function aggregateData2(data) {
    let genreMap = new Map();

    data.forEach(d => {
        if (genreMap.has(d.genre)) {
            let current = genreMap.get(d.genre);
            current.count += 1;
            current.totalTempo += +d.tempo;
            current.totalValence += +d.valence;
            genreMap.set(d.genre, current);
        } else {
            genreMap.set(d.genre, { count: 1, totalTempo: +d.tempo,  totalValence: +d.valence });
        }
    });

    let aggregatedData = [];
    genreMap.forEach((value, key) => {
        aggregatedData.push({
            genre: key,
            averageTempo: value.totalTempo / value.count,
            averageValence: value.totalValence / value.count 
        });
    });
    aggregatedData.sort((a, b) => b.averageTempo - a.averageTempo);
    return aggregatedData.slice(0, 30);
 }

 function renderScene3(data) {
    const container = d3.select("#scene3-container");
    const attributes = ["valence", "danceability", "energy", "tempo"];

    // Append text input boxes to the scene3-container
    attributes.forEach(attribute => {
        const div = container.append("div");
        
        div.append("span")
            .text(`${attribute.charAt(0).toUpperCase() + attribute.slice(1)}: `);  // Capitalize attribute name

        div.append("input")
            .attr("type", "text")
            .attr("id", `${attribute}-input`)
            .attr("placeholder", `Enter ${attribute} value`);
    });

    // Button to trigger song filtering/display
    container.append("button")
        .text("Show Top 10 Songs")
        .on("click", () => displaySongs(data));
    
    container.append("div").attr("id", "songs-container");
}

function displaySongs(data) {
    const allSongs = data;
    const shuffledSongs = shuffle(allSongs);
    const topSongs = shuffledSongs.slice(0, 10).map(song => song.trackName); 

    const songContainer = d3.select("#songs-container");

    // Clear previous songs
    songContainer.html("");

    const songList = songContainer.selectAll(".song")
        .data(topSongs);

    // Enter new songs
    songList.enter().append("div")
        .attr("class", "song")
        .text(d => d);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];  // Swap elements
    }
    return array;
}

function clearScene3Content() {
    // Remove songs, input boxes, labels, and the Show Songs button
    d3.select("#scene3-container").html("");
}
