var counter = document.getElementById("counter");
var output = document.getElementById("output");
var temp = document.getElementById("temp");
var stopWords = new Set();

// define regular expression to define Arabic tokens for lookup:
var arChars = [
  "ء	ARABIC LETTER HAMZA",
  "آ	ARABIC LETTER ALEF WITH MADDA ABOVE",
  "أ	ARABIC LETTER ALEF WITH HAMZA ABOVE",
  "ؤ	ARABIC LETTER WAW WITH HAMZA ABOVE",
  "إ	ARABIC LETTER ALEF WITH HAMZA BELOW",
  "ئ	ARABIC LETTER YEH WITH HAMZA ABOVE",
  "ا	ARABIC LETTER ALEF",
  "ب	ARABIC LETTER BEH",
  "ة	ARABIC LETTER TEH MARBUTA",
  "ت	ARABIC LETTER TEH",
  "ث	ARABIC LETTER THEH",
  "ج	ARABIC LETTER JEEM",
  "ح	ARABIC LETTER HAH",
  "خ	ARABIC LETTER KHAH",
  "د	ARABIC LETTER DAL",
  "ذ	ARABIC LETTER THAL",
  "ر	ARABIC LETTER REH",
  "ز	ARABIC LETTER ZAIN",
  "س	ARABIC LETTER SEEN",
  "ش	ARABIC LETTER SHEEN",
  "ص	ARABIC LETTER SAD",
  "ض	ARABIC LETTER DAD",
  "ط	ARABIC LETTER TAH",
  "ظ	ARABIC LETTER ZAH",
  "ع	ARABIC LETTER AIN",
  "غ	ARABIC LETTER GHAIN",
  "ـ	ARABIC TATWEEL",
  "ف	ARABIC LETTER FEH",
  "ق	ARABIC LETTER QAF",
  "ك	ARABIC LETTER KAF",
  "ل	ARABIC LETTER LAM",
  "م	ARABIC LETTER MEEM",
  "ن	ARABIC LETTER NOON",
  "ه	ARABIC LETTER HEH",
  "و	ARABIC LETTER WAW",
  "ى	ARABIC LETTER ALEF MAKSURA",
  "ي	ARABIC LETTER YEH",
  "ً	ARABIC FATHATAN",
  "ٌ	ARABIC DAMMATAN",
  "ٍ	ARABIC KASRATAN",
  "َ	ARABIC FATHA",
  "ُ	ARABIC DAMMA",
  "ِ	ARABIC KASRA",
  "ّ	ARABIC SHADDA",
  "ْ	ARABIC SUKUN",
  "٠	ARABIC-INDIC DIGIT ZERO",
  "١	ARABIC-INDIC DIGIT ONE",
  "٢	ARABIC-INDIC DIGIT TWO",
  "٣	ARABIC-INDIC DIGIT THREE",
  "٤	ARABIC-INDIC DIGIT FOUR",
  "٥	ARABIC-INDIC DIGIT FIVE",
  "٦	ARABIC-INDIC DIGIT SIX",
  "٧	ARABIC-INDIC DIGIT SEVEN",
  "٨	ARABIC-INDIC DIGIT EIGHT",
  "٩	ARABIC-INDIC DIGIT NINE",
  "ٮ	ARABIC LETTER DOTLESS BEH",
  "ٰ	ARABIC LETTER SUPERSCRIPT ALEF",
  "ٹ	ARABIC LETTER TTEH",
  "پ	ARABIC LETTER PEH",
  "چ	ARABIC LETTER TCHEH",
  "ژ	ARABIC LETTER JEH",
  "ک	ARABIC LETTER KEHEH",
  "گ	ARABIC LETTER GAF",
  "ی	ARABIC LETTER FARSI YEH",
  "ے	ARABIC LETTER YEH BARREE",
  "۱	EXTENDED ARABIC-INDIC DIGIT ONE",
  "۲	EXTENDED ARABIC-INDIC DIGIT TWO",
  "۳	EXTENDED ARABIC-INDIC DIGIT THREE",
  "۴	EXTENDED ARABIC-INDIC DIGIT FOUR",
  "۵	EXTENDED ARABIC-INDIC DIGIT FIVE",
  "۶	EXTENDED ARABIC-INDIC DIGIT SIX",
  "۷	EXTENDED ARABIC-INDIC DIGIT SEVEN",
  "۸	EXTENDED ARABIC-INDIC DIGIT EIGHT",
  "۹	EXTENDED ARABIC-INDIC DIGIT NINE",
  "۰	EXTENDED ARABIC-INDIC DIGIT ZERO"
];
var noise = [
  "◌ّ    | # Tashdīd / Shadda",
  "◌َ    | # Fatḥa",
  "◌ً    | # Tanwīn Fatḥ / Fatḥatān",
  "◌ُ    | # Ḍamma",
  "◌ٌ    | # Tanwīn Ḍamm / Ḍammatān",
  "◌ِ    | # Kasra",
  "◌ٍ    | # Tanwīn Kasr / Kasratān",
  "◌ْ    | # Sukūn",
  "◌ۡ    | # Quranic Sukūn",
  "◌ࣰ    | # Quranic Open Fatḥatān",
  "◌ࣱ    | # Quranic Open Ḍammatān",
  "◌ࣲ    | # Quranic Open Kasratān",
  "◌ٰ    | # Dagger Alif",
  "◌ـ   | # Taṭwīl / Kashīda",
];
var arCharsStr = ""
arChars.forEach(el => arCharsStr += el[0]);
noise.forEach(el => arCharsStr += el[1]);
//console.log(arCharsStr);
//console.log("number of characters in arCharsStr: "+arCharsStr.length);
//console.log("["+arCharsStr+"]+");
var arTokRegex = new RegExp("["+arCharsStr+"]+", "g");
//console.log("الحمد،لله".match(arTokRegex));
//console.log(tokenize("الحمد،لله"));


function tokenize(s){
  let m = s.match(arTokRegex);
  console.log("finished tokenization");

  return m;
}

function wordCount(s){
  console.log("start word count");
  logProgress("Counting...");
  return tokenize(s)
    .reduce(
      function(n,r){return n.hasOwnProperty(r)?++n[r]:n[r]=1,n},
      {}
    )

}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function displayAsTable(obj, destID, minCount, fn){
  var dest = document.getElementById(destID)
  removeAllChildNodes(dest);

  var sortedKeys = Object.keys(obj).sort(function(a,b){return obj[b]-obj[a]});

  // add metadata:
  var numberOfWordsP = document.createElement("p");
  numberOfWordsP.textContent = "Number of different tokens in the text: " + sortedKeys.length;

  // set up the download link:
  var csvDownloadLink = document.createElement("a");
  csvDownloadLink.textContent = "Download table as csv file";
  var href = 'data:text/plain;charset=utf-8,' + "Token%2CCount%0A";

  // set up the html table:
  var table = document.createElement("table");
  var h = document.createElement("tr");
  var col1 = document.createElement("th");
  col1.textContent="token";
  var col2 = document.createElement("th");
  col2.textContent="count";
  h.appendChild(col1);
  h.appendChild(col2);
  table.appendChild(h);
  var incl = 0;
  var inStopWords = 0;
  for (let i=0; i < sortedKeys.length; i++) {
    if (obj[sortedKeys[i]] < minCount) {
      break;
    }
    if (!stopWords.size || (!stopWords.has(sortedKeys[i]))) {
      incl++;
      href += obj[sortedKeys[i]] + "%2C" + sortedKeys[i] + "%0A";
      var row = document.createElement("tr");
      var word = document.createElement("td");
      var count = document.createElement("td");
      word.textContent=sortedKeys[i];
      count.textContent=obj[sortedKeys[i]];
      row.appendChild(word);
      row.appendChild(count);
      table.appendChild(row);
    } else {
      inStopWords ++;
      console.log(sortedKeys[i] + stopWords.has(sortedKeys[i]));
    }
  }
  console.log("incl: "+incl);
  csvDownloadLink.setAttribute('href', href);
  csvDownloadLink.setAttribute("download", fn+"_token_count_min_"+minCount+"_tokens.csv");

  dest.appendChild(csvDownloadLink);
  dest.appendChild(numberOfWordsP);
  p = document.createElement("p");
  var excl_for_length = sortedKeys.length - incl - inStopWords;
  if (excl_for_length) {
    p.innerHTML = "(" + excl_for_length + " tokens were excluded from the count because they appeared less than " + minCount + " times";
  }
  if (stopWords.size) {
    if (excl_for_length) {
      p.innerHTML += "<br/>and " + inStopWords + " tokens were excluded from the count because they were in the stopwords list)";
    } else {
      p.innerHTML += "(" + inStopWords + " tokens were excluded from the count because they were in the stopwords list)";
    }
  } else {
    p.innerHTML += ")";
  }
  if (excl_for_length || stopWords.size) {
    dest.appendChild(p)
  }
  dest.appendChild(table);
}

function logProgress(s){
  removeAllChildNodes(output);
  p = document.createElement("p");
  p.textContent = s;
  output.appendChild(p);
}

// Reset button

function reset() {
  document.getElementById('inputfile').value = "";
  document.getElementById('stopwordsfile').value = "";
  stopWords = new Set();
  counter.value = "1";
  removeAllChildNodes(output);
  removeAllChildNodes(temp);
}

document.getElementById("resetButton")
  .addEventListener("click", function() {
    reset();
  })
// reset the file in the file chooser:

document.getElementById('inputfile')
  .addEventListener("click", function(){
    this.value = "";
    //console.log(this.files);
  })

  // run the token frequency script whenever a new file is uploaded:

document.getElementById('inputfile')
  .addEventListener('change', function() {
    //console.log(this.files);
    removeAllChildNodes(output);
    removeAllChildNodes(temp);
    console.log("file received");
    logProgress("loading file... (this may take a while for very large texts)");
    var fn = this.value;
    fn = fn.replace(/.*[\/\\]/, ''); // remove the fake path before the filename
    var minCount = parseInt(counter.value);
    var fr=new FileReader();
    fr.onload=function(){
      console.log("file loaded");
      logProgress("file loaded! Counting words...");
      var cnt = wordCount(fr.result);
      console.log("finished counting words");

      displayAsTable(cnt, "output", minCount, fn);
    }
    fr.readAsText(this.files[0]);
  });


  // extract stopwords when a new stopwords file is uploaded:

  document.getElementById('stopwordsfile')
    .addEventListener('change', function() {
      console.log("stopwords file received");
      var stopwordsfn = this.value;
      stopwordsfn = stopwordsfn.replace(/.*[\/\\]/, ''); // remove the fake path before the filename
      var swfr=new FileReader();
      swfr.onload=function(){
        console.log("stopwordsfile loaded");
        stopWords = tokenize(swfr.result);
        stopWords = new Set(stopWords);
        console.log("stopwords includes az: "+stopWords.has("از"));
      }
      swfr.readAsText(this.files[0]);
    });


// counter: see https://codepen.io/rkoms/pen/OJbrGKX

document.getElementsByClassName('minus')[0]
  .addEventListener("click", function(e){
    console.log("clicked minus");
    var count = parseInt(counter.value);
    count = count < 2 ? 1 :  count-1;
    console.log("new count: "+count);
    counter.value = count;
  });

  document.getElementsByClassName('plus')[0]
    .addEventListener("click", function(e){
      console.log("clicked plus");
      var count = parseInt(counter.value);
      counter.value = parseInt(counter.value) + 1;
    });

// toggle the display of the options:

var optionsDiv = document.getElementById("options");
document.getElementById("optionsButton")
  .addEventListener("click", function(e){
    if (optionsDiv.style.display !== "none") {
      optionsDiv.style.display = "none";
      this.value = "Options";
    } else {
      optionsDiv.style.display = "block";
      this.value = "Hide options";
    }
  });
