var bilateral = false;
var ctrl = 0.3;
var zero_thr = 0.25;
var clickEvent = "add"
var plotType = "smag";

function initializeLabels_s(bilateral) {
    if(bilateral) { var length=30; } else { var length=15; }
    let temp = Array.from({length: length/0.05+1}, (x, i) => i);
    for(let i=0; i<temp.length; i++) {
        if(length===30) { temp[i] -= 300; temp[i] /= 10; }
        else { temp[i] /= 20; }
    }
    return temp;
}
function initializeLabels_z(bilateral) {
    if(bilateral) { var length = 2*Math.PI; } else { var length = Math.PI; }
    let temp = Array.from({length: length/0.01+1}, (x, i) => i);
    for(let i=0; i<temp.length; i++) { temp[i] /= 100; }
    return temp;
}
function compare(p1, p2) {
    return Math.abs(p1.x-p2.x)<ctrl && Math.abs(p1.y-p2.y)<ctrl;
}
function complex_distance_s(x, y) {
    return Math.pow(Math.pow(y-x.y, 2)+Math.pow(0-x.x, 2), 1/2);
}
function complex_distance_z(x, y) {
    return Math.pow(Math.pow(y.y-x.y, 2)+Math.pow(y.x-x.x, 2), 1/2);
}
function magnitude_response_s(chart, bilateral) {
    // zeros = chart.data.datasets[0].data
    // poles = chart.data.datasets[1].data
    temp = [];
    if(bilateral) { var startLimit = -15.; } else { var startLimit = 0; }
    for(let i=startLimit; i<=15.0; i+=0.05) {
        let a = 1.0;
        let pass = false;
        chart.data.datasets[0].data.forEach((zero) => {
            if(pass) { pass = false; } else {
                if(Math.abs(zero.y)<zero_thr) {
                    a *= complex_distance_s({x:zero.x, y:0}, i);
                    pass = true;
                } else {
                    a *= complex_distance_s(zero, i);
                }
            }
        }); pass = false;
        chart.data.datasets[1].data.forEach((pole) => {
            if(pass) { pass = false; } else {
                if(Math.abs(pole.y)<zero_thr) {
                    let dist = complex_distance_s({x:pole.x, y:0}, i);
                    a /= dist===0?Number.MIN_VALUE:dist;
                    pass = true;
                } else {
                    let dist = complex_distance_s(pole, i);
                    a /= dist===0?Number.MIN_VALUE:dist;
                }
            }
        })
        temp.push(a);
    }
    return temp;
}
function phase_response_s(chart, bilateral) {
    // zeros = chart.data.datasets[0].data
    // poles = chart.data.datasets[1].data
    temp = [];
    if(bilateral) { var startLimit = -15.; } else { var startLimit = 0; }
    for(let i=startLimit; i<=15.0; i+=0.05) {
        let a = 0.0;
        let pass = false;
        chart.data.datasets[0].data.forEach((zero) => {
            if(pass) { pass = false; } else {
                if(Math.abs(zero.y)<zero_thr) {
                    a += Math.atan(zero.x/(-i));
                    pass = true;
                } else {
                    a += Math.atan(zero.x/(zero.y-i));
                }
            }
        }); pass = false;
        chart.data.datasets[1].data.forEach((pole) => {
            if(pass) { pass = false; } else {
                if(Math.abs(pole.y)<zero_thr) {
                    a -= Math.atan(pole.x/(-i));
                    pass = true;
                } else {
                    a -= Math.atan(pole.x/(pole.y-i));
                }
            }
        })
        temp.push(a);
    }
    return temp;
}
function magnitude_response_z(chart, bilateral) {
    temp = [];
    if(bilateral) { var endLimit = 2*Math.PI; } else { var endLimit = Math.PI; }
    for(let i=0; i<=endLimit; i+=0.01) {
        let x = Math.cos(i);
        let y = Math.sin(i);
        let a = 1.0;
        let pass = false;
        chart.data.datasets[0].data.forEach((zero) => {
            if(pass) { pass = false; } else {
                if(Math.abs(zero.y)<zero_thr) {
                    a *= complex_distance_z({x:zero.x, y:0}, {x, y});
                    pass = true;
                } else {
                    a *= complex_distance_z(zero, {x, y});
                }
            }
        }); pass = false;
        chart.data.datasets[1].data.forEach((pole) => {
            if(pass) { pass = false; } else {
                if(Math.abs(pole.y)<zero_thr) {                
                    let dist = complex_distance_z({x:pole.x, y:0}, {x, y});
                    a /= dist===0?Number.MIN_VALUE:dist;
                    pass = true;
                } else {
                    let dist = complex_distance_z(pole, {x, y});
                    a /= dist===0?Number.MIN_VALUE:dist;
                }
            }
        })
        temp.push(a);
    }
    return temp;
}
function phase_response_z(chart, bilateral) {
    // zeros = chart.data.datasets[0].data
    // poles = chart.data.datasets[1].data
    temp = [];
    if(bilateral) { var endLimit = 2*Math.PI; } else { var endLimit = Math.PI; }
    for(let i=0; i<=endLimit; i+=0.01) {
        let x = Math.cos(i);
        let y = Math.sin(i);
        let a = 0.0;
        let pass = false;
        chart.data.datasets[0].data.forEach((zero) => {
            if(pass) { pass = false; } else {
                if(Math.abs(zero.y)<zero_thr) {
                    a += Math.atan((zero.x-x)/(-y));
                    pass = true;
                } else {
                    a += Math.atan((zero.x-x)/(zero.y-y));
                }
            }
        }); pass = false;
        chart.data.datasets[1].data.forEach((pole) => {
            if(pass) { pass = false; } else {
                if(Math.abs(zero.y)<zero_thr) {
                    a -= Math.atan((pole.x-x)/(-y));
                    pass = true;
                } else {
                    a -= Math.atan((pole.x-x)/(pole.y-y));
                }
            }
        })
        temp.push(a);
    }
    return temp;
}

var chart = new Chart(document.getElementById('plotChart').getContext('2d'), {
    type: "scatter",
    data: {
        datasets: [{
            label: "Zeros", pointStyle: "circle", pointHitRadius: 3,
            borderColor: "blue", backgroundColor: "white",
            data: []
        }, {
            label: "Poles", pointStyle: "crossRot", pointHitRadius: 3,
            borderColor: "red", backgroundColor: "white",
            data: []
        }, {
            label: "", pointStyle: false, pointHitRadius: 0,
            radius: 0, dragData: false,
            data: [{x: 10, y: 10}, {x: -10, y: -10}],
        }],
    },
    options: {
        maintainAspectRatio: false,
        animation: false,
        // animation: { duration: 0 },
        elements: {
            point: {
                radius: 5,
            }
        },
        plugins: {
            dragData: { // // // // //
                round: 3, // n decimal places: X.123
                showToolTip: true,
                dragX: true,
                onDragStart: function(e, element) {
                },
                onDrag: function(e, datasetIndex, index, value) {
                    if(index%2===0 && chart.data.datasets[datasetIndex].data[index].y<0) {
                        chart.data.datasets[datasetIndex].data[index].y = -chart.data.datasets[datasetIndex].data[index].y;
                        chart.data.datasets[datasetIndex].data[index+1].x = chart.data.datasets[datasetIndex].data[index].x;
                        chart.data.datasets[datasetIndex].data[index+1].y = -chart.data.datasets[datasetIndex].data[index].y;
                    } else if(index%2===1 && chart.data.datasets[datasetIndex].data[index].y>0) {
                        chart.data.datasets[datasetIndex].data[index].y = -chart.data.datasets[datasetIndex].data[index].y;
                        chart.data.datasets[datasetIndex].data[index-1].x = chart.data.datasets[datasetIndex].data[index].x;
                        chart.data.datasets[datasetIndex].data[index-1].y = -chart.data.datasets[datasetIndex].data[index].y;
                    } else if(value.y>0) {
                        chart.data.datasets[datasetIndex].data[index+1].x = chart.data.datasets[datasetIndex].data[index].x;
                        chart.data.datasets[datasetIndex].data[index+1].y = -chart.data.datasets[datasetIndex].data[index].y;
                    } else {
                        chart.data.datasets[datasetIndex].data[index-1].x = chart.data.datasets[datasetIndex].data[index].x;
                        chart.data.datasets[datasetIndex].data[index-1].y = -chart.data.datasets[datasetIndex].data[index].y;
                    }
                    update();
                },
                onDragEnd: function(e, datasetIndex, index, value) {
                }
            }, // // // // //
            legend: {
                labels: {
                    usePointStyle: true // , font: { size: 20 }
                }
            }
        },
        events: ["click", "contextmenu", "mousemove"],
        onClick: clickProcess
    },
	plugins: [{
        afterInit: (chart) => {
            chart.canvas.addEventListener("contextmenu", handleContextMenu, false);
            function handleContextMenu(e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }
    }]
});
var chart_2 = new Chart(document.getElementById('resultChart').getContext('2d'), {
    type: "line",
    data: {
        labels: initializeLabels_s(bilateral),
        datasets: [{
            label: "Magnitude Response (s-plane)", pointStyle: false,
            data: [] // Array.from({length: 30}, () => Math.random())
        }]
    },
    options: {
        animation: false,
        maintainAspectRatio: false,
        elements: {
            line: {
                borderWidth: 0.75,
                borderColor: "red"
            }
        },
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true // , font: { size: 20 }
                }
            }
        },
    }
});
function update() {
    if (plotType==="smag") {
        chart_2.data.datasets[0].data = magnitude_response_s(chart, bilateral);
    } else if (plotType==="zmag") {
        chart_2.data.datasets[0].data = magnitude_response_z(chart, bilateral);
    } else if (plotType==="sphs") {
        chart_2.data.datasets[0].data = phase_response_s(chart, bilateral);
    } else if (plotType==="zphs") {
        chart_2.data.datasets[0].data = phase_response_z(chart, bilateral);
    }
    console.log("Chart is updated according to "+plotType+".");
    chart_2.update();
}

function clickProcess(e) {
    const cpos = Chart.helpers.getRelativePosition(e, chart);
    var x = chart.scales.x.getValueForPixel(cpos.x);
    var y = chart.scales.y.getValueForPixel(cpos.y);
    x = Math.round(x*1000)/1000;
    y = Math.round(y*1000)/1000;
    var _case = false;

    if (clickEvent==="add") {
        if (e.type==="contextmenu") {
            chart.data.datasets[0].data.forEach((e) => {
                _case = _case===false?compare(e, {x, y}):true;
            });
            if (!_case) {
                y = Math.abs(y);
                chart.data.datasets[0].data.push({x: x, y: y})
                chart.data.datasets[0].data.push({x: x, y: -y})
            }
        } else if (e.type==="click") {
            chart.data.datasets[1].data.forEach((e) => {
                _case = _case===false?compare(e, {x, y}):true;
            });
            if (!_case) {
                y = Math.abs(y);
                chart.data.datasets[1].data.push({x: x, y: y})
                chart.data.datasets[1].data.push({x: x, y: -y})
            }
        }
    } else if (clickEvent==="delete") {
        if (e.type==="click") {
            var found = false;
            for(let i=0; i<chart.data.datasets[1].data.length; i++) {
                temp = chart.data.datasets[1].data[i];
                if (compare(temp, {x, y})) {
                    chart.data.datasets[1].data.splice(i, 1);
                    if (temp.y<0) {
                        chart.data.datasets[1].data.splice(i-1, 1);
                    } else {
                        chart.data.datasets[1].data.splice(i, 1);
                    }
                    found = true;
                    break;
                }
            }
            if (!found) {
                for(let i=0; i<chart.data.datasets[0].data.length; i++) {
                    temp = chart.data.datasets[0].data[i];
                    if (compare(temp, {x, y})) {
                        chart.data.datasets[0].data.splice(i, 1);
                        if (temp.y<0) {
                            chart.data.datasets[0].data.splice(i-1, 1);
                        } else {
                            chart.data.datasets[0].data.splice(i, 1);
                        }
                        break;
                    }
                }
            }
        }
    }
    chart.update();
    update();
}
const clearButton = document.getElementById("clear-button");
clearButton.addEventListener("click", function() {
    chart.data.datasets[0].data = [];
    chart.data.datasets[1].data = [];
    chart.update();
    update();
})
const updateButton = document.getElementById("update-button");
const responseBox = document.getElementById("response-select");
const planeBox = document.getElementById("plane-select");
updateButton.addEventListener("click", function() {
    response = responseBox.value;
    plane = planeBox.value;
    if (response==="magnitude") {
        if (plane==="s-plane") {
            plotType = "smag";
            chart_2.data.datasets[0].label = "Magnitude Response (s-plane)";
        } else if (plane==="z-plane") {
            plotType = "zmag";
            chart_2.data.datasets[0].label = "Magnitude Response (z-plane)";
        }
    } else if (response==="phase") {
        if (plane==="s-plane") {
            plotType = "sphs";
            chart_2.data.datasets[0].label = "Phase Response (s-plane)";
        } else if (plane==="z-plane") {
            plotType = "zphs";
            chart_2.data.datasets[0].label = "Phase Response (z-plane)";
        }
    }
    if (plane==="s-plane") {
        chart.data.datasets[2].data = [{x: 10, y: 10}, {x: -10, y: -10}]
        chart_2.data.labels = initializeLabels_s(bilateral);
        ctrl = 0.3;
    } else if (plane==="z-plane") {
        chart.data.datasets[2].data = [{x: 3, y: 3}, {x: -3, y: -3}]
        chart_2.data.labels = initializeLabels_z(bilateral);
        ctrl = 0.1;
    }
    chart.update();
    update();
})
const delClicks = document.getElementById("deleting-clicks");
delClicks.addEventListener("change", function() {
    if (this.checked) { // console.log("checkbox-checked");
        chart.data.datasets[0].dragData = false;
        chart.data.datasets[1].dragData = false;
        clickEvent = "delete";
    } else { // console.log("checkbox-check removed");
        chart.data.datasets[0].dragData = true;
        chart.data.datasets[1].dragData = true;
        clickEvent = "add";
    }
})

update();
