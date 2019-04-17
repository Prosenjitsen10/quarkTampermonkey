// ==UserScript==
// @name         salesforceQuark
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://quarkai-dev-ed.lightning.force.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require     https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        GM_addStyle
// ==/UserScript==

// The waitForKeyElements should ideally be looking for the target (i.e. subject)
// In this case, it is looking for a div with a class 'main-col'
//waitForKeyElements('li.active:nth-child(3) > a:nth-child(1) > span:nth-child(2)', AddButton);
waitForKeyElements('div.main-col', AddButton);
/*
window.addEventListener('load', function() {
    var tabBarList = document.getElementsByClassName('uiTabBar');
    console.log("number of tabBarList found = " + tabBarList.length);
}, false);
*/

function AddButton()
{
    console.log(window.location.href)
    if(window.location.href.startsWith('https://quarkai-dev-ed.lightning.force.com/lightning/r/Case/'))
    {
        console.log("AddButton");
        var zNode       = document.createElement ('div')
        zNode.innerHTML = '<button id="askQuarkButton" class="slds-button slds-button_destructive askButton" style="background-color: #f2711c; margin-left:10px;" role="button">'
            + '<span style="color: white;">ASK QUARK</span></button>'
        ;
        //zNode.setAttribute ('id', 'myContainer');
        var tabBarList = document.getElementsByClassName('uiTabBar'); // need to use waitForElement
        console.log("number of tabBarList found = " + tabBarList.length);

        var index = 0;
        for(var i = 0; i < tabBarList.length; i++)
        {
            if(tabBarList[i].firstChild.childNodes.length > 3)
            {
                var tmpNode = tabBarList[i].firstChild.childNodes[2].firstChild;
                if(tmpNode.childNodes.length >= 2)
                {
                    if(tmpNode.childNodes[1].innerHTML == 'Ask Quark')
                    {
                        tabBarList[i].firstChild.appendChild(zNode);
                        zNode.firstChild.setAttribute ('id', index);
                        index++;
                        //--- Activate the newly added button.
                        zNode.firstChild.addEventListener (
                            "click", ButtonClickAction, false
                        );
                    }
                }
            }
        }
    }
}

/*
// This uses css selector to find the element in the waitForKeyElements function and generates an <a> tag instead of a <button> tag
// Make sure this is unique, otherwise, the AddButton function will be called once for each instance the criteria is met, which could result in multiple buttons

waitForKeyElements('div.slds-gutters_small:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > span:nth-child(1) > span:nth-child(1)', AddButton);

function AddButton()
{
    console.log("AddButton");
    var subject = FindSubject();
    var desc = FindDescription();
    var zNode       = document.createElement ('div');
    var pNode       = document.createElement('p');
    pNode.innerHTML = '<a target="_ask" href="http://ntnxp4.quark.ai/support?casesubject=' + subject + '&casedescription=' + desc + '"><b>ASK Quark</b></a>';
    pNode.setAttribute ('class', 'button');
    zNode.appendChild(pNode);

    var tabBarList = document.getElementsByClassName('uiTabBar'); // need to use waitForElement
    tabBarList[0].firstChild.appendChild(zNode);
}
*/

function ButtonClickAction (zEvent) {
    var maxLength = 2048;
    var index = zEvent.currentTarget.getAttribute('id');
    var subject = FindSubject(index);
    var desc = FindDescription(index);
    console.log('subject = ' + subject);
    console.log('desc = ' + desc);
    console.log("button Clicked " + zEvent.currentTarget.tagName);
    console.log("index = " + index);
    if(desc.length > maxLength)
    {
        desc = desc.substring(0, maxLength);
    }
    var urlString = "https://ntnxp4.quark.ai/support";
    var parameters = "?casesubject=" + subject + "&casedescription=" + desc;
    var encodedURL = encodeURI(urlString + parameters);
    console.log("encodedURL = " + encodedURL);
    window.open(encodedURL, "_ask");
}

function FindSubject(index)
{
    var subject = "";
    var nodeList = document.getElementsByClassName('test-id__field-label');
    var myIndex = 0;
    for(var i = 0; i < nodeList.length; i++)
    {
        if(nodeList[i].innerHTML == 'Subject')
        {
            if(myIndex == index)
            {
                subject = nodeList[i].parentNode.parentNode.childNodes[1].childNodes[0].childNodes[0].innerHTML;
                break;
            }
            myIndex++;
        }
    }
    return subject;
}

function FindDescription(index)
{
    var desc = "";
    var nodeList = document.getElementsByClassName('test-id__field-label');
    var myIndex = 0;
    for(var i = 0; i < nodeList.length; i++)
    {
        if(nodeList[i].innerHTML == 'Description')
        {
            if(myIndex == index)
            {
                desc = nodeList[i].parentNode.parentNode.childNodes[1].childNodes[0].childNodes[0].innerHTML;
                break;
            }
            myIndex++;
        }
    }
    return desc;
}

//--- Style our newly added elements using CSS.
GM_addStyle ( `
    .button {
        background-color: orange;
        border: none;
        color: white;
        padding: 8px 32px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        border-radius: 12px;
        box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
        float: right;
    }
    #myContainer {
        position:               relative;
        top:                    0;
        left:                   0;
        font-size:              12px;
        margin:                 5px;
        opacity:                0.9;
        z-index:                1100;
    }
    #myButton {
        cursor:                 pointer;
    }
` );
/*
function FindSubject()
{
    var subjectText = null;

    // XPATH
    var targEval = document.evaluate (
        "/html/body/div[5]/div[1]/div[2]/div[3]/div/div/div/section/div/div[2]/div/div/div[1]/div/div/div[1]/div[1]/article/div/div[2]/div/div/div[2]/div/section/div[1]/div/div/div/div/div[3]/div[1]/div/div[2]/span/span",
        document.documentElement,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    );
    if (targEval  &&  targEval.singleNodeValue) {
        var targNode  = targEval.singleNodeValue;

        // Payload code starts here.
        subjectText = targNode.textContent;
    }
    // Example of getElementById
    //var targetNode = document.getElementById('idOfNode');
    //if(typeof subjectText !== 'undefined')
    //    subjectText = targetNode.textContent;

    if(subjectText == null)
    {
        var tags = document.getElementsByTagName("span");
        var searchText = "Subject";
        var found;
        for (var i = 0; i < tags.length; i++) {
            if (tags[i].textContent == searchText) {
                found = tags[i];
                var siblingNode = found.parentNode.nextSibling;
                var node = siblingNode.firstChild;
                subjectText = node.textContent;
                break;
            }
        }
    }
    return subjectText;
}
*/

/*
function FindDescription()
{
    var descriptionText = null;

    // XPATH
    var targEval = document.evaluate (
        "/html/body/div[5]/div[1]/div[2]/div[3]/div/div/div/section/div/div[2]/div/div/div[1]/div/div/div[1]/div[1]/article/div/div[2]/div/div/div[2]/div/section/div[1]/div/div/div/div/div[4]/div[1]/div/div[2]/span/span",
        document.documentElement,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    );
    if (targEval  &&  targEval.singleNodeValue) {
        var targNode  = targEval.singleNodeValue;

        // Payload code starts here.
        descriptionText = targNode.textContent;
    }
    if(descriptionText == null)
    {
        var tags = document.getElementsByTagName("span");
        var searchText = "Description";
        var found;
        for (var i = 0; i < tags.length; i++) {
            if (tags[i].textContent == searchText) {
                found = tags[i];
                var siblingNode = found.parentNode.nextSibling;
                var node = siblingNode.firstChild.firstChild;
                descriptionText = node.textContent;
                break;
            }
        }
    }
    return descriptionText;
}
*/
