export default {
    id: "contextTestID",
    pluginPoint: "cockpit.processInstance.runtime.tab",
    properties: {
        label: "Context"
    },
    render: async (node, {api, processInstanceId}) => {
        const activity = await getCurrentActivity(api, processInstanceId)
        const activityId = await activity.id

        // Process: Vacation Request
        // Activity: Check request by Department Manager
        if (activityId === "check_dm") {
            const projects = await getProjects().valueOf();
            const project_names = []
            const project_hours = []
            for (const k in projects) {
                const project = projects[k];
                project_names.push(project.Name);
                project_hours.push(project.Hours)
            }
            const employees = await getEmployees().valueOf();
            const employee_names = [];
            const employee_hours = [];
            for (const e in employees) {
                const employee = employees[e];
                employee_names.push(employee.Name);
                employee_hours.push(employee.Weekly_hours)
            }
            console.log(employee_names)
            console.log(employee_hours)
            node.innerHTML = `
                <div style="width: 100%; height: 100%; padding-block: 20px; margin: auto; text-align: center;">
                    <div style="float:left; width:auto; height: auto; border-width: thin; border-color: lightgray; border-style: solid; border-radius: 10px; margin: 10px;">
                        <div style="padding-block: 5px;">
                            <span style="width: 100%; font-size: x-large; margin: 20px;">
                                Needed hours for ongoing projects
                            </span>
                        </div>
                        <div style="padding-block: 5px;">   
                            <canvas id="projectsDoughnut" width="10" height="10"></canvas>
                        </div>
                    </div>
                    <div style="float:left; width: 600px; height: auto; border-width: thin; border-color: lightgray; border-style: solid; border-radius: 10px; margin: 10px;">
                        <div style="padding-block: 5px;">
                            <span style="width: 100%; font-size: x-large; margin: 20px">
                                Weekly hours per employee
                            </span>
                        </div>
                        <div style="padding-block: 5px;">   
                            <canvas id="weeklyHoursChart" width="50" height="20"></canvas>
                        </div>
                    </div>
                </div>
            `;
            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/npm/chart.js";
            script.onload = () => {
                const pd = document.getElementById('projectsDoughnut').getContext('2d');
                const projectsDoughnut = new Chart(pd, {
                    type: 'doughnut',
                    data: {
                        labels: project_names, //['Project 1', 'Project 2', 'Project 3', 'Project 4', 'Project 5', 'Unused hours']
                        datasets: [{
                            label: 'needed hours',
                            data: project_hours, //[120, 190, 300, 150, 90, 350]
                            backgroundColor: [
                                'rgba(35,128,48, 0.8)',
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(255,131,64,0.2)',
                                'rgba(255, 205, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(201, 203, 207, 0.2)'
                            ],
                            borderColor: [
                                'rgb(35,128,48)',
                                'rgb(255, 99, 132)',
                                'rgb(255, 131, 64)',
                                'rgb(255, 205, 86)',
                                'rgb(75, 192, 192)',
                                'rgb(54, 162, 235)',
                                'rgb(153, 102, 255)',
                                'rgb(201, 203, 207)'
                            ],
                            borderWidth: 1,
                            radius: '80%',
                            spacing: 7,
                            cutout: '70%',
                            rotation: 50
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
                                text: 'workload'
                            }
                        }
                    }
                });
                // weekly hours for every employee
                const whc = document.getElementById('weeklyHoursChart').getContext('2d');
                const whChart = new Chart(whc, {
                    type: 'bar',
                    data: {
                        labels: employee_names,
                        datasets: [{
                            label: 'weekly hours',
                            data: employee_hours,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(255, 159, 64, 0.2)',
                                'rgba(255, 205, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(201, 203, 207, 0.2)'
                            ],
                            borderColor: [
                                'rgb(255, 99, 132)',
                                'rgb(255, 159, 64)',
                                'rgb(255, 205, 86)',
                                'rgb(75, 192, 192)',
                                'rgb(54, 162, 235)',
                                'rgb(153, 102, 255)',
                                'rgb(201, 203, 207)'
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
        // Process: Vacation Request
        // Activity: Check request by Group Leader
        else if (activityId === "check_gl") {
            node.innerHTML = `
                <div>
                    context for group leader comes here soon ...
                    <canvas id="pastRequestChart"></canvas>
                </div>
            `
            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/npm/chart.js";
            script.onload = () => {
                const pd = document.getElementById('pastRequestsChart').getContext('2d');
                const projectsDoughnut = new Chart(pd, {
                    type: 'bar',
                    data: {
                        labels: employee_names,
                        datasets: [{
                            label: 'accepted applications',
                            data: employee_applications_accepted,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(255, 159, 64, 0.2)',
                                'rgba(255, 205, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(201, 203, 207, 0.2)'
                            ],
                            borderColor: [
                                'rgb(255, 99, 132)',
                                'rgb(255, 159, 64)',
                                'rgb(255, 205, 86)',
                                'rgb(75, 192, 192)',
                                'rgb(54, 162, 235)',
                                'rgb(153, 102, 255)',
                                'rgb(201, 203, 207)'
                            ],
                            borderWidth: 1
                        },{
                            label: 'rejected applications',
                            data: employee_applications_rejected

                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                                stacked: true
                            }
                        }
                    }
                });
            }
        }
        //without special context
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

async function getCompletedProcesses() {
    const response = await fetch("http://localhost:8080/completed-processes");
    return await response.json();
}

async function getApplicationStatistic() {
    // employee_name, #rejected_applications, #accepted_applications
    const completed_processes = getCompletedProcesses();
    for (const p in completed_processes) {
        const process = completed_processes[p];
        if (process.processDefinitionKey === 'leave_request') {
            if (process.endActivityId === 'application_accepted') {

            }
            else if (process.endActivityId === 'application_rejected') {

            }
        }
    }
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