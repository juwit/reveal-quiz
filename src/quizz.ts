function init(deck: any) {
    console.log('Initialized reveal-quiz plugin 🙋');
}

const plugin = {
    id: 'reveal-quizz',
    init, 
}

export default () => {
    return plugin;
};