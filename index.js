var counter = document.getElementById("counter");
var output = document.getElementById("output");
var temp = document.getElementById("temp");

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
  logProgress("Tokenizing...");
  let m = s.match(arTokRegex);
  console.log("finished tokenization");
  logProgress("Counting...");
  return m;
}

function wordCount(s){
  console.log("start word count");
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

  // set up the download link:
  var csvDownloadLink = document.createElement("a");
  csvDownloadLink.textContent = "Download table as csv file";
  //var href = "data:application/octet-stream,token%2Ccount%0A";
  var href = 'data:text/plain;charset=utf-8,' + "Tord%2CCount%0A";


  var sortedKeys = Object.keys(obj).sort(function(a,b){return obj[b]-obj[a]});
  var table = document.createElement("table");
  var h = document.createElement("tr");
  var col1 = document.createElement("th");
  col1.textContent="word";
  var col2 = document.createElement("th");
  col2.textContent="count";
  h.appendChild(col1);
  h.appendChild(col2);
  table.appendChild(h);

  for (let i=0; i < sortedKeys.length; i++) {
    if (obj[sortedKeys[i]] < minCount) {
      break;
    }
    href += sortedKeys[i] + "%2C" + obj[sortedKeys[i]] + "%0A";
    var row = document.createElement("tr");
    var word = document.createElement("td");
    var count = document.createElement("td");
    word.textContent=sortedKeys[i];
    count.textContent=obj[sortedKeys[i]];
    row.appendChild(word);
    row.appendChild(count);
    table.appendChild(row);
  }
  csvDownloadLink.setAttribute('href', href);
  csvDownloadLink.setAttribute("download", fn+"_token_count_min_"+minCount+"_tokens.csv");
  dest.appendChild(csvDownloadLink);
  dest.appendChild(table);
}

function logProgress(s){
  removeAllChildNodes(output);
  p = document.createElement("p");
  p.textContent = s;
  output.appendChild(p);
}

document.getElementById('inputfile')
  .addEventListener('change', function() {
    removeAllChildNodes(output);
    removeAllChildNodes(temp);
    console.log("file received");
    logProgress("loading file...");
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


// counter: see https://codepen.io/rkoms/pen/OJbrGKX

console.log(counter);
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
