export default {
    id: "contextTestID",
    pluginPoint: "cockpit.processInstance.runtime.tab",
    properties: {
        label: "Context"
    },
    render: async (node, {api, processInstanceId}) => {
        const activity = await getCurrentActivity(api, processInstanceId)
        const activityId = await activity.id
        // Erstellen Sie den HTML-Inhalt ohne das Chart.js-Skript im Inneren
        if (activityId === "check_dm") {
            const projects = await getProjects().valueOf();
            const project_names = []
            const project_hours = []
            for (const k in projects) {
                const project = projects[k];
                project_names.push(project.Name);
                project_hours.push(project.Hours)
            }
            console.log(project_names)
            console.log(project_hours);
            node.innerHTML = `
                <div>
                    <span style="text-decoration: underline;">Context information:</span>
                </div>
                <div style="width: 100%; height: 100%; padding-block: 20px; margin: auto; text-align: center;">
                    <div style="float:left; width:19%; height: auto; border-width: thin; border-color: lightgray; border-style: solid; border-radius: 10px;">
                        <div style="padding-block: 5px;">
                            <span style="width: 100%; font-weight: bold;">
                                Needed hours for ongoing projects
                            </span>
                        </div>
                        <div style="padding-block: 5px;">   
                            <canvas id="projectsDoughnut" width="10" height="10"></canvas>
                        </div>
                    </div>
                    <div style="float:right; width: 79%; height: auto; border-width: thin; border-color: lightgray; border-style: solid; border-radius: 10px;">
                        <canvas id="myChart" width="50" height="20"></canvas>
                    </div>
                </div>
            `;
            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/npm/chart.js";
            script.onload = () => {
                const ctx = document.getElementById('projectsDoughnut').getContext('2d');
                const myDougnut = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: project_names, //['Project 1', 'Project 2', 'Project 3', 'Project 4', 'Project 5', 'Unused hours']
                        datasets: [{
                            label: 'needed hours',
                            data: project_hours, //[120, 190, 300, 150, 90, 350]
                            backgroundColor: [
                                'rgb(0,255,37)',
                                'rgb(134,75,88)',
                                'rgb(75,134,127)',
                                'rgb(75,107,134)',
                                'rgb(99,75,134)',
                                'rgb(134,75,124)',
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'bottom'
                            },
                            title: {
                                display: false,
                                text: 'Auslastung'
                            }
                        }
                    }
                });
                const ctx2 = document.getElementById('myChart').getContext('2d');
                const myChart = new Chart(ctx2, {
                    type: 'line',
                    data: {
                        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                        datasets: [{
                            label: '# of Votes',
                            data: [12, 19, 3, 5, 2, 3],
                            borderColor: [
                                'rgb(134,75,88)',
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }
            script.onerror = () => {
                console.error('Chart.js could not be loaded.');
            };
            document.head.appendChild(script);
        }
        else {
            node.innerHTML = `
                  <div>
                    <button class="btn btn-default action-button" style="width: 40px; margin-top: 5px;">
                      <img src="../scripts/corgi.gif" width="20" alt="Corgi"/>
                    </button>
                    <div>
                      ProcessInstanceId: ${processInstanceId}
                      <br>
                      ActivityID: ` + activityId + `
                      <br>
                      <span style="display: flex; justify-content: center; text-underline: thick;">Charts</span>
                      <div style="width: 100%; height: 100%; padding-block: 20px">
                        <div style="float:left; width:49%; height: auto; border-width: thin; border-color: lightgray; border-style: solid; border-radius: 10px;">
                            <canvas id="myChart" width="50" height="10"></canvas>
                        </div>
                        <div style="float:right; width: 49%; height: auto; border-width: thin; border-color: lightgray; border-style: solid; border-radius: 10px;">
                            <canvas id="myChart2" width="50" height="10"></canvas>
                        </div>
                      </div>
                    </div>
                  </div>
            `;

            // Chart.js-Skript laden und sicherstellen, dass es vor der Verwendung geladen ist
            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/npm/chart.js";
            script.onload = () => {
                const ctx = document.getElementById('myChart').getContext('2d');
                const myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                        datasets: [{
                            label: '# of Votes',
                            data: [12, 19, 3, 5, 2, 3],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
                const ctx2 = document.getElementById('myChart2').getContext('2d');
                const myChart2 = new Chart(ctx2, {
                    type: 'line',
                    data: {
                        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                        datasets: [{
                            label: '# of Votes',
                            data: [12, 19, 3, 5, 2, 3],
                            borderColor: [
                                'rgb(134,75,88)',
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            };
            script.onerror = () => {
                console.error('Chart.js could not be loaded.');
            };
            document.head.appendChild(script);

            // onclick function for our button
            node.onclick = function () {
                console.log("ID: " + processInstanceId);
                const processes = processesHistory();
                processes.then(value => {
                    console.log(value[0].startTime)
                });
                const test = testHistory();
                test.then(value => console.log(value));
                const employees = getEmployees();
                employees.then(value => console.log(value));
            };
        }
    }
};

async function processesHistory() {
    const response = await fetch("http://localhost:8080/processes");
    return await response.json();
}

async function testHistory() {
    const response = await fetch("http://localhost:8080/test");
    return await response.json();
}

async function getProjects() {
    const response = await fetch("http://localhost:8080/projects");
    return await response.json();
}

async function getEmployees() {
    const response = await fetch("http://localhost:8080/employees");
    return await response.json();
}

async function getCurrentActivity(api, processInstanceId) {
    const response = await fetch(api.engineApi + "/process-instance/" + processInstanceId + "/activity-instances", {
        method: 'get',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": api.CSRFToken,
        }
    });
    let value = await response.json();
    let activityId;
    let activityName;
    activityId = value.childActivityInstances[0].activityId
    activityName = value.childActivityInstances[0].activityName
    return {"id": activityId, "name": activityName}
}