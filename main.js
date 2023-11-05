/**
 * This file contains the main logic for a random choice picker web app.
 * It defines constants for delimiters, selects the first delimiter by default, and sets up event listeners for the input area, delimiter select, and enter button.
 * It also defines helper functions for creating tags, randomly selecting a tag, and highlighting/unhighlighting tags.
 */

// Constants
const DELIMITERS = [
    {
        character: " ",
        title: "Space",
        svgIcon: `<svg width="100%" height="100%" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <path d="M20.5,11 L20.5,13 C20.5,13.1380712 20.3880712,13.25 20.25,13.25 L3.75,13.25 C3.61192881,13.25 3.5,13.1380712 3.5,13 L3.5,11 C3.5,10.5857864 3.16421356,10.25 2.75,10.25 C2.33578644,10.25 2,10.5857864 2,11 C2,11.4444444 2,12.1111111 2,13 C2,13.9664983 2.78350169,14.75 3.75,14.75 L20.25,14.75 C21.2164983,14.75 22,13.9664983 22,13 L22,11 C22,10.5857864 21.6642136,10.25 21.25,10.25 C20.8357864,10.25 20.5,10.5857864 20.5,11 Z"></path>
            </svg>
            `,
    },
    {
        character: ",",
        title: "Comma",
        svgIcon: `<svg fill="#000000" width="100%" height="100%" viewBox="-6.5 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.375 21.969l2.188 1.031-2.938 6.125-1.875-0.906z"></path>
            </svg>
            `,
    },
    {
        character: ".",
        title: "Period",
        svgIcon: `<svg fill="#000000" width="100%" height="100%" viewBox="-6.5 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.406 23.188h2.406v2.406h-2.406v-2.406z"></path>
            </svg>
            `,
    },
    // {
    //     character: "\n",
    //     title: "Newline",
    //     svgIcon:
    //         `<svg width="100%" height="100%" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg" aria-labelledby="returnIconTitle" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" color="#000000"> <title id="returnIconTitle">Return</title> <path d="M19,8 L19,11 C19,12.1045695 18.1045695,13 17,13 L6,13"/>
    //             <polyline points="8 16 5 13 8 10"/>
    //         </svg>
    //         `
    // }
];
let selectedDelimiter = DELIMITERS[0];

// DOM elements
const body = document.querySelector("body");
const tagsEl = document.querySelector("#tags");
const inputContainer = document.querySelector("#input-container");
const inputArea = document.querySelector("#input-area");
const clearButton = document.querySelector("#clear-button");
const delimiterSelect = document.querySelector("#delimiter-select");
const enterButton = document.querySelector("#enter-button");

// Focus on the textarea
inputArea.focus();

// Event listeners
inputArea.addEventListener("keyup", (e) => {
    e.target.value = e.target.value.replace(/\n+/g, "");
    createTags();
    autoResize();
    if (e.key === "Enter") {
        e.preventDefault();
        randomSelect();
    }
});

clearButton.addEventListener("click", () => {
    inputArea.value = "";
    tagsEl.innerHTML = "";
    autoResize();
});

let dropdownMenuPresent = false;

body.addEventListener("click", (e) => {
    // Remove the dropdown menu
    const dropdownContent = document.querySelector(".dropdown-content");
    if (dropdownContent 
        && dropdownMenuPresent 
        && !hasSomeParentTheClass(e.target, "delimiter-select")
        && !e.target.classList.contains("delimiter-option")
        ) {
        console.log("Removing dropdown menu");
        dropdownContent.remove();
        dropdownMenuPresent = false;
    }
});

delimiterSelect.addEventListener("click", (e) => {
    // Create the dropdown menu
    if (!dropdownMenuPresent) {
        console.log("Creating dropdown menu");
        createDropdownMenu();
        dropdownMenuPresent = true;
    }
});


enterButton.addEventListener("click", () => {
    randomSelect();
});

// Create tags
const createTags = () => {
    const tags = 
        inputArea.value
        .split(selectedDelimiter.character)
        .filter((s) => /^\s*$/.test(s) === false);
    tagsEl.innerHTML = "";

    tags.forEach((tag) => {
        const tagEl = document.createElement("span");
        tagEl.classList.add("tag");
        tagEl.innerText = tag;
        tagsEl.appendChild(tagEl);
    });
};

// Create the dropdown menu
const createDropdownMenu = () => {
    const dropdown = document.querySelector(".dropdown");
    const dropdownContent = document.createElement("div");
    dropdownContent.classList.add("dropdown-content");
    DELIMITERS.forEach((delimiter) => {
        const delimiterOption = document.createElement("button");
        delimiterOption.classList.add("delimiter-option");
        delimiterOption.title = delimiter.title;
        delimiterOption.innerHTML = delimiter.svgIcon;
        delimiterOption.addEventListener("click", () => {
            // Change the delimiter
            selectedDelimiter = delimiter;
            // Change the delimiter icon
            delimiterSelect.innerHTML = delimiter.svgIcon;
            dropdownContent.remove();
            dropdownMenuPresent = false;
            createTags();
        });
        dropdownContent.appendChild(delimiterOption);
    });
    dropdown.appendChild(dropdownContent);
    // Set the position of the dropdown
    const delimiterSelectPos = delimiterSelect.getBoundingClientRect();
    const dropdownPos = dropdown.getBoundingClientRect();
    dropdownContent.style.top =
        dropdownPos.bottom + "px";
    dropdownContent.style.left =
        delimiterSelectPos.right - dropdownContent.offsetWidth + "px";
}


// Randomly select a tag by highlighting it
const randomSelect = () => {
    // Constants
    const TIMEWAIT = 100; //ms
    const TIMES = 30;

    // Get the tags and unhighlight them all
    const tags = document.querySelectorAll(".tag");
    unHighlightAllTags(tags);

    // Set an interval to keep highlighting a random tag and then unhighlighting it after a certain amount of time
    const interval = setInterval(() => {
        const randomTag = pickRandomTag(tags);
        highlightTag(randomTag);
        setTimeout(unHighlightTag, TIMEWAIT, randomTag);
    }, TIMEWAIT);

    // After a certain amount of time, stop the interval and highlight a random tag
    setTimeout(() => {
        clearInterval(interval);
        highlightTag(pickRandomTag(tags));
    }, TIMEWAIT * TIMES);
};

// Helper functions
const pickRandomTag = (tags) => tags[Math.floor(Math.random() * tags.length)];

const highlightTag = (tag) => tag.classList.add("highlight");

const unHighlightTag = (tag) => tag.classList.remove("highlight");

const unHighlightAllTags = (tags) => {
    tags.forEach((tag) => tag.classList.remove("highlight"));
};

// Auto resize the textarea
const autoResize = () => {
    inputArea.style.height = "auto";
    inputArea.style.height = inputArea.scrollHeight + "px";
};

const hasSomeParentTheClass = (element, classname) => {
    // If we are here we didn't find the searched class in any parents node
    if (!element.parentNode) return false;
    // If the current node has the class return true, otherwise we will search
    // it in the parent node
    if (element.className.split(' ').indexOf(classname)>=0) return true;
    return hasSomeParentTheClass(element.parentNode, classname);
}