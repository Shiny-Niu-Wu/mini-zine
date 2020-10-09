console.log("script loaded")

var q = 'car';

window.onload = ()=>{
  sendApiRequest();

  //"gimme more" button to generate a new question.
  let generateButton = document.getElementById("questionGenerateButton");
  if (generateButton) {
    console.log("button is true");
    generateButton.addEventListener("click", ()=>{
      console.log("button clicked");
      jQuery("#sliced_question_group").empty();
      jQuery("#wrong_answers_group").empty();
      jQuery("#pageContent1").empty();
      jQuery("#pageContent2").empty();
      jQuery("#pageContent3").empty();
      jQuery("#pageContent4").empty();
      jQuery("#pageContent5").empty();
      jQuery("#pageContent6").empty();
      jQuery("#pageContent7").empty();
      jQuery("#pageContent8").empty();
      sendApiRequest();
    });
  }
}

//getting data and updating data
async function sendApiRequest(){
  let response = await fetch("https://opentdb.com/api.php?amount=1");
  console.log(response);
  let data = await response.json();

  console.log(data);
  console.log(data.results[0]);
  console.log(data.results[0].question);

  let question = data.results[0].question
  question = question.replace(/&quot;/g,'"');
  console.log("question:", question);
  document.getElementById("question").innerHTML = "Q: " + question;
  let answer = data.results[0].correct_answer
  answer = answer.replace(/&quot;/g,'"');
  console.log("answer:", answer);

      //other ways of decoding json string
        //var dataNew = $('#question').html(question);

        // question = escape(question)
        // console.log(question);
        // question = unescape(question);
        //console.log(question);

//split question into a list of words
//here I want to make a 8-page zine, so
//I want to have 7 chunks of question-words + 1 answer = 8 pages of content
    //there is sometimes still some bug here with text encoding, to be fixed
  let question_words = question.match(/\b(\w+)\b/g);
  console.log(question_words);

  function chunkArray(arr, chunkCount) {
    let chunks = [];
    while(arr.length) {
      var chunkSize = Math.ceil(arr.length / chunkCount--);
      var chunk = arr.slice(0, chunkSize);
      chunks.push(chunk);
      arr = arr.slice(chunkSize);
    }
    return chunks;
    console.log(chunks);
  }

  let questionArrays = chunkArray(question_words, 7);
  console.log(questionArrays);

  //comine chunks of questions (7) with answer (1) = 8
    let question_answerCombinedArray = questionArrays;
    let answerArray = [];
    let refinedAnswer = "Ans: " + answer;
    answerArray.push(refinedAnswer);
    question_answerCombinedArray.push(answerArray);
    console.log(question_answerCombinedArray);

  for (var i = 0; i < question_answerCombinedArray.length; i++) {
    //console.log(questionArrays[i]);
    question_answerCombinedArray[i].join('*');
    //let questionGroup = document.getElementById("sliced_question_and_answer_group");
    let sliced = document.createElement("p");
    sliced.innerHTML = question_answerCombinedArray[i];
    sliced.setAttribute("id", "text" + (i+1));
    sliced.setAttribute("class", "texts");
    //questionGroup.appendChild(sliced);

    //assign combined array with a div
    //this will put chunks of question on the pages in the right order
    document.getElementById("pageContent" + (i+1)).appendChild(sliced);
  }

//split wrong answers array
  let wrong_answers_group = data.results[0].incorrect_answers;
  console.log("wrong:", wrong_answers_group);
  wrong_answers_group.forEach((word, i) => {
    let wrongGroup = document.getElementById("wrong_answers_group");
    let wrong_answer = document.createElement("p");
    word = word.replace(/&quot;/g,'"');
    wrong_answer.innerHTML = "not " + word;
    wrong_answer.classList.add("wrong_answer");
    wrongGroup.appendChild(wrong_answer);
  });

  useApiData(data);
}

function useApiData(){
  console.log("more to come...");
}

//image spliting with canvas and base64 image
//code based and further developed from https://www.youtube.com/watch?v=x06MfsJFdAo
var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    parts = [],
    img = new Image();

//spliting image into 8 parts
//because I want to make an 8-page zine
img.onload = split_8;

function split_8(){
  var w2 = img.width / 4,
      h2 = img.height / 2;

  for (var i = 0; i < 8; i++) {
    var x = (-w2*i) % (w2*4),
        y = (h2*i)<=h2? 0 : -h2 ;

    canvas.width = w2;
    canvas.height = h2;

    ctx.drawImage(this, x, y, w2*4, h2*2);

    parts.push(canvas.toDataURL());

    //for test div
    var slicedImage = document.createElement('img')
    slicedImage.src = parts[i];
    //slicedImage.setAttribute("id", "img" + (i+1));
    //var div = document.getElementById('test');
    //div.appendChild(slicedImage);

    if (i < 7) {
      slicedImage.setAttribute("id", "img" + (i+1));
      document.getElementById("pageImage" + (i+1)).appendChild(slicedImage);
    } else {
      img.setAttribute("id", "img" + (i+1));
      document.getElementById("pageImage" + (i+1)).appendChild(img);
    }



  }

  //console.log(parts);
}

//placeholder image
// img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQQAAABQCAYAAAD/YAtfAAAD6klEQVR4nO3c6Y0jIRCGYWdCKIRCKIRCKIRCKLU/dlxdzdDQF7ZHfkt6pB3uktbfzmqPhzxEAEAeIo93PwDA5yAQACgCAYAiEAAoAgGAIhAAKAIBgCIQACgCAYAiEAAoAgGAIhAAKAIBgCIQACgCAYAiEAAoAgGAIhAAKAIBgCIQACgCAYAiEAAoAgGAIhAAKAIBgCIQACgCAYAiEAAoAgGAIhAAKAJhJiciSUSK/K8iIuHA/vRzxrv7OMOLSJal8s/Yu9+FLgJhFidLENSVduxPZn0YrI2yDp345t7DRt+jXj6tjy9EIMxSZKki6w+4yPiDYfe6ztos7Spv6ttX70iN3v0f6ONLEQgzBFkq7xi3vKzLd+5JZl2R9W9PRPZ9J3I3+6ZoxmPnXZ/Yx5ciEGbwsvyEdtWcrdbebOZj5w5XneUG46/y7Lu+276r/IE+vhSBMJOvvnayrnp9MHN5cLZdm6q5ZObCi3vu9dea+9Q+vhSB8EpBliqN+WLm/eCsZNaGzj1px7tsZTOeq7k9Pdo9tge/ccedfeAyAuFVnKw/8LGaj2Yuyf8PkO+cZ89yjbueVXa8rS63Mb6nz2DW55+znKyDIkzqA5cRCK+SZV2umi9mzv44N9bW6+t5V501eluU3x/YUL0hHug1ynbV59zZBy4jEF4hyrpiNe+lX7lxpq3WnaP5mqvuS+Zrd7BfJ+0/RsyNs+7uA5cQCLN5WVdurInVmiTjv7dgq3XvaL6lvvP5lqM9l6rfbL4uL+gDpxEIsxVZl2usyWY+mfFkxnO1x1br3tF8i5Pf1XpvT9jRS5zcB04jEGaKsq6wsa6YNd6MezNeOntcNec6+0ay2ZtP9Gz3b/Viz53VB04hEGZxsq7UWWtr71wx465zd7nw5tbZI0d7mdEHTiMQZkmyVBmstbV3zp4fqrlg5tKBN0f5XfFg30d7mdEHTiMQZrHlB2vLxlpvxku1J5q5VM0lMxd3vteZPVnW3/q7A30f7eXuPnAJgTBDkKXyjvXJrE87xh9y/78BiGZPqHqIB3q352z1Ys+7uw9cQiDMkGWpLMsfI1rRrHeyrizjv8j0kPv+lWCs7nqO26rfvOVML3f1gcsIhBn2lt0TOuti566ysafI/l9VbSUzngZv3tLrJUzsA5cRCDMU2Vf1Pi/n/tuxaO4scvy/XrNl7/M73rzlTC9X+8BlBAIARSAAUAQCAEUgAFAEAgBFIABQBAIARSAAUAQCAEUgAFAEAgBFIABQBAIARSAAUAQCAEUgAFAEAgBFIABQBAIARSAAUAQCAEUgAFAEAgBFIABQBAIARSAAUAQCAEUgAFAEAgD1DxOuXDVQeFT8AAAAAElFTkSuQmCC";


img.src = "data:image/jpeg;base64,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"
/**
 * Convert an image
 * to a base64 url
 * @param  {String}   url
 * @param  {Function} callback
 * @param  {String}   [outputFormat=image/png]
 */
function convertImgToBase64URL(url, callback, outputFormat){
    var convertImg = new Image();
    convertImg.crossOrigin = 'Anonymous';
    convertImg.onload = function(){
        var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'), dataURL;
        canvas.height = convertImg.height;
        canvas.width = convertImg.width;
        ctx.drawImage(convertImg, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
        canvas = null;
    };
    convertImg.src = url;
}

// document.getElementById("newImage_searched").convertImgToBase64URL();
// console.log(document.getElementById("newImage_searched").src);


// search();
//
// function search() {
//     const cx = '20bedf6a0f7f935fa' // search engine id
//     const apikey = 'AIzaSyAC1cc3SDObtjmdSmE2g8aKN1z8GexS4Wo' // api key
//
//
//     /* select the input element */
//     // let input = document.getElementById('question').innerHTML
//
//     /* fetch the following URL that includes apikey, cx and the value of input */
//     fetch(`https://www.googleapis.com/customsearch/v1?key=${apikey}&cx=${cx}&q=${input.value}`).then(response => response.text()).then(text => {
//     fetch("https://www.googleapis.com/customsearch/v1?key=${apikey}&cx=${cx}&q=cars&callback=hndlr");
//         let result = JSON.parse(text)
//         console.log(result);
//         result.items.forEach(item => {
//             document.createElement('p')
//         })
//     })
//     return false
// }

//screenshot webpage and save local function
//code by GRUNT from stackoverflow adjusted by Shiny Wu
//https://stackoverflow.com/questions/44494447/generate-and-download-screenshot-of-webpage-without-lossing-the-styles

(function(exports) {
    function urlsToAbsolute(nodeList) {
        if (!nodeList.length) {
            return [];
        }
        var attrName = 'href';
        if (nodeList[0].__proto__ === HTMLImageElement.prototype || nodeList[0].__proto__ === HTMLScriptElement.prototype) {
            attrName = 'src';
        }
        nodeList = [].map.call(nodeList, function(el, i) {
            var attr = el.getAttribute(attrName);
            if (!attr) {
                return;
            }
            var absURL = /^(https?|data):/i.test(attr);
            if (absURL) {
                return el;
            } else {
                return el;
            }
        });
        return nodeList;
    }

    function screenshotPage() {
        var wrapper = document.getElementById('zinePages_group');
        html2canvas(wrapper, {
            onrendered: function(canvas) {
                canvas.toBlob(function(blob) {
                    saveAs(blob, 'myGenZine.png');
                });
            }
        });
    }

    function addOnPageLoad_() {
        window.addEventListener('DOMContentLoaded', function(e) {
            var scrollX = document.documentElement.dataset.scrollX || 0;
            var scrollY = document.documentElement.dataset.scrollY || 0;
            window.scrollTo(scrollX, scrollY);
        });
    }

    function generate() {
        screenshotPage();
    }
    exports.screenshotPage = screenshotPage;
    exports.generate = generate;
})(window);
