// d3.select('h1').style('color', 'red');
let currentScene = 0;
// const scenes = [renderScene1, renderScene2, renderScene3];  
const scenes = [drawScatter, drawScatter, drawScatter];  
window.onload = renderScene;

function renderScene() {
    loadData().then(data => {
        scenes[currentScene](data);
    });
   addParagraphForScene(currentScene)
}

async function loadData()
{
    const data = await d3.csv("./data/student-data-clean-noindex.csv");
    return data;
}

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
    // clearScene3Content()
    currentScene = 0;
    renderScene();
    
    document.getElementById('start-over').style.display = 'none';
    document.getElementById('previous').style.display = 'none';
    document.getElementById('next').style.display = 'inline-block'; 
});

function addParagraphForScene(sceneIndex) {
    const container = document.getElementById('text-container'); // assuming you have a div with id "sceneContainer" where you want to append the paragraph
    container.innerHTML = '';
    let paragraphContent;
    switch (sceneIndex) {
        case 0:
            paragraphContent = "Scene1.";
            break;
        case 1:
            paragraphContent = "Scene2.";
            break;
        case 2:
            paragraphContent = "Scene3.";
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

async function drawScatter(dataInp)
{
    const data = dataInp
    console.log(data)
    const xAccess = (d) => d.alcoholism1to5;
    const yAccess = (d) => d.averageGrade;
    const colorAccess = (d) => d.school;
    const width = d3.min([window.innerWidth * 0.9, window.innerHeight * 0.9]);
    const dimensions = {
        width,
        height: width,
        margins: {
        top: 10,
        right: 10,
        bottom: 50,
        left: 50
        }
    };
    dimensions.boundedWidth =
    dimensions.width - dimensions.margins.left - dimensions.margins.right;
    dimensions.boundedHeight =
    dimensions.height - dimensions.margins.top - dimensions.margins.bottom;

  const wrapper = d3
    .select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  const bounds = wrapper
    .append("g")
    .style(
      "transform",
      `translate(${dimensions.margins.left}px, ${dimensions.margins.top}px)`
    );

    // Createing Scales
    const xScale = d3
        .scaleLinear()
        .domain(d3.extent(data, xAccess))
        .range([0, dimensions.boundedWidth])
        .nice();

    const yScale = d3
        .scaleLinear()
        .domain(d3.extent(data, yAccess))
        .range([dimensions.boundedHeight, 0])
        .nice();

    const colorScale = d3
        .scaleLinear()
        .domain(d3.extent(data, colorAccess))
        .range(["skyblue", "darkslategray"]);

    //  Draw data
    const dots = bounds
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(xAccess(d)))
        .attr("cy", (d) => yScale(yAccess(d)))
        .attr("r", 4)
        .attr("fill", (d) => colorScale(colorAccess(d)));
    const xAxisGenerator = d3.axisBottom().scale(xScale);

    const xAxis = bounds
        .append("g")
        .call(xAxisGenerator)
        .style("transform", `translateY(${dimensions.boundedHeight}px)`);
    const xAxisLabel = xAxis
    .append("text")
    .attr("x", dimensions.boundedWidth / 2)
    .attr("y", dimensions.margins.bottom - 10)
    .attr("fill", "black")
    .style("font-size", "1.4em")
    .html("Alcohol Consumption 1 (Low) to 5 (High)");
    
    const yAxisGenerator = d3.axisLeft().ticks(5).scale(yScale);

    const yAxis = bounds.append("g").call(yAxisGenerator);
    const yAxisLabel = yAxis
    .append("text")
    .attr("x", -dimensions.boundedHeight / 2)
    .attr("y", -dimensions.margins.left + 10)
    .style("fill", "black")
    .style("transform", "rotate(-90deg)")
    .html("Average Grade")
    .style("font-size", "1.4em")
    .style("text-anchor", "middle");
}