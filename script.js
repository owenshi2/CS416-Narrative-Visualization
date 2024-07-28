// d3.select('h1').style('color', 'red');
let currentScene = 0;
// const scenes = [renderScene1, renderScene2, renderScene3];
const scenes = [drawScatter, drawScatter2, drawScatter];  
window.onload = renderScene;

function renderScene() {
    loadData().then(data => {
        scenes[currentScene](data);
    });
   addParagraphForScene(currentScene);
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
        d3.selectAll("g").style("display", "none");

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
    d3.selectAll("g").style("display", "none");
    
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
            paragraphContent = "Graph 1: Alcohol Levels to Grades. The color of each datum represents how often the student studies (the more orange being the more hours spent).\
            Notice how the spread begins to shrink as it begins to normalize to a lower range.\
            This shows that those that drink less tend to study more, as one can observe that there's much less orange the higher the alcohol level. \
            Now, let's see the correlation on studying and grades by hitting the \"Next\" button up top...";
            break;
        case 1:
            paragraphContent = "Graph 2: Study Time to Grades. Where the more alcohol consumed leads to a larger sized radius.\
            Additionally, number of failed classes is indicated by how orange the circle is (more orange = more failed classes. Capped at 4).\
            Note that heavy drinking is correlated to less study time (disregarding an outlier),\
            there seem to be no failed classes from those studying 12 hours per week,\
            and that higher study times generally seems to lead to better grades (as shown by the higher minimum).\
            Let's continue to a bigger picture overview by hitting the \"Next\" button up top...";
            break;
        case 2:
            paragraphContent = "Graph 3: . Now click on a data point to ";
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
    d3.select('svg').selectAll("circle").remove();
    var studTime = d => d["studytime"];
    var schoolTip = d => d["school"];
    const margin = {top: 20, right: 30, bottom: 30, left: 40},
          width = +d3.select("svg").attr("width") - margin.left - margin.right,
          height = +d3.select("svg").attr("height") - margin.top - margin.bottom;

    const x = d3.scaleLinear().domain([0.5, d3.max(dataInp, d => d.alcoholism1to5)]).range([0, width]),
          y = d3.scaleLinear().domain([0, 100]).range([height, 0]),
          color = d3.scaleLinear().domain(d3.extent(dataInp, d => d.studytime)).range(["blue", "orangered"]);
          //     .scaleLinear()
          //     .domain(d3.extent(data, colorAccess))
          //     .range(["skyblue", "darkslategray"]);

    const svg = d3.select('svg')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    // data plot
    d3.select('svg')
        .selectAll("circle")
        .data(dataInp)
        .enter()
        .append("circle")
        .attr("cx", (d) => x(d.alcoholism1to5) + margin.top + 30)
        .attr("cy", (d) => y(d.averageGrade) + margin.left)
        .attr("fill", (d) => color(d.studytime))
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
            div.html(`Study Hours per Week: ${studTime(i) * 3} <br />School: ${schoolTip(i)}`)
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
    svg.append("g")
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
    svg.append("g")
        .attr("class", "axis axis--y")
        .attr("transform", "translate("+ (30 + margin.top) + ","+ margin.top +")")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "black")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Average Grades");
    
        const annotations = [
            {
                note: {
                    label: "Try hovering over each point to see study hours.",
                    title: "Tip:"
                },
                x: width / 2 + 200,
                y: margin.top / 2 + 100,
                dy: -2,
                dx: -15
            },
            {
                note: {
                    label: "the upper bound is tending downward as the more alcohol is consumed.",
                    title: "Note:"
                },
                x: width / 2 + 410,
                y: margin.top / 2 + 180,
                dy: -20,
                dx: -25
            }
        ];
    
        const makeAnnotations = d3.annotation()
            .annotations(annotations);
    
        svg.append("g")
            .attr("class", "annotation-group1")
            .call(makeAnnotations);
}

// bar has study time with grades, with another variable (size?) detailing the drinking
async function drawScatter2(dataInp)
{
    d3.select('svg').selectAll("circle").remove();
    var studTime = d => d["studytime"];
    var gradeTip = d => d["averageGrade"];
    var failTip = d => d["failures"];
    var alcTip = d => parseInt(d["alcoholism1to5"]);
    const margin = {top: 20, right: 30, bottom: 30, left: 40},
          width = +d3.select("svg").attr("width") - margin.left - margin.right,
          height = +d3.select("svg").attr("height") - margin.top - margin.bottom;

    const x = d3.scaleLinear().domain([0.5, d3.max(dataInp, d => d.studytime * 3)]).range([0, width]),
          y = d3.scaleLinear().domain([0, 100]).range([height, 0])
          size = d3.scalePow().domain([0.5, d3.max(dataInp, d => d.alcoholism1to5)]).range([0, width]),
          color = d3.scaleLinear().domain(d3.extent(dataInp, d => d.failures)).range(["blue", "orangered"]);
          //
    const svg = d3.select('svg')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.select('svg')
        .selectAll("circle")
        .data(dataInp)
        .enter()
        .append("circle")
        .attr("cx", (d) => x(d.studytime * 3) + margin.top + 30)
        .attr("cy", (d) => y(d.averageGrade) + margin.left)
        .attr("r", (d) => size(d.alcoholism1to5) / 30)
        .attr("fill", (d) => color(d.failures))
        // Mouseover Events
        .on('mouseover', function (d, i) {
            d3.select(this).transition()
                .duration('100')
                .attr("r", (d) => size(d.alcoholism1to5) / 35);
            //Makes div appear
            div.transition()
                .duration('200')
                .style("opacity", 1);
            //Uses data
            var yPos = d3.select(this).attr("cy");
            var xPos = d3.select(this).attr("cx");
            div.html(`Alcoholism: ${alcTip(i)}\
                    <br>Study Hours per Week: ${studTime(i) * 3}\
                    <br>AverageGrade: ${gradeTip(i)}\
                    <br>Failed Classes: ${failTip(i)}`)
                .style("top", (parseFloat(yPos) + 225) + "px")
                .style("left", (parseFloat(xPos) + 500) + "px");
        }).on('mouseout', function (d, i) {
            d3.select(this).transition()
                .duration('200')
                .attr("r", (d) => size(d.alcoholism1to5) / 30);
            //makes div disappear
            div.transition()
                .duration('200')
                .style("opacity", 0);
        });

    var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    // x axis
    svg.append("g")
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
        .text("Study Time");

    // y axis
    svg.append("g")
        .attr("class", "axis axis--y")
        .attr("transform", "translate("+ (30 + margin.top) + ","+ margin.top +")")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "black")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Average Grades");

    const annotations = [
        {
            note: {
                label: "Try hovering over each point to see alcoholism.",
                title: "Tip:"
            },
            x: width / 2 + 200,
            y: margin.top / 2 + 100,
            dy: -2,
            dx: -15
        },
        {
            note: {
                label: "Now we're comparing study time.",
                title: "Notice:"
            },
            x: width,
            y: height,
            dy: -2,
            dx: -15
        },
        {
            note: {
                label: "Drinking while studying? Not a good strategy from the looks of it.",
                title: "Outlier:"
            },
            x: width / 2 + 410,
            y: margin.top / 2 + 180,
            dy: -20,
            dx: -25
        }
    ];

    const makeAnnotations = d3.annotation()
        .annotations(annotations);

    svg.append("g")
        .attr("class", "annotation-group1")
        .call(makeAnnotations);
}
