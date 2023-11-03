const tagsEl = document.querySelector('#tags');
const choiceInput = document.querySelector('#choice-input');

choiceInput.focus();

choiceInput.addEventListener('keyup', (e) => {
    e.target.value = e.target.value.replace(/\n+/g, '');
    createTags(e.target.value);

    if(e.key === 'Enter') {
        console.log(e.key);
        setTimeout(() => {
            e.target.value
        }, 10);
        randomSelect();
    }
})

const createTags = (input) => {
    const tags = input.split(' ').filter((s) => s);
    tagsEl.innerHTML = '';

    tags.forEach(tag => {
        const tagEl = document.createElement('span');
        tagEl.classList.add('tag');
        tagEl.innerText = tag;
        tagsEl.appendChild(tagEl);
    });
}

const randomSelect = () => {
    const TIMEWAIT = 100; //ms
    const TIMES = 30;

    const interval = setInterval(() => {
        const randomTag = pickRandomTag();
        console.log(randomTag);
        highlightTag(randomTag);

        setTimeout(unHighlightTag, TIMEWAIT, randomTag);
    }, TIMEWAIT);

    setTimeout(() => {
        clearInterval(interval);

        setTimeout(() => {
            const randomTag = pickRandomTag();
            highlightTag(randomTag);
        }, TIMEWAIT);
    }, TIMEWAIT * TIMES);
}

const pickRandomTag = () => {
    const tags = document.querySelectorAll('.tag');
    return tags[Math.floor(Math.random() * tags.length)];
}

const highlightTag = (tag) => {
    console.log('highlight');
    tag.classList.add('highlight');
}

const unHighlightTag = (tag) => {
    console.log('unHighlight');
    tag.classList.remove('highlight');
}