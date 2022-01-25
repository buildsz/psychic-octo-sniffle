// At the time of writing there are two things the hide the text
// 1. a particular class (that seems to change by browser session) and a hardcoded style
// 2. a redirect if you change either of these (sneaky but rather funny)

// to get past it we first determine the dynamic class attribute based on frequency of usage (fragile AS HELL!!!)
// then for the hidden text we add a new node just before the first hidden paragraph (where the paywall starts)
// and insert a new paragrah with all the text there. If you add multiple paragraphs the sneaky redirect fires!!!
// So I just create only one!


// find hidden nodes
const hiddenStyleAttribute = '[style="display: none;"]';
const hiddenNodes = document.querySelectorAll('[class]' + hiddenStyleAttribute);

// iterate the hidden nodes to find the ones with class node
console.log("Found " + hiddenNodes.length + " hidden tags");


// determine the class name
let dict = {};
hiddenNodes.forEach(element => {
    const theClass = element.getAttribute('class');
    let classes = theClass.split(/\s+/);
    classes.forEach(aClass => {

        if(dict.hasOwnProperty(aClass)){
            dict[aClass] = dict[aClass] + 1;
        }
        else{
            dict[aClass] = 0;
        }
    });

});
console.log(dict);

// find the item in the dictionary with the most usage
let max = Math.max(...Object.values(dict));
console.log(max);
const mostLikelyClassForHiddenParas = Object.keys(dict).filter(key => dict[key] === max);

console.log("mostly likely class attribute is " + mostLikelyClassForHiddenParas)

const classAttributeSelector = '[class~="' + mostLikelyClassForHiddenParas + '"]';

const hiddenParas = document.querySelectorAll(classAttributeSelector  + hiddenStyleAttribute);

if(hiddenParas != null) {
    console.log("Found " + hiddenParas.length + " hidden paras - extracting the text");

    // now consolidate the hidden text into a single paragraph
    let firstNode = null;
    let text = "";

    for(let para = 0; para < hiddenParas.length; para++){
        
        let p = hiddenParas[para];

        if(para === 0) {
            firstNode = p;
        }

        let textToAdd = p.innerHTML;

        console.log(textToAdd);

        text += textToAdd + "<br>";
    }

    if(firstNode != null){

        console.log(firstNode);

        let newPara =  document.createElement('p');
        newPara.innerHTML = text;

        // et viola
        firstNode.before(newPara);
        console.log(newPara);
    }
}

// remove some annoynig links in general
// add *.related-articles for that banner too
let readMoreLinks = document.querySelectorAll("div.c-suggest-links, div.read-more-links, div.email-boost__container");
    if(readMoreLinks != null) {
    readMoreLinks.forEach(element => { 
        element.remove();
    });
}