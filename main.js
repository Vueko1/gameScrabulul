
let word;
const pageWindow = document.querySelector('.inputs');
const loadingScreen = document.querySelector('#cover');
let inputArray = new Array;
let tries = 0;

// preventing refreshing site on default
document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
})

// requesting a random word form API
const getWord = (callback) => {

const wordReq = new XMLHttpRequest;

wordReq.addEventListener('readystatechange', () => {
    if(wordReq.readyState === 4 && wordReq.status === 200){
        const data = JSON.parse(wordReq.responseText);
        callback(undefined, data);
    } else if (wordReq.readyState === 4) {
        callback(`could not fetch data, error code: ${wordReq.status}`, undefined);
    }
})

wordReq.open('GET','https://random-word-api.herokuapp.com/word?number=1&swear=0');
wordReq.send();

};

// creating number of inputs equal to number of characters in word
function inputLooping(){
    for(i = 0; i < word.length; i++){
        pageWindow.innerHTML += `<input class="createdInput" id="${i}" type="text" maxlength="1" required>`
    }
}


// checking for errors and exacuting program if none are found
getWord((err, data) => {
    if(err) {
        console.log(err);
        loadingScreen.textContent = 'ERROR';
    } else {
        console.log(data);
        word = data[0];
        inputLooping();
        setTimeout(() => {
            loadingScreen.remove();
        }, 1000);
        inputArray = Array.from(document.querySelectorAll('.createdInput'));

        // handling focusing on next input automatically and checking if it is focusable
        inputArray.forEach((e, index) => {
            e.addEventListener('keyup', () => {
                if(e.value != ""){
                    let isDisabled = true; 
                    let weirdCounter = 1;
                    do{
                        if(document.getElementById(index + weirdCounter).hasAttribute('disabled')){
                            weirdCounter++;
                        } else {
                            document.getElementById(index + weirdCounter).focus();
                            break;
                        }
                    } while (isDisabled)
                }
            });
        });
    }
});

// disabling inputs for guessed letters
document.querySelector('form').addEventListener('submit', (event) => {
    inputArray.forEach((e, index) => {
        if(e.value === word.charAt(index)){
            e.classList.add('green');
            e.setAttribute('disabled', true);
        } else {
            e.value = "";
        }

    })

    // incrementing amount of tries and displaying it
    tries++;
    document.querySelector('.tries').innerText = tries;

    // focusing on first not disabled input after submitting 
    let stupidCounter = 0;
    inputArray.forEach((e) => {
        if(!e.hasAttribute('disabled') && stupidCounter == 0){
            e.focus();
            stupidCounter++;
        }
    });
    stupidCounter = 0;

    // checking if all letters have been found
    let isDonePlaying = 0;
    inputArray.forEach(e => {
        if(!e.hasAttribute('disabled')){
            isDonePlaying++;
        }
    });

    // alerting user about victory and reloading game
    setTimeout(() => {
        if(isDonePlaying == 0){
            alert(`Congratulations! You guessed the word after ${tries} tries ! Click ok to play again.` );
            location.reload();
        }
        isDonePlaying = 0;
    }, 100);

});


