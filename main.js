const numPoints = 1000;

function load() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = innerWidth * 0.82;
    canvas.height = innerHeight * 0.82;

    const points = [];
    for (let i = 0; i < numPoints; i++) {
        points.push({
            x: Math.random(),
            y: Math.random(),
            velX: Math.random() * 0.01,
            velY: Math.random() * 0.01,
        });
    }

    const visited = [];
    ctx.strokeStyle = '#00b';
    ctx.lineWidth = 6;
    let p1 = points[0];
    let minDistPoint;
    do {
        let minDist = 9999;
        for (const p2 of points) {
            if (p1 != p2 && !visited.includes(p2)) {
                const dist = distanceSq(p1, p2);
                if (dist < minDist) {
                    minDist = dist;
                    minDistPoint = p2;
                }
            }
        }
        visited.push(minDistPoint);

        if (minDist < 0.008) {
            ctx.beginPath();
            ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
            ctx.lineTo(minDistPoint.x * canvas.width, minDistPoint.y * canvas.height);
            ctx.stroke();
        }

        p1 = minDistPoint;

        // console.log(visited);
    } while (visited.length < points.length);

    // p1 = points[0];
    // ctx.beginPath();
    // ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
    // ctx.lineTo(minDistPoint.x * canvas.width, minDistPoint.y * canvas.height);
    // ctx.stroke();

    blur(canvas, ctx);
}

function distanceSq(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return dx * dx + dy * dy;
}

function blur(canvas, ctx) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const blurred = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const range = 3;
    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
            const totalRgba = {
                r: 0,
                g: 0,
                b: 0,
                a: 0
            };
            let n = 0;
            for (let dx = -range; dx <= range; dx++) {
                for (let dy = -range; dy <= range; dy++) {
                    if (x + dx >= 0 && x + dx < canvas.width && y + dy >= 0 && y + dy < canvas.height) {
                        const rgba = getPixel(canvas, imageData, x + dx, y + dy);
                        totalRgba.r += rgba.r;
                        totalRgba.g += rgba.g;
                        totalRgba.b += rgba.b;
                        totalRgba.a += rgba.a;
                        n++;
                    }
                }
            }
            setPixel(canvas, blurred, x, y, {
                r: totalRgba.r / n,
                g: totalRgba.g / n,
                b: totalRgba.b / n,
                a: totalRgba.a / n,
            });
        }
    }
    ctx.putImageData(blurred, 0, 0);
}

function getPixel(canvas, imageData, x, y) {
    const i = 4 * (y * canvas.width + x);
    return {
        r: imageData.data[i],
        g: imageData.data[i + 1],
        b: imageData.data[i + 2],
        a: imageData.data[i + 3],
    };
}

function setPixel(canvas, imageData, x, y, rgba) {
    const i = 4 * (y * canvas.width + x);
    imageData.data[i] = rgba.r;
    imageData.data[i + 1] = rgba.g;
    imageData.data[i + 2] = rgba.b;
    imageData.data[i + 3] = rgba.a;
}

