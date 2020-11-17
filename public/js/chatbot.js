document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#s').addEventListener('click', function() {
        setTimeout(() => {
            const message = document.querySelectorAll('.message-holder');
            output(message[message.length - 1].textContent);
        }, 1200);
    })
});

const trigger = [
    ['ola', 'oi', 'ei'],
    ['como voce esta', 'tudo bem com voce'],
    ['o que voce esta fazendo', 'tudo certo por ai'],
    ['feliz', 'bem', 'otimo', 'fantastico', 'legal'],
    ['ruim', 'cansado', 'entediado', 'triste'],
    ['me conte uma historia', 'me conte uma piada'],
    ['obrigado', 'valeu'],
    ['tchau', 'adeus', 'ate mais']
];

const reply = [
    ['ola', 'oi', 'ei voce'],
    [
        'Bem, e você?',
        'Muito bem, e você?',
        'Estou ótimo, e você?'
    ],
    [
        'Nada de mais!',
        'Estou passando um tempo muito bom'
    ],
    ['Muito bom ouvir isso!'],
    ['Porque?', 'Se alegre, vamos cantar...'],
    ['Sobre o que?', 'Era uma vez...'],
    ['Feliz em ajudar', 'O que precisar, estou aqui!'],
    ['Até mais', 'Tchau!']
];

const alternatives = [
    'Tente novamente',
    'Eu estou te ouvindo...'
];

function compare(trArr, rpArr, text) {
    let item;
    for (let x = 0; x < trArr.length; x++) {
        for (let y = 0; y < rpArr.length; y++) {
            if (trArr[x][y] == text) {
                const items = rpArr[x];
                item = items[Math.floor(Math.random() * items.length)];
            }
        }
    }

    return item;
}

function output(input) {
    let product;
    let text = input.toLowerCase().replace(/[^\w\s\d]/gi, '');

    if (compare(trigger, reply, text))
        product = compare(trigger, reply, text);
    else
        product = alternatives[Math.floor(Math.random() * alternatives.length)];

    console.log(product);
}