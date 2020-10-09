w = window.width;
h = window.height;

let viz = d3.select("#container")
  .append("svg")
    .attr("x", 0)
    .attr("y", 600)
    .attr("width", w)
    .attr("height", h)
;

function gotData(incomingData){
  console.log("data loaded");
  console.log(incomingData);

  let vizGroup = viz.append("g").attr("class", "vizGroup");

  //let dataIndex = 0;
  let dataToShow;

  function visualizeData(){
    //get data
    dataToShow = incomingData[0];
    console.log("dataToShow", dataToShow);


    function assignKeys(d, i){
      return d.correct_answer
    }

    //viz
    let datagroups = vizGroup.selectAll(".datagroup").data(dataToShow, assignKeys);

    //enteringElement
    let enteringElement = datagroups.enter()
      .append("g")
        .attr("class", "datagroup")
        .attr("x", 100)
        .attr("y", 100)
    ;

    let question = enteringElement.append("text")
      .text((d, i) => d.question)
      .attr("x", 0)
      .attr("y", 0)
    ;

    let correct_answer = enteringElement.append("text")
      .text((d, i) => d.correct_answer)
      .attr("x", 0)
      .attr("y", 30)
    ;

    let wrong_answers_group = enteringElement.append("text")
      .text((d, i) => d.incorrect_answers)
      .attr("x", 0)
      .attr("y", 60)
    ;

    //leavingElement
    let exitingElements = datagroups.exit();

    //udpating element
    dataToShow = incomingData[0];
    datagroups.data(dataToShow, assignKeys)
    ;
  }

  document.getElementById("questionGenerateButton").addEventListener("click", function(){
    dataToShow = incomingData[0];
    visualizeData();
  });
}

d3.json("https://opentdb.com/api.php?amount=1").then(gotData);
