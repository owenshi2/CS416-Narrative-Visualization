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
            paragraphContent = "Scene1. Now, let's see the correlation on studying and grades by hitting the \"Next\" button up top...";
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
    var studTime = d => d["studytime"];
    var schoolTip = d => d["school"];
    const margin = {top: 20, right: 30, bottom: 30, left: 40},
          width = +d3.select("svg").attr("width") - margin.left - margin.right,
          height = +d3.select("svg").attr("height") - margin.top - margin.bottom;

    const x = d3.scaleLinear().domain([1, d3.max(dataInp, d => d.alcoholism1to5)]).range([0, width]),
          y = d3.scaleLinear().domain([0, 100]).range([height, 0]),
          color = d3.scaleOrdinal().domain(d3.extent(dataInp, d => d.school)).range(["orangered", "blue"]);
          //     .scaleLinear()
          //     .domain(d3.extent(data, colorAccess))
          //     .range(["skyblue", "darkslategray"]);

    const g = d3.select('svg')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    // data plot
    d3.select('svg')
        .selectAll("circle")
        .data(dataInp)
        .enter()
        .append("circle")
        .attr("cx", (d) => x(d.alcoholism1to5) + margin.top + 30)
        .attr("cy", (d) => y(d.averageGrade) + margin.left)
        .attr("fill", (d) => color(d.school))
        .attr("r", 4)
        //Mouseover Events
        .on('mouseover', function (d, i) {
            d3.select(this).transition()
                .duration('100')
                .attr("r", 7);
            //Makes div appear
            div.transition()
                .duration('200')
                .style("opacity", 1);
            //Uses data
            var yPos = d3.select(this).attr("cy");
            var xPos = d3.select(this).attr("cx");
            div.html(`Study Time: ${studTime(i)} <br />School: ${schoolTip(i)}`)
                .style("top", (parseFloat(yPos) + 225) + "px")
                .style("left", (parseFloat(xPos) + 500) + "px");
        }).on('mouseout', function (d, i) {
            d3.select(this).transition()
                .duration('200')
                .attr("r", 4);
            //makes div disappear
            div.transition()
                .duration('200')
                .style("opacity", 0);
        });

    var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
   

    // x axis
    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(" + (30 + margin.top) + "," + (height + margin.top) + ")")
        .call(d3.axisBottom(x))
        .append("text")
        .attr("transform", "translate(-30, 0)")
        .attr("fill", "black")
        .attr("x", width - margin.right + 5)
        .attr("y", -15)
        .attr("dy", "0.71em")
        .attr("text-anchor", "start")
        .text("Alcohol Levels");
    // y axis
    g.append("g")
        .attr("class", "axis axis--y")
        .attr("transform", "translate("+ (30 + margin.top) + ","+ margin.top +")")
        .call(d3.axisLeft(y))
      .append("text")
        .attr("fill", "black")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Grades");

    console.log(dataInp);
    // g.append("path")
    //     .datum(dataInp)
    //     .attr("class", "line")
    //     .attr("fill", "none")
    //     .attr("stroke", "black")
    //     .attr("stroke-width", 1.5)
    //     .attr("d", line);
    // const data = dataInp
    // console.log(data)
    // const xAccess = (d) => d.alcoholism1to5;
    // const yAccess = (d) => d.averageGrade;
    // const colorAccess = (d) => d.school;
    // const margin = {
    //     top: 20,
    //     right: 30,
    //     bottom: 30,
    //     left: 40
    // };
    // const width = d3.select("svg").attr("width") - margin.left - margin.right;
    // const height = d3.select("svg").attr("height") - margin.top - margin.bottom;
    // const xScale = d3
    //     .scaleLinear()
    //     .domain(d3.extent(data, xAccess))
    //     .range([0, width]);

    // const yScale = d3
    //     .scaleLinear()
    //     .domain([0, d3.max(data, yAccess)])
    //     .range([height, 0]);

    // const colorScale = d3
    //     .scaleLinear()
    //     .domain(d3.extent(data, colorAccess))
    //     .range(["skyblue", "darkslategray"]);

    // const dots = d3.select('svg')
    //     .selectAll("circle")
    //     .data(data)
    //     .enter()
    //     .append("circle")
    //     .attr("cx", (d) => xScale(xAccess(d)))
    //     .attr("cy", (d) => yScale(yAccess(d)))
    //     .attr("r", 4)
    //     .attr("fill", (d) => colorScale(colorAccess(d)));

    // console.log(data);


    // const gSVG = d3.select('svg').attr("transform", "translate("+ margin.left +"," + margin.top +")");

    // gSVG
    //     .attr("class", "axis axis--x")
    //     .attr("transform", "translate("+ 10 + "," + height + ")")
    //     .call(d3.axisBottom(xScale))
    // .append("text")
    // .attr("fill", "black")
    // .attr("x", width - margin.right + 5)
    // .attr("y", -10)
    // .style("font-size", "1.4em")
    // .html("Alcohol Consumption 1 (Low) to 5 (High)");

    // const yAxis = gSVG.append("g")
    // .attr("class", "axis axis--y")
    // .call(d3.axisLeft(yScale));
    // const yAxisLabel = yAxis
    // .append("text")
    // .attr("fill", "black")
    // .style("transform", "rotate(-90)")
    // .attr("y", -margin.left + 50)
    // .attr("dy", "0.71em")
    // .attr("text-anchor", "end")
    // .html("Average Grade");
}

// bar has study time with grades, with another variable (size?) detailing the drinking
async function drawBar(dataInp)
{
    const margin = {top: 20, right: 30, bottom: 30, left: 40},
          width = +d3.select("svg").attr("width") - margin.left - margin.right,
          height = +d3.select("svg").attr("height") - margin.top - margin.bottom;

    const x = d3.scaleLinear().domain([1, d3.max(dataInp, d => d.alcoholism1to5)]).range([0, width]),
          y = d3.scaleLinear().domain([0, 100]).range([height, 0]),
          color = d3.scaleOrdinal().domain(d3.extent(dataInp, d => d.school)).range(["orangered", "blue"]);
          //
}