export function resetDocument(): void {
    document.body.innerHTML = '';

    const canvas = document.createElement('canvas');
    canvas.id = 'game';
    canvas.width = 1024;
    canvas.height = 658;
    document.body.appendChild(canvas);
    
    const sprite = document.createElement('img');
    sprite.id = 'sprite';
    document.body.appendChild(sprite);

    const score = document.createElement('div');
    score.id = 'score';
    document.body.appendChild(score);

    const infoOverlay = document.createElement('div');
    infoOverlay.id = 'infoOverlay';
    document.body.appendChild(infoOverlay);

    const infoContainer = document.createElement('div');
    infoContainer.id = 'infoContainer';
    document.body.appendChild(infoContainer);

    const radarImg = document.createElement('div');
    radarImg.id = 'radarImg';
    document.body.appendChild(radarImg);

    const radarMsg = document.createElement('div');
    radarMsg.id = 'radarMsg';
    document.body.appendChild(radarMsg);
}

resetDocument();